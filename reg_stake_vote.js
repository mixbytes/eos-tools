const common = require('./common');
const axios = require('axios');
const Eos = require('eosjs');

common.run({name: 'EOS auto reg as BP, stake and vote tool', version: '0.0.2'})
    .then(async (app) => {

        let params = app.parseArgs([
            {name: ['--api_url', '-a'], opts: {required: true, description: 'url to EOS node'}},
            {name: ['--name', '-n'], opts: {required: true, description: 'name of BP account'}},
            {name: ['--public_key', '-p'], opts: {required: true, description: 'BP public key'}},
            {name: ['--bp_url', '-u'], opts: {required: true, description: 'BP site URL'}},
        ]);

        params.private_key = await app.stdinQuestion('Enter private key for ' + params.name + '\n');

        let getInfoResp = await axios.get(params.api_url+'/v1/chain/get_info');
        if (getInfoResp.status !== 200)
            return console.log('get_info error');

        let eos = Eos({
            chainId: getInfoResp.data.chain_id,
            keyProvider: params.private_key,
            httpEndpoint: params.api_url,
        });

        let balance = await eos.getCurrencyBalance('eosio.token', params.name);
        let eosBalance = balance.find(b => b.endsWith('EOS'));
        let forStake
        if (eosBalance) {
            let eosBalanceParsed = parseFloat(eosBalance.split('.')[0])
            console.log('Account balance: ' + eosBalance)
            forStake = Eos.modules.format.UDecimalPad(eosBalanceParsed / 2, 4) + ' EOS'
        } else {
            console.log('EOS tokens not found')
        }



        try {
            let trx = await eos.transaction('eosio', (system) => {

                system.regproducer({
                    'producer': params.name,
                    'producer_key': params.public_key,
                    'url': params.bp_url,
                    'location': 0
                });

                if (forStake) {
                    system.delegatebw({
                        'from': params.name,
                        'receiver': params.name,
                        'stake_net_quantity': forStake,
                        'stake_cpu_quantity': forStake,
                        'transfer': 0
                    });
                }

                system.voteproducer({
                    'voter': params.name,
                    'proxy': '',
                    'producers': [params.name]
                });
            });

            console.log("OK voted: " + eosBalance);
            console.log(trx);
        }
        catch (e) {
            console.log("Fail");
            console.log(e);
        }
    });

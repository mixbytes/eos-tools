const common = require('./common');
const axios = require('axios');
const Eos = require('eosjs');

common.run({name: 'EOS auto stake and vote tool', version: '0.0.2'})
    .then(async (app) => {

        let params = app.parseArgs([
            {name: ['--url', '-u'], opts: {required: true, description: 'url to EOS node'}},
            {name: ['--name', '-n'], opts: {required: true, description: 'name of voter account'}},
            {name: ['--target', '-t'], opts: {required: true, description: 'target account name'}},
        ]);

        params.key = await app.stdinQuestion('Enter private key for ' + params.name + '\n');

        let getInfoResp = await axios.get(params.url+'/v1/chain/get_info');
        if (getInfoResp.status !== 200)
            return console.log('get_info error');

        let eos = Eos({
            chainId: getInfoResp.data.chain_id,
            keyProvider: params.key,
            httpEndpoint: params.url,
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
                    'producers': [params.target]
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

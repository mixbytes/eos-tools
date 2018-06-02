const common = require('./common');
const axios = require('axios');
const Eos = require('eosjs');

common.run({name: 'EOS stake tool', version: '0.0.2'})
    .then(async (app) => {

        let params = app.parseArgs([
            {name: ['--url', '-u'], opts: {required: true, description: 'url to EOS node'}},
            {name: ['--name', '-n'], opts: {required: true, description: 'name of account'}},
            {name: ['--amount', '-a'], opts: {required: true, description: 'EOS amount (in format 12.4567)'}},
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

        try {
            let trx = await eos.transaction('eosio', (system) => {
                system.undelegatebw({
                    'from': params.name,
                    'receiver': params.name,
                    'unstake_net_quantity': params.amount + ' EOS',
                    'unstake_cpu_quantity': params.amount + ' EOS',
                });
                system.refund({
                    'owner': params.name
                });
            });

            console.log("OK staked");
            console.log(trx);
        }
        catch (e) {
            console.log("Fail");
            console.log(e);
        }
    });

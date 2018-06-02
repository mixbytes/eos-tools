const common = require('./common');
const axios = require('axios');
const Eos = require('eosjs');

common.run({name: 'EOS stake tool', version: '0.0.2'})
    .then(async (app) => {

        let params = app.parseArgs([
            {name: ['--url', '-u'], opts: {required: true, description: 'url to EOS node'}},
            {name: ['--name', '-n'], opts: {required: true, description: 'name of voter account'}},
            {name: ['--net'], opts: {required: true, description: 'stake for net'}},
            {name: ['--cpu'], opts: {required: true, description: 'stake for cpu'}},
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
                system.delegatebw({
                    'from': params.name,
                    'receiver': params.name,
                    'stake_net_quantity': params.net,
                    'stake_cpu_quantity': params.cpu,
                    'transfer': 0
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

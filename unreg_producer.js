const common = require('./common');
const axios = require('axios');
const Eos = require('eosjs');

common.run({name: 'EOS auto stake and vote tool', version: '0.0.2'})
    .then(async (app) => {

        let params = app.parseArgs([
            {name: ['--api_url', '-a'], opts: {required: true, description: 'url to EOS node'}},
            {name: ['--name', '-n'], opts: {required: true, description: 'name of BP account'}}
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

        try {
            let trx = await eos.transaction('eosio', (system) => {

                system.unregprod({
                    'producer': params.name
                });

            });

            console.log("OK unreg");
            console.log(trx);
        }
        catch (e) {
            console.log("Fail");
            console.log(e);
        }
    });

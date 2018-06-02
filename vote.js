const common = require('./common');
const axios = require('axios');
const Eos = require('eosjs');

common.run({name: 'EOS voting tool', version: '0.0.2'})
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

        try {
            let trx = await eos.transaction('eosio', (system) => {
                system.voteproducer({
                    'voter': params.name,
                    'proxy': '',
                    'producers': [params.target]
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
const common = require('./common');
const axios = require('axios');
const Eos = require('eosjs');

common.run({name: 'Create account', version: '0.0.1'})
    .then(async (app) => {

        let params = app.parseArgs([
            {name: ['--url', '-u'], opts: {required: true, description: 'url to EOS node'}},
            {name: ['--owner', '-o'], opts: {required: true, description: 'name of account owner, who creates new account. "eosio" for init configuration'}},
            {name: ['--name', '-a'], opts: {required: true, description: 'name of new account'}},
            {name: ['--pubkey', '-p'], opts: {required: true, description: 'Public key of owner'}},
        ]);

        params.key = await app.stdinQuestion('Enter private key for ' + params.owner + '\n');

        let getInfoResp = await axios.get(params.url+'/v1/chain/get_info');
		// [TODO] output much more info about error, (connection, response) and move to separate function pingNode
		if (getInfoResp.status !== 200)
            return console.log('get_info error');

        let eos = Eos({
            chainId: getInfoResp.data.chain_id,
            keyProvider: params.key,
            httpEndpoint: params.url,
        });

        try {
            let trx = await eos.transaction('eosio', (system) => {
   				system.newaccount({
    					creator: params.owner,
    					name: params.name,
					owner: params.pubkey,
					active: params.pubkey,
				});
            });

            console.log("Account created, tx: ");
            console.log(trx);
        }
        catch (e) {
            console.log("Fail");
            console.log(e);
        }
    });

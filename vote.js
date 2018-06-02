const Eos = require('eosjs');
const argparse = require("argparse");
const axios = require('axios');

let parser = new argparse.ArgumentParser({
    version: '0.0.1',
    addHelp: true,
    description: 'EOS voting tool'
});

parser.addArgument(['--url', '-u'], {
    defaultValue: 'http://127.0.0.1:8888', description: 'url to EOS node'
});

parser.addArgument(['--key', '-k'], {
    required: true, description: 'private key'
});

parser.addArgument(['--name', '-n'], {
    required: true, description: 'name of voter account'
});

parser.addArgument(['--target', '-t'], {
    required: true, description: 'target name'
});

let args = parser.parseArgs();


axios.get(args.url+'/v1/chain/get_info')
    .then(resp => {
        if (resp.status !== 200)
            return console.log('get_info error');

        let eos = Eos({
            chainId: resp.data.chain_id,
            keyProvider: args.key,
            httpEndpoint: args.url,
        });

        eos.transaction('eosio', (system) => {
            system.voteproducer({
                'voter': args.name,
                'proxy': '',
                'producers': [args.target]
            });
        }).then(res => {
            console.log("OK voted");
            console.log(res);
        }).catch(e => {
            console.log("Fail");
            console.log(e);
        });
    })
    .catch(console.error);

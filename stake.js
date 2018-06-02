const Eos = require('eosjs');
const argparse = require("argparse");
const axios = require('axios');

let parser = new argparse.ArgumentParser({
    version: '0.0.1',
    addHelp: true,
    description: 'EOS staking tool'
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

parser.addArgument(['--net'], {
    required: true, description: 'stake for net'
});

parser.addArgument(['--cpu'], {
    required: true, description: 'stake for cpu'
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
            system.delegatebw({
                'from': args.name,
                'receiver': args.name,
                'stake_net_quantity': args.net,
                'stake_cpu_quantity': args.cpu,
                'transfer': 0
            });
        }).then(res => {
            console.log("OK staked");
            console.log(res);
        }).catch(e => {
            console.log("Fail");
            console.log(e);
        });
    })
    .catch(console.error);
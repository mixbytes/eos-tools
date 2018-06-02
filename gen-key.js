const Eos = require('eosjs');

Eos.modules.ecc.randomKey()
    .then(key => {
        console.log("Public: ", Eos.modules.ecc.privateToPublic(key));
        console.log("Private: ", key);
    });
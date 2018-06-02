const readline = require('readline');
const argparse = require("argparse");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let params = {
    name: '',
    version: '',
};

async function stdinQuestion(question, checker = null) {
    return new Promise(resolve => {
        rl.question(question, (answer) => {
            rl.close();
            if (checker && !checker(answer))
                throw new Error('checker fail');

            resolve(answer);
        });
    });
}

function parseArgs(argList) {
    let parser = new argparse.ArgumentParser({
        version: params.version,
        addHelp: true,
        description: params.name,
    });

    argList.forEach(item => {
        parser.addArgument(item.name, item.opts || {});
    });

    return parser.parseArgs();
}


module.exports = {
    run: (par) => {
        params = par;

        return new Promise(resolve => {
            resolve({
                parseArgs: parseArgs,
                stdinQuestion: stdinQuestion,
            });
        })
    }
};
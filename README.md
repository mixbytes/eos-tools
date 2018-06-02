# eos-tools

gen-key.js - generates EOS keypair

stake.js - stakes NET and CPU resources

vote.js - votes for Block Producer


# how to vote

1. Clone repository:
```git clone https://github.com/mixbytes/eos-tools.git```
2. Go to the repository dir
```cd eos-tools```
3. Install dependencies
```npm install```
4. Stake all EOS tokens and vote with staked tokens for block producer
```nodejs stake_vote.js --url=https://public.eos.node.url --name=your_account --target=block_producer```
5. Type your private key
6. Press enter

# Example of voting in jungle testnet http://dev.cryptolions.io/

```nodejs stake_vote.js --url=http://api.komododragon.eosbp.mixbytes.io:8888 --name=fireballplus --target=komododragon```


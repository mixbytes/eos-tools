# eos-tools

IMPORTANT! Script for programmers. Private key required, so please, see the code for ensure that script is safe before typing private keys. Provided as is.

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
```nodejs stake_vote.js --url=http://public.eos.node.url --name=your_account --target=block_producer```
5. Type your private key
6. Press enter

## Example of voting in jungle testnet http://dev.cryptolions.io/

```nodejs stake_vote.js --url=http://api.komododragon.eosbp.mixbytes.io:8888 --name=fireballplus --target=komododragon```

# Register as BP, stake and vote in one command

```nodejs reg_stake_vote.js --api_url=https://public.eos.node.url --name=bp_acc_name --public_key=pb_public_key --bp_url=bp_url```

## Example in jungle testnet
```nodejs reg_stake_vote.js --api_url=http://api.komododragon.eosbp.mixbytes.io:8888 --name=fireballplus --public_key=EOS57TjSJH3xvHKYroBn4z9JKBBDmHbJ5xgbHAh6YqggcC7YswW3R --bp_url=https://mixbytes.io```

# Unregister as BP

```nodejs unreg_producer.js --api_url=https://public.eos.node.url --name=bp_acc_name```

## Example in jungle testnet
```nodejs unreg_producer.js --api_url=http://api.komododragon.eosbp.mixbytes.io:8888 --name=fireballplus```
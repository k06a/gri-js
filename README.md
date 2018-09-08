# Gaia Protocol Reference Implementation

## Project Directory
Project Contains:
1. gaia-iot-sdk: client SDK for IoT Devices
2. gaia-poa-chain: a blockchain running on proof of authority validator 
    - gaia-db: persistent on disk database containing climate data
    - gaia-rootchain: smart contracts to be deployed on Ethereum blockchain

for the sake of simplicity, current construction will include one datablob per
1 block, and each block will be processed in sequential order (First in, Last out)

## Installation 
First, ensure that you have latest version of Node JS and NPM installed

Installing for `Gaia Chain`
1. cd into gaia-poa-chain
2. run `npm install`

Installing for `Gaia Plasma Contract`
1. install truffle globally via `npm install -g truffle`
1. install Ganache-cli globally via `npm install -g ganache-cli`

Installing for `gaia-iot-sdk`
1. 

## Getting Started
### Deploy Plasma Contract on Testnet Blockchain
1. cd into gaia-rootchain directory
1. Run `ganache-cli --defaultBalanceEther 100000000`
2. Run following command to deploy the Plasma Contract `truffle deploy`

the Rootchain Contract should be deployed with an address shown on your console

### Running the Gaia Chain
1. cd into gaia-poa-chain
2. start the chain up by running following command `node gaia`

You should now have the Proof of Authority blockchain started on port 3000

### Running the Gaia IoT SDK 
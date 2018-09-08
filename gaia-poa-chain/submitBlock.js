const GaiaArtifact = require('./gaia-rootchain/build/contracts/RootChain.json');
const abi = require('./gaia-rootchain/plasmaAbi')
let Web3 = require('web3');
let web3 = new Web3('http://localhost:8545')    


const plasmaContract = new web3.eth.Contract(abi.abi, "0x8524c56f77008e41c5a5d83fc66a3e7318320656");
console.log(plasmaContract)

plasmaContract.methods.deposit().send({from: '0xdc7ea9bc7bb39f68deff4cd6a7c505ce8f1e45af', value: 10000000000000000000}, function(error, transactionHash){
    console.log(transactionHash)
});
const GaiaArtifact = require('./gaia-rootchain/build/contracts/RootChain.json');
const abi = require('./gaia-rootchain/plasmaAbi')
let Web3 = require('web3');
let web3 = new Web3('http://localhost:8545')    


const plasmaContract = new web3.eth.Contract(abi.abi, "0x8524c56f77008e41c5a5d83fc66a3e7318320656");
console.log(plasmaContract)
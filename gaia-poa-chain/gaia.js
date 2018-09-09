/*
The MIT License (MIT)
=====================

Copyright © `2018` `Pong Cheecharern, Gain Kenchayuth`

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the “Software”), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
*/


const SHA256 = require("crypto-js/sha256");
const EthCrypto = require('eth-crypto');
const express = require('express')
const app = express()
const storage = require('node-persist');
const GaiaArtifact = require('./gaia-rootchain/build/contracts/RootChain.json');
const abi = require('./gaia-rootchain/plasmaAbi')
let Web3 = require('web3');
let web3 = new Web3('http://localhost:8545')    

//root chain config 
let contractAddr = "0x09bd8313abb2c975ba596231eb229e7f14ef0b69"
let operatorAddr = "0x6d9393414c3bede27343b1a65323331ed614a0c2"
const plasmaContract = new web3.eth.Contract(abi.abi, contractAddr);
console.log("Root Chain address at: " + contractAddr)

//initialize gaia persistent database
storage.init({
	dir: './gaia-db',
	stringify: JSON.stringify,
	parse: JSON.parse,
    encoding: 'utf8'
});

//creates Identity for the Validating Node
const validatorWallet = EthCrypto.createIdentity();
console.log("your wallet address:" + validatorWallet.address)

//public key, private key and address of the validator wallet
const pubKey = validatorWallet.publicKey
const privKey = validatorWallet.privateKey
const address = validatorWallet.address

//default genesis block for gaia protocol
let genesis = {
    terraform: "Climate Innovation will be Decentralized",
    blockHash: "5AA762AE383FBB727AF3C7A36D4940A5B8C40A989452D2304FC958FF3F354E7A"
}
//the blockchain
let blockchain = [genesis]
//the datapool
let dataPool = []
//current nonce 
let nonce = 0

//this creates blocks
class Block {
    //a block has: 1. Data 2. Timestamp 3. prevHash 4. blockHash 5. Nonce
    constructor(_data, _blockhash, _prevhash){
        this.timestamp = Date.now()
        this.data = _data
        this.prevHash = _prevhash
        this.nonce = nonce ++
        this.blockHash = _blockhash
    }

}

async function hash(_prevHash, _data, _nonce) {
    return  SHA256(JSON.stringify(_prevHash) + JSON.stringify(_data) + JSON.stringify(nonce))
}

//this is an example blob of Data
class Data {
    //data contains 1. LoggedTime 2. ownerAddress 3. Metadata 
    constructor(_content, _owner, _metaData){
        this.content = _content
        this.owner = _owner
        this.metaData = _metaData
    }

}

 //this will encrypt the raw data with validator's private key on to the blockchain
 async function encryptData(publicKey, dataContent){
    const encrypted = await EthCrypto.encryptWithPublicKey(publicKey, dataContent.toString())
    const encryptedString = EthCrypto.cipher.stringify(encrypted)
    return encryptedString
}

//this will add data to the beginning dataPool 
async function addDataToPool(newData, newMetaData){
    dataPool.unshift({data:newData, meta:newMetaData})
}

//this will generate new block on the POA blockchain
async function addBlock(block){
    //blockchain.push(block)
    await storage.setItem(nonce.toString(), block)
}

//this will publish current block hash to a Plasma contract

//this will mine and submit new block
async function mineAndSubmitBlock(){
    //PROCESS DATA
    let obj = dataPool.pop()
    const encryptedData = await encryptData(pubKey, obj.data)
    const d = await new Data(encryptedData, address, obj.meta)
    
    //MINE NEW BLOCK
    let lastBlock = await storage.getItem(nonce.toString());
    newBlockHash = await hash(lastBlock.blockHash + d.encryptedData + nonce)
    const b = await new Block(d, newBlockHash.toString(), lastBlock.blockHash)
    const myBlockchain = await addBlock(b)
    let storedBlock = await storage.getItem(nonce.toString());
    let blockNum = storedBlock.nonce + 1 
    console.log("block number "+ blockNum +" block hash is " + JSON.stringify(storedBlock.blockHash))

    //SUBMIT NEW BLOCK TO ROOTCHAIN
    let newBlock = `0x${storedBlock.blockHash}`
    plasmaContract.methods.submitBlock(newBlock).send({from: operatorAddr}, function(error, transactionHash){
        console.log("blockhash submitted to rootchain with hash:" + transactionHash)
    });
}
//RESTFUL ENDPOINT

app.use(express.json());

app.post('/submitData', (req, res) => {
    res.status(200).json({success: "Data Submitted to DataPool"});
    //console.log(req)
    addDataToPool(req.body.data, req.body.meta)
})

//open port
app.listen(3000, () => console.log('Gaia Chain endpoint open at port:3000'))

//THIS IS SAMPLE MOCK DATA
let mockData = {
    temperature: 100
}

let mockMeta = {
    coordinates: "chiangmai",
    deviceType: "temperature_sensor",
    date: Date.now()
}


//this will mine and submit new block to the rootchain every 5 seconds
setInterval(async function() {
    //await storage.clear();
    await storage.setItem('0',genesis)
    //uncomment below to add data directly with a mock data
    //await addDataToPool(mockData, mockMeta)
    //console.log(dataPool)
    await mineAndSubmitBlock()
    //console.log(await storage.getItem(nonce.toString()));
}, 5000);

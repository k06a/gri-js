const SHA256 = require("crypto-js/sha256");
const EthCrypto = require('eth-crypto');
const express = require('express')
const app = express()

//creates Identity for the Validating Node
const validatorWallet = EthCrypto.createIdentity();

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
    constructor(_data, _blockhash){
        this.timestamp = Date.now()
        this.data = _data
        this.prevHash = blockchain[blockchain.length - 1].blockHash
        this.nonce = nonce ++
        this.blockHash = _blockhash
    }

}

async function hash(_prevHash, _data, _nonce) {
    return  SHA256(_prevHash + _data + nonce)
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
    blockchain.push(block)
}

//this will publish current block hash to a Plasma contract

//this will mine and submit new block
async function mineAndSubmitBlock(){
    let obj = dataPool.pop()
    const encryptedData = await encryptData(pubKey, obj.data)
    //stire encrypted data and necessary params
    const d = await new Data(encryptedData, address, obj.meta)
    console.log(d)
    //preparing Blockchain
    newBlockHash = await hash(blockchain[blockchain.length - 1].blockHash + d + nonce)
    const b = await new Block(d, newBlockHash.toString())
    console.log(b)
    const myBlockchain = await addBlock(b)
    console.log("block number "+ blockchain.length +" block hash is " + JSON.stringify(blockchain[blockchain.length - 1].blockHash))
}
//RESTFUL ENDPOINT
app.post('/submitData', (req, res) => {
    res.send('Data Submited to Gaia Chain')
    addDataToPool(req.data, req.meta)
})

//open port
app.listen(3000, () => console.log('Gaia Chain endpoint open at port:3000'))
//THIS IS MOCK DATA
let mockData = {
    temperature: 10
}

let mockMeta = {
    coordinates: "bangkok",
    deviceType: "temperature_sensor",
    date: Date.now()
}


//this will mine and submit new block to the rootchain every 5 seconds
setInterval(async function() {
    //add data directly using mock data
    await addDataToPool(mockData, mockMeta)
    //console.log(dataPool)
    await mineAndSubmitBlock()
}, 5000);



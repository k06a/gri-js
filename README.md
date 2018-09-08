Gaia Protocol Reference Implementation

Project Contains:
1. gaia-client-sdk: client SDK for IoT Devices
2. gaia-poa-chain: a blockchain running on proof of authority validator 
    - gaia-db: persistent on disk database containing climate data
    - gaia-rootchain: smart contracts to be deployed on Ethereum blockchain

for the sake of simplicity, current construction will include one datablob per
1 block, and each block will be processed in sequential order (First in, Last out)
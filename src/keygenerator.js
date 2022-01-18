const EC = require('elliptic').ec
const ec = new EC('secp256k1');

const key = ec.genKeyPair();
const publicKey = key.getPrivate('hex');
const privateKey = key.getPrivate('hex');

//this is line generate of private key example: c1610fcbaa50e48a9b6694f9b738429471897bb4c65bcbe6cd483f8a15192069
console.log();
console.log('Private Key',privateKey);

//this is line generate public key example: c1610fcbaa50e48a9b6694f9b738429471897bb4c65bcbe6cd483f8a15192069 
console.log();
console.log('Public Key',publicKey);
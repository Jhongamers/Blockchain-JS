//instantiate class as Blockchain,Transactions
const {Blockchain,Transaction} = require('./blockchain');
//key crypto library
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
//the private key
const myKey = ec.keyFromPrivate('c1610fcbaa50e48a9b6694f9b738429471897bb4c65bcbe6cd483f8a15192069');

//public key
const myWalletAddress = myKey.getPublic('hex');

let scriptCoin = new Blockchain();

const tx1 = new Transaction(myWalletAddress, 'public key goes here', 10);
tx1.signTransaction(myKey);
scriptCoin.addTransaction(tx1);


console.log('\n Starting the miner...');
scriptCoin.minePendingTransactions(myWalletAddress);

console.log('\nBalance of John is', scriptCoin.getBalanceOfAddress(myWalletAddress));


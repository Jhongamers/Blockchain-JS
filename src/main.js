//instantiate class as Blockchain,Transactions
const {Blockchain,Transaction} = require('./blockchain');
//key crypto library
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

//this line create variable is responsible for capturing the private key placed in the console
const privtkey = process.argv[2];

//this is line is responsible for cheking if private key has been filled
if(privtkey!=null){

// exemplo private key c1610fcbaa50e48a9b6694f9b738429471897bb4c65bcbe6cd483f8a15192069
const myKey = ec.keyFromPrivate(privtkey);

//public key
const myWalletAddress = myKey.getPublic('hex');

let scriptCoin = new Blockchain();

const tx1 = new Transaction(myWalletAddress, 'public key goes here', 10);
tx1.signTransaction(myKey);
scriptCoin.addTransaction(tx1);


console.log('\n Starting the miner...');
scriptCoin.minePendingTransactions(myWalletAddress);

//you can change this field and put your name 
console.log('\nBalance of John is', scriptCoin.getBalanceOfAddress(myWalletAddress));

}else{
    console.log('please write the argument in the console with private key');
}
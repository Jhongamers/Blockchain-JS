const SHA256 = require('crypto-js/sha256');
const EC = require('elliptic').ec
const ec = new EC('secp256k1');
//class transactions
class Transaction{
    constructor(fromAddress,toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress   = toAddress;
        this.amount      = amount;
    }
    calculateHash(){
        return SHA256(this.fromAddress + this.toAddress + this.amount).toString();
    }
    signTransaction(signingKey){
        if(signingKey.getPublic('hex') !== this.fromAddress){
            throw new Error('You cannot sign transactions for other wallets!');
        }

        const hashTx = this.calculateHash();
        const sig = signingKey.sign(hashTx,'base64');
        this.signature = sig.toDER('hex');
    }
    isValid(){
        if(this.fromAddress === null) return true;

        if(!this.signature || this.signature.length === 0){
            throw new Error('No signature in this transactions');
        }
        const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
        return publicKey.verify(this.calculateHash(), this.signature);
    }
}
//class block
class Block{
    constructor( timestamp,transactions,previousHash =''){
        this.timestamp = timestamp;
        this.transactions    = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }
    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();

    }
    mineBlock(dificulty){
        while(this.hash.substring(0,dificulty) !== Array(dificulty + 1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("Blockc Mined: " + this.hash);
    }

    hasValidTransactions(){
        for(const tx of this.transactions){
            if(!tx.isValid()){
                return false;
            }
        }
        return true;
    }
    
}
//class blockchain
class Blockchain{
    constructor(){
        this.chain = [this.createGenisisBlock()];
        this.dificulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }


    //create genisis block
    createGenisisBlock(){
        return new Block("17/01/2022","Genisis Block","0");
    }
    //get latestblock 
    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }
    //mine transactions pending in the blockchain
    minePendingTransactions(miningRewardAddress){
        const rewardTx = new Transaction(null,miningRewardAddress,this.miningReward);
        this.pendingTransactions.push(rewardTx);

        let block = new Block(Date.now(), this.pendingTransactions,this.getLatestBlock().hash);
        block.mineBlock(this.dificulty);

        console.log('Block sucessfullly mined!');
        this.chain.push(block);

        this.pendingTransactions = [];
    }
    //add a transaction 
    addTransaction(transaction){

        if(!transaction.fromAddress ||!transaction.toAddress){
            throw new Error('Transaction must include from and to address');
        }
        if(!transaction.isValid()){
            throw new Error('Cannot add invalid transaction to chain');
        }
        this.pendingTransactions.push(transaction);
    }
    //get balance address 
    getBalanceOfAddress(address){
        let balance = 0;

        for(const block of this.chain){
            for(const trans of block.transactions){
                if(trans.fromAddress === address){
                    balance -= trans.amount;
                }
                if(trans.toAddress === address){
                    balance += trans.amount;
                }
            }
        }
        return balance;
    }
    //checking if valid chain
    isChainValid(){
        for(let i=1; i<this.chain.length;i++){
            const currentBlock = this.chain[i];
            const previousHash = this.chain[i - 1];
            
            if(!currentBlock.hasValidTransactions()){
                return false;
            }

            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }
            if(currentBlock.previousHash !== previousHash.hash){
                return false;
            }
            
        }
        return true;
    }
}

//exports blockchain and transactions example the code in the page main use it's class Blockchain and Transaction
module.exports.Blockchain  = Blockchain;
module.exports.Transaction = Transaction;
const txnBlacklistTracker = require('../models/txn-blacklist.model.js');

// blacklist a transaction
exports.blacklist = (req, res) => {
	 // Validate request
    if(!req.body.transactionHash) {
        return res.status(400).send({
            message: "Empty-Transaction content can not be blacklisted"
        });
    }

    // blacklist the transaction
    //add it to txn-blacklist model
    const transactionBlacklistEntity = new txnBlacklistTracker({
        ContractAddress: req.body.ContractAddress, 
        TxHash: req.body.transactionHash
    });

      console.log('saving BlacklistedTransactionEntity: '+transactionBlacklistEntity);

     transactionBlacklistEntity.save()
    	.then(data => {
        				res.send(data);
    }).catch(err => {
        res.status(500).send({
            transactionHash: req.body.transactionHash,
            message: err.message || "Some error occurred while Blacklisting the Transaction entry."
        });
    });
};

// unblacklist a transaction
exports.unblacklist = (req, res) => {

    // Validate request
    if(!req.body.transactionHash) {
        return res.status(400).send({
            transactionHash: req.body.transactionHash,
            message: "Empty-Transaction content can not be unblacklisted"
        });
    }

    console.log('about to unblacklist transaction: '+req.body.transactionHash);

     txnBlacklistTracker.unblacklistTransactionByTransactionHash(req.body.transactionHash,
            function(error, txn){
              if(!error){

                 return res.status(200).send({
                                transactionHash: req.body.transactionHash,
                                message: "unBlacklisted-Transaction successfully for transactionHash " + req.body.transactionHash
                            });  

                }else{
                        if(error.kind === 'ObjectId') {
                            return res.status(404).send({
                                transactionHash: req.body.transactionHash,
                                message: "unblacklisted-Transaction not found with transactionHash " + req.body.transactionHash
                            });                
                        }
                        return res.status(500).send({
                                transactionHash: req.body.transactionHash,
                                message: "Could not delete unblacklisted-Transaction with transactionHash " + req.body.transactionHash
                        });    
                     }
          });
};


// fetch all blacklisted transactions
exports.fetchAllBlacklisted = (req, res) => {
 txnBlacklistTracker.getBlacklistedTransactionsOrderedByBlockIndex(
        function(error, txns){
          if(!error){
            res.send(txns);
            }else{
                    res.status(500).send({
                        transactionHash: req.body.transactionHash,
                    message: err.message || "Some error occurred while retrieving blacklisted transactions."
                        }); 
                 }
      })
};


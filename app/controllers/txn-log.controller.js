const txnLogModel = require('../models/txn-log.model.js');


// Retrieve all token transactions
exports.fetchAllTokenTxns = (req, res) => {
       
        txnLogModel.getTransactionLogsOrderedByBlockIndex(
        function(error, txns){
          if(!error){
            res.send(txns);
            }else{
                    res.status(500).send({
                    message: err.message || "Some error occurred while retrieving transactions."
                        }); 
                 }
      })

};

// Retrieve a single transaction with hash
exports.fetchOneTokenTxn = (req, res) => {

    txnLogModel.getTransactionLogByTransactionHash(req.params.transactionHash,
            function(error, txn){
              if(!error){
                res.send(txn);
                }else{
                      
                        if(error.kind === 'ObjectId') {
                            return res.status(404).send({
                                message: "transaction not found with id " + req.params.transactionHash
                            });                
                        }
                        return res.status(500).send({
                            message: "Error retrieving transaction with id " + req.params.transactionHash
                        });    
                     }
          })
};

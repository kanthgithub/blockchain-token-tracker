const txntracker = require('../models/txn-tracker.model.js');
const fastCsv = require('fast-csv');
const json2csv = require('json2csv').parse;
const Json2csvParser = require('json2csv').Parser;

// bookmark a transaction
exports.bookmark = (req, res) => {
	 // Validate request
    if(!req.body.transactionHash) {
        return res.status(400).send({
            message: "Empty-Transaction content can not be bookmarked"
        });
    }


    // bookmark the transaction
    //add it to txn-tracker model
    const transactionTrackerEntity = new txntracker({
        ContractAddress: req.body.ContractAddress, 
        TxHash: req.body.transactionHash
    });

      console.log('saving transactionTrackerEntity: '+transactionTrackerEntity);

     transactionTrackerEntity.save()
    	.then(data => {
        				res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Transaction-Tracker entry."
        });
    });
};

// unbookmark a transaction
exports.unbookmark = (req, res) => {

		 // Validate request
    if(!req.body.transactionHash) {
        return res.status(400).send({
            message: "Empty-Transaction content can not be unbookmarked"
        });
    }

	console.log('about to unbookmark transaction: '+req.body.transactionHash);

	 txntracker.unbookmarkTransactionByTransactionHash(req.body.transactionHash,
            function(error, txn){
              if(!error){

              	 return res.status(200).send({
              	 	            transactionHash: req.body.transactionHash,
                				message: "unBookmarked-Transaction successfully for transactionHash " + req.body.transactionHash
                            });  
                }else{
                      
                        if(error.kind === 'ObjectId') {
                            return res.status(404).send({
                            	transactionHash: req.body.transactionHash,
                				message: "Bookmarked-Transaction not found with transactionHash " + req.body.transactionHash
                            });                
                        }
                        return res.status(500).send({
                        	    transactionHash: req.body.transactionHash,
            					message: "Could not delete Bookmarked-Transaction with transactionHash " + req.body.transactionHash
                        });    
                     }
          });
};

// fetch all bookmarked transactions
exports.fetchAllBookmarks = (req, res) => {
  txntracker.getBookmarkedTransactionsOrderedByBlockIndex(
        function(error, txns){
          if(!error){



            res.send(txns);
            }else{
                    res.status(500).send({
                    	transactionHash: req.body.transactionHash,
                    message: err.message || "Some error occurred while retrieving transactions."
                        }); 
                 }
      })
};

// fetch one bookmarked transaction
exports.fetchOneBookmark = (req, res) => {

    txntracker.getTransactionByTransactionHash(req.params.transactionHash,
            function(error, txn){
              if(!error){
                res.send(txn);
                }else{
                      
                        if(error.kind === 'ObjectId') {
                            return res.status(404).send({
                            	transactionHash: req.body.transactionHash,
                                message: "transaction not found with transactionHash " + req.params.transactionHash
                            });                
                        }
                        return res.status(500).send({
                        	transactionHash: req.body.transactionHash,
                            message: "Error retrieving transaction with transactionHash " + req.params.transactionHash
                        });    
                     }
          })
};



// export as CSV - all bookmarked transactions
exports.exportAllBookmarks = (req, res) => {

    txntracker.getBookmarkedTransactionsOrderedByBlockIndex(
        function(error, txns){
          if(!error){


    		// Name of the downloaded file - e.g. "Download.csv"
    		const filename = "export.csv";


		 	// Set approrpiate download headers
		    res.setHeader('Content-disposition', 'attachment; filename=${filename}');

			/*var fields_csv = ['id', 'ContractAddress', 'TxHash', 'createdAt', 'updatedAt', 'version'];
			var data1 = json2csv({ data: txns, fields: fields, fieldNames: fieldNames });*/

			var fields_csv = ['id', 'ContractAddress', 'TxHash', 'createdAt', 'updatedAt', 'version'];

			var fieldNames = ['_id', 'ContractAddress', 'TxHash', 'createdAt', 'updatedAt', '__v'];

			const fields = [{
			  label: 'id',
			  value: '_id'
			},{
			  label: 'ContractAddress',
			  value: 'ContractAddress'
			},
			{
			  label: 'TxHash',
			  value: 'TxHash'
			},
			{
			  label: 'createdAt',
			  value: 'createdAt'
			},
			{
			  label: 'updatedAt',
			  value: 'updatedAt'
			},
			{
			  label: 'version',
			  value: '__v'
			},
			];
			
			const json2csvParser = new Json2csvParser({ fields });

			const json = JSON.stringify(txns);
			console.log(json);

			const csv = json2csvParser.parse(json, { fields });

			console.log(csv);

			res.attachment(filename);
			res.status(200).send(csv);

            }else{
                    res.status(500).send({
                    	transactionHash: req.body.transactionHash,
                    	message: err.message || "Some error occurred while retrieving transactions."
                        }); 
                 }
      });
};

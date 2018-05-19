const mongoose = require('mongoose');
require('mongoose-long')(mongoose);
var Long = mongoose.Schema.Types.Long;

const TxnlogSchema = mongoose.Schema({
    trackerIndex:  {type:Number, default:0},
	  ContractAddress: String,
    TxHash: String,
    BlockIndex: {type:Number, default:0},
    logIndex: {type:Number, default:0},
    BlockHash: String,
    Age: {type:Number, default:0},
    From: String,
    TxType: String,
    To: String,
    Value: {type:Long, default:0},
    TxFee: {type:Number, default:0},
}, {
    timestamps: true
});

var TransactionLogData = module.exports = mongoose.model('TransactionLog', TxnlogSchema);


module.exports.getTransactionLogByTransactionHash = function(transactionHash, callback) {
  var query = {TxHash: transactionHash};
  TransactionLogData.findOne(query, callback);
};

module.exports.getTransactionLogById = function(id, callback) {
  TransactionLogData.findById(id, callback);
};

module.exports.getTransactionLogsByBlockIndex = function(blockIndexArg, callback) {
  var query = {BlockIndex: blockIndexArg};
  TransactionLogData.find(query, callback);
};

module.exports.getTransactionLogsByContractAddress = function(contractAddressArg, callback) {
  var query = {ContractAddress: contractAddressArg};
  TransactionLogData.find(query, callback);
}

module.exports.getTransactionLogsOrderedByBlockIndex = function(callback) {
  var query = {};
  TransactionLogData.find(query).sort({BlockIndex: -1}).exec(callback);
}


module.exports.getLatestTransactionInCollection = function(callback) {
  var query = {};
  TransactionLogData.findOne(query).sort({BlockIndex: -1}).exec(callback);
}






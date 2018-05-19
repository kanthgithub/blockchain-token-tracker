const mongoose = require('mongoose');

const TxnSchema = mongoose.Schema({
    ContractAddress: String,
    TxHash: String
  }, {
    timestamps: true
});


var TransactionTrackerData = module.exports = mongoose.model('Transaction', TxnSchema);

module.exports.getTransactionByTransactionHash = function(transactionHash, callback) {
  var query = {TxHash: transactionHash};
  TransactionTrackerData.findOne(query, callback);
};

module.exports.getTransactionLogById = function(id, callback) {
  TransactionTrackerData.findById(id, callback);
};

module.exports.getTransactionsByBlockIndex = function(blockIndexArg, callback) {
  var query = {BlockIndex: blockIndexArg};
  TransactionTrackerData.find(query, callback);
};

module.exports.getTransactionsByContractAddress = function(contractAddressArg, callback) {
  var query = {ContractAddress: contractAddressArg};
  TransactionTrackerData.find(query, callback);
}

module.exports.getAllBookmarkedTransactions = function(callback) {
  var query = {};
  TransactionTrackerData.find(query, callback);
}

module.exports.unbookmarkTransactionByTransactionHash = function(transactionHashArg,callback) {
  var query = {TxHash: transactionHashArg};
  TransactionTrackerData.remove(query, callback);
}

module.exports.getBookmarkedTransactionsOrderedByBlockIndex = function(callback) {
  var query = {};
  TransactionTrackerData.find(query).sort({BlockIndex: -1}).exec(callback);
}

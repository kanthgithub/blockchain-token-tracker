const mongoose = require('mongoose');

const TxnBlacklistedSchema = mongoose.Schema({
    ContractAddress: String,
    TxHash: String
  }, {
    timestamps: true
});


var TxnBlacklistedSchemaData = module.exports = mongoose.model('BlacklistedTransaction', TxnBlacklistedSchema);

module.exports.getTransactionByTransactionHash = function(transactionHash, callback) {
  var query = {TxHash: transactionHash};
  TxnBlacklistedSchemaData.findOne(query, callback);
};

module.exports.getTransactionLogById = function(id, callback) {
  TxnBlacklistedSchemaData.findById(id, callback);
};

module.exports.getTransactionsByBlockIndex = function(blockIndexArg, callback) {
  var query = {BlockIndex: blockIndexArg};
  TxnBlacklistedSchemaData.find(query, callback);
};

module.exports.getTransactionsByContractAddress = function(contractAddressArg, callback) {
  var query = {ContractAddress: contractAddressArg};
  TxnBlacklistedSchemaData.find(query, callback);
}

module.exports.getAllBlacklistedTransactions = function(callback) {
  var query = {isBlacklisted: 'true'};
  TxnBlacklistedSchemaData.find(query, callback);
};

module.exports.unblacklistTransactionByTransactionHash = function(transactionHashArg,callback) {
  var query = {TxHash: transactionHashArg};
  TxnBlacklistedSchemaData.remove(query, callback);
}

module.exports.getBlacklistedTransactionsOrderedByBlockIndex = function(callback) {
  var query = {};
  TxnBlacklistedSchemaData.find(query).sort({BlockIndex: -1}).exec(callback);
}

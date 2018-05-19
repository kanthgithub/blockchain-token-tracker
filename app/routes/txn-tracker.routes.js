module.exports = (app) => {
    const txnTracker = require('../controllers/txn-tracker.controller.js');
    const txnLog = require('../controllers/txn-log.controller.js');
    const txnBlacklister = require('../controllers/txn-blacklist.controller.js');

    // bookmark a transaction
    app.post('/txnTracker/bookmark/', txnTracker.bookmark);

    // un-bookmark a transaction
    app.post('/txnTracker/unbookmark/', txnTracker.unbookmark);

     //Purpose: fetch all bookmarked transactions (GET)
     app.get('/txnTracker/bookmark', txnTracker.fetchAllBookmarks);

     //Purpose: fetch one bookmarked transactions (GET)
    app.get('/txnTracker/bookmark/:transactionId', txnTracker.fetchOneBookmark);

     //Purpose: export all bookmarked transactions (POST)
     app.post('/txnTracker/bookmark/export', txnTracker.exportAllBookmarks);

    // blacklist a transaction
    app.post('/txnTracker/blacklist/', txnBlacklister.blacklist);

    //Purpose: un-blacklist a transaction (POST)
    app.post('/txnTracker/unblacklist/',txnBlacklister.unblacklist);

    //Purpose: fetch all Blacklisted transaction (GET)
    app.get('/txnTracker/blacklist',txnBlacklister.fetchAllBlacklisted);


    // Retrieve all token transactions
    app.get('/txnTracker/fetchAllTokenTxns', txnLog.fetchAllTokenTxns);

    // Retrieve a single transaction with hash
    app.get('/txnTracker/fetchOneTokenTxn/:transactionId', txnLog.fetchOneTokenTxn);

}
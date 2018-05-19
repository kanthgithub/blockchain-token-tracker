const express = require('express');
const bodyParser = require('body-parser');

const fs = require('fs');

// create express app
const app = express();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())

// Configuring the database
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.url)
.then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...');
    process.exit();
});

var path = require('path');


const modelsPath = path.resolve(__dirname, './app/models')
fs.readdirSync(modelsPath).forEach(file => {
  require(modelsPath + '/' + file);
});

require('dotenv').config();
var Web3 = require('web3');
var Web3Utils = require('web3-utils');
var BigNumber = require('bignumber');

//websocket provider
//var web3 = new Web3(new Web3.providers.WebsocketProvider(process.env.WEBSOCKET_URL));

//HttpProvider
var web3 = new Web3(new Web3.providers.HttpProvider(process.env.API_URL));

web3.extend({
  property: 'debug',
  methods: [{
    name: 'traceTransaction',
    call: 'debug_traceTransaction',
    params: 1
  }]
});

//normal check to load and print balance of token in mainnet
var balance = web3.eth.getBalance(process.env.account, function (error, result) {
    if (!error) {
  console.log('Contract Value during startup ...'+web3.utils.fromWei(result, 'ether'));
    } else {
      console.error(error);
    }
  });

//load ABI of token
var abiArray = JSON.parse(fs.readFileSync('./app/contracts/TOKEN-ABI.json', 'utf8'));

//load token contract address from environment file
let contract_address = process.env.account;    //contract address

//load Contract instance using the ABI Array of token and contractAddress from mainnet
var contract = new web3.eth.Contract(abiArray, contract_address);


console.log('-----------------------------------');
console.log('fetching Smart Contract Past Events');
console.log('-----------------------------------');

//declare TransactionLog model object from TransactionLogSchema 
var TransactionLogModel = mongoose.model('TransactionLog');

//import script to refresh/load new transactions from mainnet
var refreshTool = require("./app/refresh/transactionLogRefresh.js");

//initial attempt to load the new transaction events
console.info('initiating initial load for transaction-log collection');

refreshTool.refresh(contract,TransactionLogModel,web3);

//Cron Job to load new transactions - query the mainnet and load to mongodb
var cron = require('cron');

var cronJob = cron.job("0 */5 * * * *", function(){
    
    console.info('initiating refresh for transaction-log collection');

    refreshTool.refresh(contract,TransactionLogModel);

    console.info('cron job completed');
}); 

cronJob.start();

// define a simple route
app.get('/', (req, res) => {
    res.json({"message": "Welcome to Transaction explorer application. View/Bookmark/Blacklist transactions for token. Organize and keep track of all your transactions."});
});


// Require txn-tracker routes
require('./app/routes/txn-tracker.routes.js')(app);


var ejs = require('ejs');

// view engine setup
app.engine('html', ejs.renderFile);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// listen for requests
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});
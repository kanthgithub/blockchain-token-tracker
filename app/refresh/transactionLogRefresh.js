module.exports = {

  refresh:function(contract,TransactionLogModel,web3){

    latestBlockIndex = 0;

      var transactionEntitySaved = TransactionLogModel.getLatestTransactionInCollection(
        function(error, entity){
          if(!error){
            console.log('transactionEntity queried: '+entity);

            if(entity){
                this.latestBlockIndex = entity.BlockIndex;
                console.log('latestBlockIndex: '+latestBlockIndex);
            }
        }else{
          console.log(error);
        }
      });

  setTimeout(function(){
    console.log('after waiting');

     var fromIndex = latestBlockIndex+1;

    console.log('fromIndex: '+fromIndex);

    contract.getPastEvents('Transfer', {
      filter: {},
      fromBlock: fromIndex,
      toBlock: 'latest'
    }, function(error, events){
      if(!error){
            console.log('past Transfer event count:'+events.length);

      for (i=0; i<events.length; i++) {
        var eventObj = events[i];
        console.log('Transfer-event Details[' + i +']->'+
                  ' name: '+ eventObj.event +
                  ' blockNumber ' + eventObj.blockNumber +
                  ' blockHash '+ eventObj.blockHash +
                  ' logIndex: ' + eventObj.logIndex +
                  ' transactionHash: ' + eventObj.transactionHash +
                  ' transactionIndex: ' + eventObj.transactionIndex +
                  ' address: ' + eventObj.address +
                  ' from: ' + eventObj.returnValues.from +
                  '  To:  '+eventObj.returnValues.to +
                  '  Value: '+eventObj.returnValues.value);

        var transactionLogEntity = new TransactionLogModel();
        transactionLogEntity.ContractAddress=eventObj.address;
        transactionLogEntity.TxHash = eventObj.transactionHash;
        transactionLogEntity.BlockIndex = eventObj.blockNumber;
        transactionLogEntity.logIndex = eventObj.logIndex;
        transactionLogEntity.BlockHash = eventObj.blockHash;
        transactionLogEntity.From = eventObj.returnValues.from;
        transactionLogEntity.To = eventObj.returnValues.to;
        transactionLogEntity.Value = eventObj.returnValues.value;
        transactionLogEntity.trackerIndex = transactionLogEntity.BlockIndex+''+transactionLogEntity.logIndex;

        console.log('saving transactionLogEntity: '+transactionLogEntity);

        transactionLogEntity.save();

      }
    }else{
      console.log(error);
    }
  })
}, 3000);

}

} ;
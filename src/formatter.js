function ohlcv_chart(krakenCandles, pair) {
    var candles = krakenCandles.result[pair];   // BTC -> XXBT ETH -> XETH USD -> ZUSD
    for (var i = 0; i < candles.length; i++) {
      candles[i].splice(7, 1); //remove  string <vwap> and int <count>
      candles[i].splice(5, 1);
  
      var counter = 0; //change the type to INT
      candles[i].forEach(intify);
  
      function intify(num) {
        candles[i][counter] = Number(num);
        counter += 1;
      };
    };
    return (candles);
  };


function ticker_form(krakenTicks, pair) {
  var ticks =  krakenTicks.result[pair]
  for (var i = 0; i < ticks.length; i++) {
    ticks[i].splice(5,1);           // remove misc value
    var id = ticks[i][5]  // move tradeID to first position of array
    ticks[i].splice(5,1);
    ticks[i].splice(0,0,id);
  };
  return ticks;
};

  module.exports = {
    ohlcv_chart,
    ticker_form
  };
  
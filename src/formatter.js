function ohlcv_chart(krakenCandles, pair) { //expect raw data from api, api supports only the last 720 datpoint so this function has a limited usecase :/
    pair = pair.replace("XBT", "XXBTZ");
    pair = pair.replace("ETH", "XETHZ");
    var candles = krakenCandles.result[pair];   // XBT -> XXBT ETH -> XETH USD -> ZUSD
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


function ticker_form(krakenTicks, pair) { //expect raw data from api
  pair = pair.replace("XBT", "XXBTZ");
  pair = pair.replace("BTC", "XXBTZ");
  pair = pair.replace("ETH", "XETHZ");
  var ticks =  krakenTicks.result[pair]
  for (var i = 0; i < ticks.length; i++) {
    ticks[i].splice(5,1);           // remove misc value
    var id = ticks[i][5]  // move tradeID to zero position of array
    ticks[i].splice(5,1);
    ticks[i].splice(0,0,id);
  };
  return ticks;
};

function ticks_to_candle(data){  // data; for each interval expect a nested list of two elements: list of tickdata and list of starting timestamps
  all_candleset = [];
  for (let j = 0; j < data.length; j++){ //iterate on intervals
    let candle = data[j][0];
    let times = data[j][1];
    let candleset = [];
    for (let i = 0; i < candle.length; i++){ //iterate on candles
      const time = times[i];
      const prices = candle[i].map(x => x[1]);
      const volumes = candle[i].map(x => parseFloat(x[2]));
      let open = 0;
      let close = 0;
      let high = 0;
      let low = 0;
      try{
        open = candle[i][0][1];
        close = candle[i][candle[i].length-1][1];
        high = prices.reduce((a, b) => Math.max(a, b), -Infinity);
        low = prices.reduce((a, b) => Math.min(a, b), Infinity);
      }catch(err){
        open = candleset[candleset.length-1][4];
        close = open;
        high = open;
        low = open;
        console.log(j,i);
        console.log(err);
      };
      const candle_vol = volumes.reduce((a, b) => a + b, 0);
      candleset.push([time, open, high, low, close, candle_vol]);
    };
    all_candleset.push(candleset);
  };
  return all_candleset;
};

  module.exports = {
    ohlcv_chart,
    ticker_form,
    ticks_to_candle
  };
  
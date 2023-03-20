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

function ticks_to_candle(data){  // expect a nested list of two elements: list of tickdata and list of starting timestamps
  let ticks = data[0];
  let times = data[1];
  let candle = [];
  for (let i = 0; i < ticks.length; i++){
    const time = times[i];
    const prices = ticks[i].map(x => x[1]);
    const volumes = ticks[i].map(x => parseFloat(x[2]));
    const open = ticks[i][0][1];
    const close = ticks[i][ticks[i].length-1][1];5
    const high = prices.reduce((a, b) => Math.max(a, b), -Infinity);
    const low = prices.reduce((a, b) => Math.min(a, b), Infinity);
    const candle_vol = volumes.reduce((a, b) => a + b, 0);
    candle.push([time, open, high, low, close, candle_vol]);
  };
  return candle
};

  module.exports = {
    ohlcv_chart,
    ticker_form,
    ticks_to_candle
  };
  
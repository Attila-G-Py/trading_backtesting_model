var mysql = require("mysql");
var fs = require('fs');

var pool = mysql.createPool({
    host: "localhost",
    user: "jackunreal",
    password: "password",
    database: "crypto"
  });

                        // Initialize new pair

function add_pair(pair,ohlc_periods) {
  let rawTickerQuery = 'CREATE TABLE ?? (TradeID int NOT NULL, Price FLOAT, Volume FLOAT, Time BIGINT, Buy_Sell CHAR, Market_Limit CHAR, PRIMARY KEY (TradeID))';
  let ticker_query = mysql.format(rawTickerQuery,[pair]);
  pool.query(ticker_query,(err, response) => {
      if(err) {
          console.error(err);
          return;
      };
  });

  let rawOHLCVQuery = 'CREATE TABLE ?? (Time BIGINT NOT NULL,Open FLOAT, High FLOAT, Low FLOAT, Close FLOAT, Volume FLOAT, PRIMARY KEY (Time))'
  ohlc_periods.forEach(function (period ,index) {
    let ohlcv_query = mysql.format(rawOHLCVQuery,[pair+period]);
    pool.query(ohlcv_query,(err, response) => {
      if(err) {
          console.error(err);
          return;
      };
    });
  });
};
// add_pair("ADAUSD",["1","5","15","60"])

                      // Connect to kraken api

const getApiData  = require("./getApiData.js");
const {public_connect_ticker, public_connect_ohlc} = getApiData;
const formatter = require("./formatter.js");
const {ohlcv_chart, ticker_form} = formatter

async function get_ohlcv(pair, interval,since){
  var rawData = await public_connect_ohlc(pair, interval, since)
  var chart =  ohlcv_chart(rawData,pair);
  return chart;
}

// get_ohlcv("ADAUSD",60,1608111600)

async function get_ticker(pair,since){
  var rawData = await public_connect_ticker(pair, since)
  var ticks = ticker_form(rawData, pair)
  return ticks
};

// get_ticker("ADAUSD", 1678181112)
                      //Transform ticker data to ohlc values
async function select_ticks(){

};
async function select_ticks(pair,interval,start,end){
  var chunk = await get_ticker(pair, start); //get max 1000 trades
  var time_price_vol = chunk.flat(0).map(arr => [arr[3],arr[1],arr[2]]);
  const close_time = start + interval*60;
  while (time_price_vol[time_price_vol.length-1][0] < close_time){
    chunk = await get_ticker(pair, time_price_vol[time_price_vol.length-1][0]);
    time_price_vol = time_price_vol.concat(chunk.flat(0).map(arr => [arr[3],arr[1],arr[2]]));
  };
  const candle_data = time_price_vol.filter(row => row[0] < close_time);
  return ticks_to_candle(candle_data);
};

function ticks_to_candle(ticks){
  const prices = ticks.map(x => x[1]);
  const volumes = ticks.map(x => parseFloat(x[2]));
  const open = ticks[0][1];
  const close = ticks[ticks.length-1][1];
  const high = prices.reduce((a, b) => Math.max(a, b), -Infinity);
  const low = prices.reduce((a, b) => Math.min(a, b), Infinity);
  let candle_vol = volumes.reduce((a, b) => a + b, 0);
  const candle = [open, high, low, close, candle_vol];
  console.log(candle)
  return candle
};

select_ticks("XBTUSD",60,1678960800,4)

                      // Fill the database             
async function fill_sql_ticks(pair,since) {
  var data = await get_ticker(pair, since);
  let rawTickerQuery = 'INSERT INTO ' + pair + '(TradeID, Price, Volume, Time, Buy_Sell, Market_Limit) VALUES ?';
  let ticker_query = mysql.format(rawTickerQuery,[data]);
  pool.query(ticker_query,(err, response) => {
    if(err) {
        console.error(err);
        return;
    };
  });
};

async function fill_sql_ohlc(pair,interval,since) {      
  var data = await get_ohlcv(pair, interval,since);
  let rawOhlcrQuery = 'INSERT INTO ' + pair + interval + '(Time, Open, High, Low, Close, Volume) VALUES ?';
  let ohlc_query = mysql.format(rawOhlcrQuery,[data]);
  pool.query(ohlc_query,(err, response) => {
    if(err) {
        console.error(err);
        return;
    };
  });
};
// fill_sql_ticks("ADAUSD",1609462800)     

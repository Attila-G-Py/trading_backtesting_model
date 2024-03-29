const mysql = require("mysql");
const fs = require('fs');

const pool = mysql.createPool({
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
// add_pair("BTCUSD",["1"])

                      // Connect to kraken api

const getApiData  = require("./getApiData.js");
const {public_connect_ticker, public_connect_ohlc} = getApiData;
const formatter = require("./formatter.js");
const {ohlcv_chart, ticker_form,ticks_to_candle} = formatter;

async function get_ohlcv(pair, interval,since){
  var rawData = await public_connect_ohlc(pair, interval, since);
  var chart =  ohlcv_chart(rawData,pair);
  return chart;
};
// get_ohlcv("ADAUSD",60,1608111600)
async function get_ticker(pair,since){
  let rawData = await public_connect_ticker(pair, since);
  let ticks = ticker_form(rawData, pair);
  return ticks;
};
// get_ticker("ADAUSD", 1678181112)
                      //Transform ticker data to ohlc values
async function select_ticks_sql(pair,interval,start){
};

async function download_ticks(pair,intervals,start,largest_timeframe_candles){          
  let result = [];
  let candle_data = await get_ticker(pair, start);
  for (let i=0; i<largest_timeframe_candles; i++) {   //iterates on datasets
    let current_close;
    let max_iter = 1;
    for (let j=0, iter_count=0; ((iter_count<max_iter)&&(j<intervals.length)); iter_count++){   //iterates on intervals
      let interval = intervals[j];
      max_iter = intervals[0] / interval;
      let dataset_start = start + (i * intervals[0]*60);
      let current_start = dataset_start + (iter_count * interval * 60);
      current_close = current_start + (interval * 60);
      while (candle_data[candle_data.length-1][3] < current_close){ //get max 1000 trades
        chunk = await get_ticker(pair, candle_data[candle_data.length-1][3]);
        candle_data = candle_data.concat(chunk);
      };
      let cropped_start = candle_data.filter(row => row[3] > current_start);
      let cropped = cropped_start.filter(row => row[3] < current_close);
      current_timeframe_alldata = [[cropped],[current_start]];
      if (result.length <= j){
        result.push([[cropped],[current_start]]);
      }else{
        result[j][0].push(cropped);
        result[j][1].push(current_start);
      };
      if (iter_count+1 == max_iter){
        j++;
        iter_count = -1;
      };
    };
    fill_sql_ticks(pair,candle_data.filter(row => row[3] < current_close));
    candle_data = candle_data.filter(row => row[3] > current_close);
    
  };
  return result;
};
                      // Fill the database             
async function fill_sql_ticks(pair,data) {     //data parameter; with get_ticker 
  let rawTickerQuery = 'INSERT IGNORE INTO ' + pair + '(TradeID, Price, Volume, Time, Buy_Sell, Market_Limit) VALUES ?';
  let ticker_query = mysql.format(rawTickerQuery,[data]);
  pool.query(ticker_query,(err, response) => {
    if(err) {
        console.error(err);
        return;
    };
  });
};

async function fill_sql_ohlc(pair,interval,data) {      //data parameter; source can be sql or api
  let rawOhlcrQuery = 'INSERT IGNORE INTO ' + pair + interval + '(Time, Open, High, Low, Close, Volume) VALUES ?';
  let ohlc_query = mysql.format(rawOhlcrQuery,[data]);
  pool.query(ohlc_query,(err, response) => {
    if(err) {
        console.error(err);
        return;
    };
  });
};

let raw_candle = download_ticks("BTCUSD",[60,15,5,1],1678482000	,4)  //generates ohlc values from ticker data on given intervals, and fills the database 
raw_candle.then(function(candle) {                              //intervals in descending order
  let data = ticks_to_candle(candle);
  fill_sql_ohlc("BTCUSD",60,data[0]);
  fill_sql_ohlc("BTCUSD",15,data[1]);
  fill_sql_ohlc("BTCUSD",5,data[2]);
  fill_sql_ohlc("BTCUSD",1,data[3]);
});

// fill_sql_ticks("ADAUSD",1609462800)     



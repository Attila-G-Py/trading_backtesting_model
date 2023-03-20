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
// add_pair("ADAUSD",["3"])

                      // Connect to kraken api

const getApiData  = require("./getApiData.js");
const {public_connect_ticker, public_connect_ohlc} = getApiData;
const formatter = require("./formatter.js");
const {ohlcv_chart, ticker_form,ticks_to_candle} = formatter

async function get_ohlcv(pair, interval,since){
  var rawData = await public_connect_ohlc(pair, interval, since)
  var chart =  ohlcv_chart(rawData,pair);
  return chart;
}

// get_ohlcv("ADAUSD",60,1608111600)

async function get_ticker(pair,since){
  let rawData = await public_connect_ticker(pair, since)
  let ticks = ticker_form(rawData, pair)
  return ticks
};

// get_ticker("ADAUSD", 1678181112)
                      //Transform ticker data to ohlc values
async function select_ticks_sql(pair,interval,start){
};

async function download_ticks(pair,interval,start,num_of_candles){          
  let all_candles = [];
  let times = [];
  let candle_data = await get_ticker(pair, start);
  for (let i = 0; i < num_of_candles; i++) {
    let current_start = start + i * interval * 60;
    times.push(current_start);
    let current_close = start + (i+1) * interval * 60;
    while (candle_data[candle_data.length-1][3] < current_close){ //get max 1000 trades
      chunk = await get_ticker(pair, candle_data[candle_data.length-1][3]);
      candle_data = candle_data.concat(chunk);
    };
    all_candles.push(candle_data.filter(row => row[3] < current_close));
    candle_data = candle_data.filter(row => row[3] > current_close);
  };
  return [all_candles,times];
};


                      // Fill the database             
async function fill_sql_ticks(pair,since) {     // directly from api
  let data = await get_ticker(pair, since);
  let rawTickerQuery = 'INSERT INTO ' + pair + '(TradeID, Price, Volume, Time, Buy_Sell, Market_Limit) VALUES ?';
  let ticker_query = mysql.format(rawTickerQuery,[data]);
  pool.query(ticker_query,(err, response) => {
    if(err) {
        console.error(err);
        return;
    };
  });
};

async function fill_sql_ohlc(pair,interval,data) {      //data parameter; source can be sql or api
  let rawOhlcrQuery = 'INSERT INTO ' + pair + interval + '(Time, Open, High, Low, Close, Volume) VALUES ?';
  let ohlc_query = mysql.format(rawOhlcrQuery,[data]);
  pool.query(ohlc_query,(err, response) => {
    if(err) {
        console.error(err);
        return;
    };
  });
};

let raw_candle = download_ticks("ADAUSD",15,1678966200,6)
raw_candle.then(function(candle) {
  let data = ticks_to_candle(candle);
  fill_sql_ohlc("ADAUSD",15,data);
});

// fill_sql_ticks("ADAUSD",1609462800)     

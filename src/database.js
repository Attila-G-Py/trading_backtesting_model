
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
      }
  });

  let rawOHLCVQuery = 'CREATE TABLE ?? (ID int NOT NULL,Time BIGINT,Open FLOAT, High FLOAT, Low FLOAT, Close FLOAT, Volume FLOAT, PRIMARY KEY (ID))'
  ohlc_periods.forEach(function (period ,index) {
    let ohlcv_query = mysql.format(rawOHLCVQuery,[pair+period]);
    pool.query(ohlcv_query,(err, response) => {
      if(err) {
          console.error(err);
          return;
      }
    });
  });
}
add_pair("ada",["1","5","15","60"])

                      // Connect to kraken api

const getApiData  = require("./getApiData.js");
const {public_connect_ticker, public_connect_ohlc} = getApiData;
const formatter = require("./formatter.js");
const {ohlcv_chart, ticker_form} = formatter

async function get_ohlcv(pair, interval,since){
  var rawData = await public_connect_ohlc(pair, interval, since)
  var chart =  ohlcv_chart(rawData,pair);
}

// get_ohlcv("ADAUSD",60,1608111600)

async function get_ticker(pair,since){
  var rawData = await public_connect_ticker(pair, since)
  var ticks = ticker_form(rawData, pair)
}


// get_ticker("ADAUSD", 1678181112)

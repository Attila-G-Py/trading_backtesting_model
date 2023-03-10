
var mysql = require("mysql");
var fs = require('fs');

var pool = mysql.createPool({
    host: "localhost",
    user: "jackunreal",
    password: "password",
    database: "crypto"
  });

                        // INITIALIZE NEW PAIR

function addPair(pair,ohlc_periods) {
  let rawTickerQuery = 'CREATE TABLE ?? (ID int NOT NULL,Time BIGINT,Price FLOAT,Volume FLOAT,PRIMARY KEY (ID))';
  let ticker_query = mysql.format(rawTickerQuery,[pair]);
  pool.query(ticker_query,(err, response) => {
      if(err) {
          console.error(err);
          return;
      }
  });

  let rawOHLCVQuery = 'CREATE TABLE ?? (ID int NOT NULL,Time BIGINT,Open FLOAT, High FLOAT, Low FLOAT, Volume FLOAT, PRIMARY KEY (ID))'
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
addPair("btc",["1","5","15","60"])

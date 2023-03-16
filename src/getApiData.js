var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

//          KRAKEN PUBLIC REQUESTS (limit at 15 requests)
async function public_connect_ohlc(pair, interval, since) {

    const baseurl = "https://api.kraken.com/0/public/OHLC";
    var options = "?pair=" + pair + "&interval=" + interval + "&since=" + since;
    return new Promise((resolve, reject) => {
      var xhttp = new XMLHttpRequest;
  
      xhttp.open("GET", baseurl + options, true);
      xhttp.onreadystatechange = function() {
        if (xhttp.readyState === 4) {
          var data = JSON.parse(xhttp.responseText);
          resolve(data);
        };
      };
      xhttp.send();
    });
  }
  async function public_connect_ticker(pair, since) {
    var baseurl = "https://api.kraken.com/0/public/Trades";
    var options = "?pair=" + pair +"&since=" + since
  
    return new Promise((resolve, reject) => {
      var xhttp = new XMLHttpRequest;
  
      xhttp.open("GET", baseurl + options, true);

      xhttp.onreadystatechange = function() {
  
        if (xhttp.readyState === 4) {
          var data = JSON.parse(xhttp.responseText);
          resolve(data);
        };
      };
      xhttp.send();
    });
  };

  module.exports = {
  public_connect_ticker,
  public_connect_ohlc,
};

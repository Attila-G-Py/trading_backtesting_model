from data import *
from vis import *

btc1 = Candles(1,"BTCUSD",15,15)
btc15 = Candles(15,"BTCUSD",15,15)
btc1.load()
btc15.load()
btc_ticker = Tickers("BTCUSD",15,15)
btc_ticker.load()
btc1.ema(50)
btc15.rsi()
create_plot(btc1.data_array, btc1.ema50, [btc15.data_array[:,0],btc15.rsi])


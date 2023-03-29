from data import *
from vis import *
from trade import *

btc1 = Candles(1,"BTCUSD",1678410000,1678478400)
btc5 = Candles(5,"BTCUSD",1678410000,1678478400)
btc1.load()
btc5.load()
btc1.ema(70)
btc5.rsi()
btc5.atr()

trade = Trade(100)
trade.init_cond(btc1,["ATR"])
def layer5():
    trade.range_atr(50,btc5)


btc5.step(1678422900)
for candle in range(150):
    layer5()
    
    try:
        btc5.step()
    except:
        continue

onchart_indicators = [btc1.ema70]
offchart_indicators = [[btc5.data_array[:,0],btc5.atr],[btc5.data_array[:,0],btc5.rsi]]
create_plot(btc1.data_array, onchart_indicators, offchart_indicators)
atr_res(trade.conditions)
show_plot()

import pandas as pd

class Trade:
    def __init__(self,balance,margin=5):
        self.balance = balance
        self.margin = margin
    
    def init_cond(self, smallest_candles, indicators):
        index = smallest_candles.data_array[:,0].astype(int)
        self.conditions = pd.DataFrame(index = index, columns = indicators)

    def range_atr(self,threshold,candle):
        if candle.atr[candle.index] < threshold:
            self.inrange = True
        else:
            self.inrange = False

        self.conditions.loc[candle.active_time]["ATR"] = self.inrange


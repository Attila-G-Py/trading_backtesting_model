import mysql.connector
import pandas as pd
import numpy as np
import ta

config = {
    'user': 'jackunreal',
    'password': 'password',
    'host': 'localhost',
    'database': 'crypto',
    'raise_on_warnings': True
    }
class Tickers:
    def __init__(self,pair,since,until):
        self.pair = pair
        self.since = since
        self.until = until
    
    def load(self):
        cnx = mysql.connector.connect(**config)
        cursor = cnx.cursor()

        query = ("SELECT * FROM "+ self.pair )
        cursor.execute(query)
        self.array = np.array(cursor.fetchall())
        self.array_floats = self.array[:,1:4].astype("float")

        cursor.close()
        cnx.close()

class Candles:
    def __init__(self, period, pair, start, end):
        self.index = 0
        self.active_time = start
        self.period = period
        self.pair = pair
        self.start = start
        self.end = end

    def load(self):
        cnx = mysql.connector.connect(**config)
        cursor = cnx.cursor()
        query = ("SELECT * FROM "+ self.pair + str(self.period)+ " WHERE (Time > "+ str(self.start)+" AND Time < " + str(self.end)+");")
        cursor.execute(query)
        self.data_array = np.array(cursor.fetchall())
        cursor.close()
        cnx.close()
        self.index = 0

    def step(self,to_start = False):
        if not to_start:
            self.active_time = self.active_time + self.period*60
        else:
            self.active_time = to_start

        self.index = int(np.where((self.data_array[:,0] - self.active_time) < 1e-10)[0][-1])

    #                               INDICATORS 
    
    def ema(self,period):
        closes = pd.Series(self.data_array[:,4])
        ema_arr = "ta.trend.ema_indicator(closes, window=period)"
        create_ema = "self.ema"+str(period) + " = " + ema_arr 
        exec(create_ema)

    def rsi(self,window=14):
        closes = pd.Series(self.data_array[:,4])
        self.rsi = ta.momentum.RSIIndicator(closes,window)._rsi

    def atr(self,window=14):
        highs = pd.Series(self.data_array[:,2])
        lows = pd.Series(self.data_array[:,3])
        closes = pd.Series(self.data_array[:,4])
        self.atr = ta.volatility.AverageTrueRange(highs,lows,closes,window)._atr
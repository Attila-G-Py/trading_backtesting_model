import matplotlib.pyplot as plt
from datetime import datetime
import numpy as np

# def create_plot(data,ema):
#     vect = np.vectorize(convert_timestamp)
#     dates = vect(data[:,0])
#     plt.plot(dates,data[:,2])
#     plt.plot(dates,data[:,3])
#     plt.plot(dates,ema)
#     plt.xticks(rotation=45)
#     plt.show()

def convert_timestamp(timestamp):
    dt_obj = datetime.fromtimestamp(timestamp)
    return dt_obj

def create_plot(data,ema,rsi):
    fig, axs = plt.subplots(2,1,gridspec_kw={'height_ratios': [9,2]},sharex=True)

    vect = np.vectorize(convert_timestamp)
    dates1 = vect(data[:,0])
    dates15 = vect(rsi[0])
    axs[0].plot(dates1,data[:,2])
    axs[0].plot(dates1,data[:,3])
    axs[0].plot(dates1,ema)
    axs[1].set_ylim(0,100)
    axs[1].plot(dates15,rsi[1]._rsi)
    plt.xticks(rotation=45)
    plt.show()
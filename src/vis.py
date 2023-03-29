import matplotlib.pyplot as plt
from datetime import datetime
import numpy as np
from datetime import *
import pandas as pd

def convert_timestamp(timestamp):
    dt_obj = datetime.fromtimestamp(timestamp)
    return dt_obj



def create_plot(data,onchart_indicators,offchart_indicators):
    global fig, axs 
    offchart_indicator_count = len(offchart_indicators)
    subplot_ratios = [9]
    for i in range(offchart_indicator_count):
        subplot_ratios.append(2)
    fig, axs = plt.subplots(offchart_indicator_count+1,1,gridspec_kw={'height_ratios': subplot_ratios},sharex=True)

    vect = np.vectorize(convert_timestamp)
    dates1 = vect(data[:,0])
    
    axs[0].plot(dates1,data[:,2])
    axs[0].plot(dates1,data[:,3])

    for indicator in onchart_indicators:  
        axs[0].plot(dates1,indicator)

    for indicator in range(len(offchart_indicators)):
        dates = vect(offchart_indicators[indicator][0])
        axs[1].set_ylim(0,100)
        axs[indicator+1].plot(dates,offchart_indicators[indicator][1])
        plt.xticks(rotation=45)

def atr_res(csv):
    dates = pd.to_datetime(csv.index, unit="s")
    for i ,j in zip(csv["ATR"],dates):
        if i == True:
            axs[0].axvspan(j, j + timedelta(1), facecolor='y')
        else:
            axs[0].axvspan(j, j + timedelta(1), facecolor='w')



def show_plot():
    plt.show()
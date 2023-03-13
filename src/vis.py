import matplotlib.pyplot as plt
from datetime import datetime
import numpy as np

def create_plot(data):
    vect = np.vectorize(convert_timestamp)
    dates = vect(data[0])
    plt.plot(dates,data[1])
    plt.xticks(rotation=45)
    plt.show()

def convert_timestamp(timestamp):
    dt_obj = datetime.fromtimestamp(timestamp)
    return dt_obj

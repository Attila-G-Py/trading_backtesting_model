from data import *
from vis import *

ada60 = Candles(60,"ADAUSD",15,15)
ada60.load()


create_plot([ada60.array[:,1], ada60.array[:,2]])

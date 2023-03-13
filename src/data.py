import mysql.connector
import numpy as np


class Candles:
    def __init__(self, period, pair, since, until):
        self.period = period
        self.pair = pair
        self.since = since
        self.until = until
    
    def load(self):
        config = {
            'user': 'jackunreal',
            'password': 'password',
            'host': 'localhost',
            'database': 'crypto',
            'raise_on_warnings': True
            }

        cnx = mysql.connector.connect(**config)
        cursor = cnx.cursor()

        query = ("SELECT * FROM "+ self.pair + str(self.period))
        cursor.execute(query)
        self.array = np.array(cursor.fetchall())

        cursor.close()
        cnx.close()
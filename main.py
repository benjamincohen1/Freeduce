from flask import Flask
import time
from flask_sockets import Sockets

app = Flask(__name__)

sockets = Sockets(app)

@sockets.route("/")
def hello(ws):
     while True:
        message = ws.receive()
        ws.send(message)



def freqCount(f):
    f = open(f)
    line = f.readline()
    l = len(line)
    quarter = l/4
    p = Pool(4)
    newData = [line[x*quarter:(x+1)*quarter] for x in range(4)]
    p.map(freqCountData,newData)



def freqCountData(data):
    chars = {chr(x + 97): 0 for x in range(26)}

    for c in data:
        if ord(c) < 97 or ord(c) > (97 + 26):
            pass
        else:
            chars[c.lower()] += 1
    for x in sorted(chars.keys()):
        print str(x) + ": " + str(chars[x])



if __name__ == "__main__":
    app.run()
  

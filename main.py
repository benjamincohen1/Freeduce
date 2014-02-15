from flask import Flask
import time
from juggernaut import Juggernaut

app = Flask(__name__)

jug = Juggernaut()

@app.route("/")
def hello():
    jug.publish('room', "WOOOORD")
    return "Hello World!"


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
  
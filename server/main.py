import network
import socket
from machine import Pin
import json

systemid = "" # fill this var with your system name

#add gpio usage later
def getalldata():
    pass

def handlereq(request):
    request_line = request.split("\r\n")[0]
    path = request_line.split(" ")[1]

    if path == "/":
        dataloc = getalldata()
        return dataloc
    elif path == "/cstate":
        return {"state":1}
    elif path == "/id":
        return {"id":systemid}
    else:
        return {"error": "endpoint didn't founded"}
    
server = socket.socket()
server.bind(("0.0.0.0", 6767))
server.listen(1)

while True:
    client, addr = server.accept()
    request = client.recv(1024).decode()
    data = handlereq(request)
    body = json.dumps(data)
    res = (
        "HTTP/1.1 200 OK\r\n"
        "Content-Type: application/json\r\n"
        "Connection: close\r\n"
        "\r\n"
        + body
    )
    client.send(res.encode())
    client.close()
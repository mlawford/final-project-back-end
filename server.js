var WebSocketServer = require('ws').Server
const express = require('express');
const uuidv4 = require('uuid/v4');
const app = express();
const PORT = process.env.PORT || 5000
const INDEX = path.join(__dirname, 'index.html');

const server = express()
  .use((req, res) => res.sendFile(INDEX) )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

var wss = new WebSocketServer({port: PORT})

let allConnections = []
let lobbies = [ [], [], [] ]

wss.on('connection', (ws, req) => {
  const ip = req.connection.remoteAddress
  console.log(`${ip} just made a WS connection`);

  allConnections.push(ws)
  if (lobbies[0].length < 2){
    lobbies[0].push(ws)
    console.log("lobby 1")
  } else if (lobbies[1].length < 2) {
    lobbies[1].push(ws)
    console.log("lobby 2")
  } else if (lobbies[2].length < 2){
    lobbies[2].push(ws)
    console.log("lobby 3")
  } else {
    ws.close()
    console.log("lobbies are full")
  }

  ws.on('close', function close(){
    let index = allConnections.indexOf(ws)
    if (index > -1) {
      allConnections.splice(index, 1);
    }
    lobbies.forEach(lobby => {
      let socketIndex = lobby.indexOf(ws)
      if (socketIndex > -1){
        lobby.splice(socketIndex, 1)
      }
    })
  })

  ws.on('message', (payload) => {
    // lastMessage = payload
    lobbies.forEach(lobby => {
      if (lobby.includes(ws)){
        lobby.forEach(socket => {
          if (socket !== ws){
            socket.send(`${payload}`)
          }
        })
      }
    })
  })
})

console.log("LISTENING FOR WS CONNECTIONS ON PORT: ", PORT);

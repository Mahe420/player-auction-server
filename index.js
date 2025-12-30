
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Minimal sample players; images can be URLs or local served static paths after build
const samplePlayers = [
  { id: 1, name: 'Player 1', img: '/images/player1.svg' },
  { id: 2, name: 'Player 2', img: '/images/player2.svg' },
  { id: 3, name: 'Player 3', img: '/images/player3.svg' },
  { id: 4, name: 'Player 4', img: '/images/player4.svg' },
  { id: 5, name: 'Player 5', img: '/images/player5.svg' }
]

let state = {
  started: false,
  teams: [],
  firstPool: [...samplePlayers],
  unsoldPool: [],
  currentPlayer: null,
  history: [],
  playerHistory: {}
};

io.on("connection", socket => {
  // send current state
  socket.emit("state", state);

  socket.on('start', (teams) => {
    state.started = true;
    state.teams = teams.map(t => ({ ...t }));
    state.firstPool = [...samplePlayers];
    state.unsoldPool = [];
    state.currentPlayer = null;
    state.history = [];
    state.playerHistory = {};
    io.emit('state', state);
  });

  socket.on('pickPlayer', ()=>{
    if(!state.started) return
    let pool;
    if(state.firstPool.length > 0){
      pool = state.firstPool;
    } else if(state.unsoldPool.length > 0){
      pool = state.unsoldPool;
    } else {
      state.currentPlayer = null;
      io.emit('state', state);
      return
    }
    const idx = Math.floor(Math.random()*pool.length)
    const player = pool.splice(idx,1)[0]
    state.currentPlayer = player
    io.emit('state', state)
  })

  socket.on('sell', ({teamId, amount})=>{
    if(!state.currentPlayer) return
    const team = state.teams.find(t=>t.id===teamId)
    if(!team) return
    team.balance = (team.balance || 0) - Number(amount)
    state.history.push({ player: state.currentPlayer.name, team: team.name, amount: Number(amount), img: state.currentPlayer.img })
    if(!state.playerHistory[state.currentPlayer.id]) state.playerHistory[state.currentPlayer.id] = []
    state.playerHistory[state.currentPlayer.id].push({ action: 'sold', team: team.name, amount: Number(amount) })
    state.currentPlayer = null
    io.emit('state', state)
  })

  socket.on('unsell', ()=>{
    if(!state.currentPlayer) return
    // return current player back to unsold pool
    state.unsoldPool.push(state.currentPlayer)
    if(!state.playerHistory[state.currentPlayer.id]) state.playerHistory[state.currentPlayer.id] = []
    state.playerHistory[state.currentPlayer.id].push({ action: 'unsold' })
    state.currentPlayer = null
    io.emit('state', state)
  })

  socket.on('reset', ()=>{
    state = {
      started: false,
      teams: [],
      firstPool: [...samplePlayers],
      unsoldPool: [],
      currentPlayer: null,
      history: [],
      playerHistory: {}
    };
    io.emit('state', state);
  })

  socket.on('update', newState => {
    state = newState;
    io.emit('state', state);
  });
});

// Serve client static build for LAN hosting if present
const path = require('path');
const clientBuild = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientBuild));
app.get('*', (req, res) => res.sendFile(path.join(clientBuild, 'index.html')));

server.listen(4000, '0.0.0.0', () => console.log("Server running on 0.0.0.0:4000"));

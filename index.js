
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Minimal sample players; images can be URLs or local served static paths after build
const samplePlayers = [
  { id: 1, name: 'Player 1', img: '/images/WhatsApp Image 2025-12-31 at 10.24.58 PM (1).jpeg' },
  { id: 2, name: 'Player 2', img: '/images/WhatsApp Image 2025-12-31 at 10.24.58 PM (2).jpeg' },
  { id: 3, name: 'Player 3', img: '/images/WhatsApp Image 2025-12-31 at 10.24.58 PM (3).jpeg' },
  { id: 4, name: 'Player 4', img: '/images/WhatsApp Image 2025-12-31 at 10.24.58 PM.jpeg' },
  { id: 5, name: 'Player 5', img: '/images/WhatsApp Image 2025-12-31 at 10.24.59 PM (1).jpeg' },
  { id: 6, name: 'Player 6', img: '/images/WhatsApp Image 2025-12-31 at 10.24.59 PM (2).jpeg' },
  { id: 7, name: 'Player 7', img: '/images/WhatsApp Image 2025-12-31 at 10.24.59 PM.jpeg' },
  { id: 8, name: 'Player 8', img: '/images/WhatsApp Image 2025-12-31 at 10.25.00 PM (1).jpeg' },
  { id: 9, name: 'Player 9', img: '/images/WhatsApp Image 2025-12-31 at 10.25.00 PM (2).jpeg' },
  { id: 10, name: 'Player 10', img: '/images/WhatsApp Image 2025-12-31 at 10.25.00 PM (3) copy.jpeg' },
  { id: 11, name: 'Player 11', img: '/images/WhatsApp Image 2025-12-31 at 10.25.00 PM.jpeg' },
  { id: 12, name: 'Player 12', img: '/images/WhatsApp Image 2025-12-31 at 10.25.01 PM (1).jpeg' },
  { id: 13, name: 'Player 13', img: '/images/WhatsApp Image 2025-12-31 at 10.25.01 PM (2).jpeg' },
  { id: 14, name: 'Player 14', img: '/images/WhatsApp Image 2025-12-31 at 10.25.01 PM (3).jpeg' },
  { id: 15, name: 'Player 15', img: '/images/WhatsApp Image 2025-12-31 at 10.25.01 PM.jpeg' },
  { id: 16, name: 'Player 16', img: '/images/WhatsApp Image 2025-12-31 at 10.30.32 PM.jpeg' },
  { id: 17, name: 'Player 17', img: '/images/WhatsApp Image 2025-12-31 at 10.30.33 PM (1).jpeg' },
  { id: 18, name: 'Player 18', img: '/images/WhatsApp Image 2025-12-31 at 10.30.33 PM.jpeg' },
  { id: 19, name: 'Player 19', img: '/images/WhatsApp Image 2025-12-31 at 10.30.34 PM (1).jpeg' },
  { id: 20, name: 'Player 20', img: '/images/WhatsApp Image 2025-12-31 at 10.30.34 PM (2).jpeg' },
  { id: 21, name: 'Player 21', img: '/images/WhatsApp Image 2025-12-31 at 10.30.34 PM.jpeg' },
  { id: 22, name: 'Player 22', img: '/images/WhatsApp Image 2025-12-31 at 10.30.35 PM (1).jpeg' },
  { id: 23, name: 'Player 23', img: '/images/WhatsApp Image 2025-12-31 at 10.30.35 PM (2).jpeg' },
  { id: 24, name: 'Player 24', img: '/images/WhatsApp Image 2025-12-31 at 10.30.35 PM.jpeg' },
  { id: 25, name: 'Player 25', img: '/images/WhatsApp Image 2025-12-31 at 10.30.36 PM (1).jpeg' },
  { id: 26, name: 'Player 26', img: '/images/WhatsApp Image 2025-12-31 at 10.30.36 PM.jpeg' },
  { id: 27, name: 'Player 27', img: '/images/WhatsApp Image 2025-12-31 at 10.30.37 PM (1).jpeg' },
  { id: 28, name: 'Player 28', img: '/images/WhatsApp Image 2025-12-31 at 10.30.37 PM (2).jpeg' },
  { id: 29, name: 'Player 29', img: '/images/WhatsApp Image 2025-12-31 at 10.30.37 PM.jpeg' },
  { id: 30, name: 'Player 30', img: '/images/WhatsApp Image 2025-12-31 at 10.30.38 PM (1).jpeg' },
  { id: 31, name: 'Player 31', img: '/images/WhatsApp Image 2025-12-31 at 10.30.38 PM (2).jpeg' },
  { id: 32, name: 'Player 32', img: '/images/WhatsApp Image 2025-12-31 at 10.30.38 PM.jpeg' },
  { id: 33, name: 'Player 33', img: '/images/WhatsApp Image 2025-12-31 at 10.30.39 PM (1).jpeg' },
  { id: 34, name: 'Player 34', img: '/images/WhatsApp Image 2025-12-31 at 10.30.39 PM (2).jpeg' },
  { id: 35, name: 'Player 35', img: '/images/WhatsApp Image 2025-12-31 at 10.30.39 PM.jpeg' },
  { id: 36, name: 'Player 36', img: '/images/WhatsApp Image 2025-12-31 at 10.30.40 PM (1).jpeg' },
  { id: 37, name: 'Player 37', img: '/images/WhatsApp Image 2025-12-31 at 10.30.40 PM.jpeg' },
  { id: 38, name: 'Player 38', img: '/images/WhatsApp Image 2025-12-31 at 10.30.41 PM (1).jpeg' },
  { id: 39, name: 'Player 39', img: '/images/WhatsApp Image 2025-12-31 at 10.30.41 PM (2).jpeg' },
  { id: 40, name: 'Player 40', img: '/images/WhatsApp Image 2025-12-31 at 10.30.41 PM.jpeg' },
  { id: 41, name: 'Player 41', img: '/images/WhatsApp Image 2025-12-31 at 10.30.42 PM (1).jpeg' },
  { id: 42, name: 'Player 42', img: '/images/WhatsApp Image 2025-12-31 at 10.30.42 PM.jpeg' },
  { id: 43, name: 'Player 43', img: '/images/WhatsApp Image 2025-12-31 at 10.30.43 PM (1).jpeg' },
  { id: 44, name: 'Player 44', img: '/images/WhatsApp Image 2025-12-31 at 10.30.43 PM (2).jpeg' },
  { id: 45, name: 'Player 45', img: '/images/WhatsApp Image 2025-12-31 at 10.30.43 PM - Copy (2).jpeg' },
  { id: 46, name: 'Player 46', img: '/images/WhatsApp Image 2025-12-31 at 10.30.43 PM - Copy.jpeg' },
  { id: 47, name: 'Player 47', img: '/images/WhatsApp Image 2025-12-31 at 10.30.43 PM.jpeg' },
  { id: 48, name: 'Player 48', img: '/images/WhatsApp Image 2025-12-31 at 10.30.44 PM (1).jpeg' },
  { id: 49, name: 'Player 49', img: '/images/WhatsApp Image 2025-12-31 at 10.30.44 PM.jpeg' },
  { id: 50, name: 'Player 50', img: '/images/WhatsApp Image 2025-12-31 at 10.30.45 PM.jpeg' }


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

  socket.on('pickPlayer', () => {
    if (!state.started) return
    let pool;
    if (state.firstPool.length > 0) {
      pool = state.firstPool;
    } else if (state.unsoldPool.length > 0) {
      pool = state.unsoldPool;
    } else {
      state.currentPlayer = null;
      io.emit('state', state);
      return
    }
    const idx = Math.floor(Math.random() * pool.length)
    const player = pool.splice(idx, 1)[0]
    state.currentPlayer = player
    io.emit('state', state)
  })

  socket.on('sell', ({ teamId, amount }) => {
    if (!state.currentPlayer) return
    const team = state.teams.find(t => t.id === teamId)
    if (!team) return
    team.balance = (team.balance || 0) - Number(amount)
    state.history.push({ player: state.currentPlayer.name, team: team.name, amount: Number(amount), img: state.currentPlayer.img })
    if (!state.playerHistory[state.currentPlayer.id]) state.playerHistory[state.currentPlayer.id] = []
    state.playerHistory[state.currentPlayer.id].push({ action: 'sold', team: team.name, amount: Number(amount) })
    state.currentPlayer = null
    io.emit('state', state)
  })

  socket.on('unsell', () => {
    if (!state.currentPlayer) return
    // return current player back to unsold pool
    state.unsoldPool.push(state.currentPlayer)
    if (!state.playerHistory[state.currentPlayer.id]) state.playerHistory[state.currentPlayer.id] = []
    state.playerHistory[state.currentPlayer.id].push({ action: 'unsold' })
    state.currentPlayer = null
    io.emit('state', state)
  })

  socket.on('reset', () => {
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

server.listen(4000, '0.0.0.0', () => console.log("Server running on 0.0.0.0:4000"));

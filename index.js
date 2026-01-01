
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Minimal sample players; images can be URLs or local served static paths after build
const samplePlayers = [
  { id: 1, name: 'Player 1', img: '/images/img1.jpeg' ,type:"bowler"},
  { id: 2, name: 'Player 2', img: '/images/img2.jpeg' ,type:"bowler"},
  { id: 3, name: 'Player 3', img: '/images/img3.jpeg' ,type:"bowler"},
  { id: 4, name: 'Player 4', img: '/images/img4.jpeg' ,type:"bowler"},
  { id: 5, name: 'Player 5', img: '/images/img5.jpeg' ,type:"w_keeper"},
  { id: 6, name: 'Player 6', img: '/images/img6.jpeg' ,type:"bowler"},
  { id: 7, name: 'Player 7', img: '/images/img7.jpeg' ,type:"trump"},
  { id: 8, name: 'Player 8', img: '/images/img8.jpeg' ,type:"batsman"},
  { id: 9, name: 'Player 9', img: '/images/img9.jpeg' ,type:"batsman"},
  { id: 10, name: 'Player 10', img: '/images/img10.jpeg' ,type:"bowler"},
  { id: 11, name: 'Player 11', img: '/images/img11.jpeg' ,type:"batsman"},
  { id: 12, name: 'Player 12', img: '/images/img12.jpeg' ,type:"all_rounder"},
  { id: 13, name: 'Player 13', img: '/images/img13.jpeg' ,type:"batsman"},
  { id: 14, name: 'Player 14', img: '/images/img14.jpeg' ,type:"batsman"},
  { id: 15, name: 'Player 15', img: '/images/img15.jpeg' ,type:"batsman"},
  { id: 16, name: 'Player 16', img: '/images/img16.jpeg' ,type:"batsman"},
  { id: 17, name: 'Player 17', img: '/images/img17.jpeg' ,type:"all_rounder"},
  { id: 18, name: 'Player 18', img: '/images/img18.jpeg' ,type:"batsman"},
  { id: 19, name: 'Player 19', img: '/images/img19.jpeg' ,type:"w_keeper"},
  { id: 20, name: 'Player 20', img: '/images/img20.jpeg' ,type:"bowler"},
  { id: 21, name: 'Player 21', img: '/images/img21.jpeg' ,type:"w_keeper"},
  { id: 22, name: 'Player 22', img: '/images/img22.jpeg' ,type:"w_keeper"},
  { id: 23, name: 'Player 23', img: '/images/img23.jpeg' ,type:"bowler"},
  { id: 24, name: 'Player 24', img: '/images/img24.jpeg' ,type:"batsman"},
  { id: 25, name: 'Player 25', img: '/images/img25.jpeg' ,type:"batsman"},
  { id: 26, name: 'Player 26', img: '/images/img26.jpeg' ,type:"batsman"},
  { id: 27, name: 'Player 27', img: '/images/img27.jpeg' ,type:"batsman"},
  { id: 28, name: 'Player 28', img: '/images/img28.jpeg' ,type:"batsman"},
  { id: 29, name: 'Player 29', img: '/images/img29.jpeg' ,type:"all_rounder"},
  { id: 30, name: 'Player 30', img: '/images/img30.jpeg' ,type:"all_rounder"},
  { id: 31, name: 'Player 31', img: '/images/img31.jpeg' ,type:"bowler"},
  { id: 32, name: 'Player 32', img: '/images/img32.jpeg' ,type:"bowler"},
  { id: 33, name: 'Player 33', img: '/images/img33.jpeg' ,type:"all_rounder"},
  { id: 34, name: 'Player 34', img: '/images/img34.jpeg' ,type:"w_keeper"},
  { id: 35, name: 'Player 35', img: '/images/img35.jpeg' ,type:"batsman"},
  { id: 36, name: 'Player 36', img: '/images/img36.jpeg' ,type:"all_rounder"},
  { id: 37, name: 'Player 37', img: '/images/img37.jpeg' ,type:"batsman"},
  { id: 38, name: 'Player 38', img: '/images/img38.jpeg' ,type:"bowler"},
  { id: 39, name: 'Player 39', img: '/images/img39.jpeg' ,type:"bowler"},
  { id: 40, name: 'Player 40', img: '/images/img40.jpeg' ,type:"batsman"},
  { id: 41, name: 'Player 41', img: '/images/img41.jpeg' ,type:"batsman"},
  { id: 42, name: 'Player 42', img: '/images/img42.jpeg' ,type:"bowler"},
  { id: 43, name: 'Player 43', img: '/images/img43.jpeg' ,type:"batsman"},
  { id: 44, name: 'Player 44', img: '/images/img44.jpeg' ,type:"all_rounder"},
  { id: 45, name: 'Player 45', img: '/images/img45.jpeg' ,type:"trump"},
  { id: 46, name: 'Player 46', img: '/images/img46.jpeg' ,type:"trump"},
  { id: 47, name: 'Player 47', img: '/images/img47.jpeg' ,type:"trump"},
  { id: 48, name: 'Player 48', img: '/images/img48.jpeg' ,type:"batsman"},
  { id: 49, name: 'Player 49', img: '/images/img49.jpeg' ,type:"w_keeper"},
  { id: 50, name: 'Player 50', img: '/images/img50.jpeg',type:"bowler" }


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
    state.history.push({ player: state.currentPlayer.name, team: team.name, amount: Number(amount), img: state.currentPlayer.img,type:  state.currentPlayer.type})
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

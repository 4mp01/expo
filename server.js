
const express = require('express')
const app = express()
const server = require('http').Server(app);
const io = require('socket.io')(server)
const path = require('path')
require('dotenv/config')

app.set('views', './views')
app.set('view engine', 'ejs')

app.use('/public', express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))

const rooms = {}

app.get('/', (req, res) => {
  res.render('index', { rooms: rooms })
})

app.post('/room', (req, res) => {
  if (rooms[req.body.room != null]) { return res.redirect('/') }
  rooms[req.body.room] = { users: {} }
  res.redirect(req.body.room)
  io.emit('room-created', req.body.room)
})

app.get('/:room', (req, res) => {
  if (rooms[req.body.room == null]) { return res.redirect('/') }
  res.render('room', { roomName: req.params.room })
})

io.on('connection', socket => {
  
  socket.on('new-user', (room, name) => {
    socket.join(room)
    rooms[room].users[socket.id] = name
    socket.to(room).emit('user-connected', name)
  })

  socket.on('send-chat-message', (room, message) => {
    socket.to(room).emit('chat-message', { message: message, name: rooms[room].users[socket.id] })
  })

  socket.on('disconnect', () => {
    getUserRooms(socket).forEach(room => {
      socket.to(room).emit('user-disconnected', rooms[room].users[socket.id])
      delete rooms[room].users[socket.id]
    })
  })
})

function getUserRooms(socket) {
  return Object.entries(rooms).reduce( (names, [name, room]) => {
    if (room.users[socket.id] != null) names.push(name)
    return names
  }, [])
}

server.listen(process.env.PORT || 9999, () => {
  console.log("Listening to port: "+process.env.PORT || 9999 )
})


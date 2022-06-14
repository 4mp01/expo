
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

  res.render('room', {roomName: req.params.room})
})

const users = {}

io.on('connection', socket => {
  socket.on('new-user', name => {
    users[socket.id] = name
    socket.broadcast.emit('user-connected', name)
  })
  socket.on('send-chat-message', message => {
    socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] })
  })

  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', users[socket.id])
    delete users[socket.id]
  })

})

server.listen(process.env.PORT || 9999, () => {
  console.log("Listening to port: "+ process.env.PORT || 9999 )
})
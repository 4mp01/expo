
const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const server = require('http').Server(app);
const io = require('socket.io')(server)
const request = require("request");
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

// HEROKU WEBHOOK

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/webhook", async (req, res) => {
 const Payload = req.body;
//Respond To Heroku Webhook
 res.sendStatus(200);

 const options = {
  method: "POST",
  url:
   "https://discord.com/api/webhooks/981901122757337198/aWmE2XQVoXKmK5z-0MSl6-6F7ZMxasauRLp_ziRPuZR0Z5RYiZ-N2tGyekJmRCrQ21bm",
  headers: {
   "Content-type": "application/json",
  },
//Format JSON DATA
  body: JSON.stringify({
   content: `This is A Webhook notification!A build for your app ${Payload.data.app.name} was just triggered`,
  }),
 };
 request(options, function (error, response) {
  if (error) throw new Error(error);
  console.log(response);
 });
});
app.listen(process.env.PORT || 9999, () => console.log("App is running on port 3000!"));
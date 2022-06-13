
const socket = io('https://amphoteric.herokuapp.com/')
const messageContainer = document.getElementById('message-container')
const roomContainer = document.getElementById('room-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')

if (messageForm != null) {
  const name = prompt('What is your name?')
  appendMessage(`${name} joined`)
  socket.emit('new-user', name)

  messageForm.addEventListener('submit', e => {
    if (messageInput.value == '') {
      alert('Input something')
    } else {
      const message = messageInput.value
      appendMessage(`${name}: ${message}`)
      socket.emit('send-chat-message', message)
      messageInput.value = ''
    } 
    e.preventDefault()
  })

}

socket.on('room-created', room => {
  const roomElement = document.createElement('div')
  roomElement.innerText=room
  const roomLink = document.createElement('a')
  roomLink.innerText='join'
  roomContainer.append(roomElement, roomLink)
})

socket.on('chat-message', data => {
  appendMessage(`${data.name}: ${data.message}`)
})

socket.on('user-connected', name => {
  appendMessage(`${name} connected`)
})

socket.on('user-disconnected', name => {
  appendMessage(`${name} disconnected`)
})

function appendMessage(message) {
  const messageElement = document.createElement('div')
  messageElement.innerText = message
  messageContainer.append(messageElement)
}
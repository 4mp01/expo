
const socket = io('https://www.amphoteric.herokuapp.com/')
const messageContainer = document.getElementById('message-container')
const roomContainer = document.getElementById('room-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')

if (messageForm != null) {
  
  const name = prompt('What is your name?')
  
  if (name == '') {

  alert('Reload The Site And Enter your name!')

  } else if (name != null) {

    appendMessage(`<h2>${name} joined</h2>`)
    socket.emit('new-user', name)

    messageForm.addEventListener('submit', e => {
      if (messageInput.value == '') {
        alert('Input something')
      } else {

        const message = messageInput.value

        const dateHours = new Date().getHours() 
        const dateMinutes = new Date().getMinutes()
        const ampm = 0 <= dateHours || dateHours >= 12 ? ' am' : ' pm';

        appendMessage(`<h3 class='h3'>${name}</h3> <h3 class='mnt'>${message}</h3> ${' at ' + dateHours + ':' + dateMinutes + ampm}`)
        socket.emit('send-chat-message', message)
        messageInput.value = ''
      } 
      e.preventDefault()
    })
  } else {
    alert('Reload The Site And Enter your name!')
  }
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
  
  const encrypted = CryptoJS.AES.encrypt(message, "Secret Passphrase")
  const decrypted = CryptoJS.AES.decrypt(encrypted, "Secret Passphrase")

  messageElement.innerHTML = decrypted.toString(CryptoJS.enc.Utf8)
  messageContainer.append(messageElement)
}



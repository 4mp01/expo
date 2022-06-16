
import { socket, messageForm, messageInput } from "../export.js" 
import appendMessage from "./append-message.js"

export default function messageform() {

    if (messageForm != null) {
  
      const name = prompt('What is your name?')
        
      if (name == '') {
      
      alert('Reload The Site And Enter your name!')
      
      } else if (name != null) {
      
        appendMessage(`<h2>${name} joined</h2>`)
        socket.emit('new-user', roomName, name)
      
        messageForm.addEventListener('submit', e => {
          if (messageInput.value == '') {
            alert('Input something')
          } else {
      
            const message = messageInput.value
      
            const dateHours = new Date().getHours() 
            const dateMinutes = new Date().getMinutes()
            const ampm = 0 <= dateHours || dateHours >= 12 ? ' am' : ' pm';
      
            appendMessage(`<br><h3 class='h3'>${name}</h3> <h3 class='mnt' id='message_txt'> ${message}</h3> ${' at ' + dateHours + ':' + dateMinutes + ampm}`)
            socket.emit('send-chat-message', roomName, message)
            messageInput.value = ''
          } 
          e.preventDefault()
        })
      } else {
        alert('Reload The Site And Enter your name!')
      }
    }
}

appendMessage()
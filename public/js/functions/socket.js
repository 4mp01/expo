
import { socket, roomContainer } from '../export.js'
import appendMessage from './append-message.js'

export default function socketio() {

    socket.on('room-created', room => {
        const roomElement = document.createElement('div')
        roomElement.innerText=room
        const roomLink = document.createElement('a')
        roomLink.innerText='join'
        roomContainer.append(roomElement, roomLink)
    })
    
    socket.on('chat-message', data => {
        const dateHours = new Date().getHours() 
        const dateMinutes = new Date().getMinutes()
        const ampm = 0 <= dateHours || dateHours >= 12 ? ' am' : ' pm';
    
        appendMessage(`<br><h3 class='h3'>${data.name}</h3> <h3 class='mnt'>${data.message}</h3> ${' at ' + dateHours + ':' + dateMinutes + ampm}`)
    })
    
    socket.on('user-connected', name => {
        if (name != null) {
            appendMessage(`<h2>${name} connected</h2>`)
        }
    })
    
    socket.on('user-disconnected', name => {
        if (name != null) {
            appendMessage(`<h2>${name} disconnected</h2>`)
        }
    })
}

appendMessage()
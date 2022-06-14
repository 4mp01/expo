
import { messageContainer } from "../export.js"

export default function appendMessage(message) {
        
    const encrypted = CryptoJS.AES.encrypt(message, "Secret Passphrase")
    const decrypted = CryptoJS.AES.decrypt(encrypted, "Secret Passphrase")
      
    const messageElement = document.createElement('div')
    messageElement.innerHTML = decrypted.toString(CryptoJS.enc.Utf8)
        
    messageContainer.append(messageElement)
}
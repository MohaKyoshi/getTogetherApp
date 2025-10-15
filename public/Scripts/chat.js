const socket = io();

const chatContainer = document.getElementById('chatContainer').firstElementChild

const toUser = document.getElementById('toUser')
const msgBox = document.getElementById('msgBox')

const data = JSON.parse(sessionStorage.getItem('data'))


socket.emit('register', data.username)



msgBox.addEventListener('keydown', event =>{
    if (event.key == 'Enter'){
        socket.emit('sendMessage', socket.id, msgBox.value, toUser.value)
        
        createMsg(msgBox.value, 'sent')
        msgBox.value = ''
    }
})

socket.on('recieveMessage', (from, msg)=>{
        createMsg(msg, 'recieve')
})




function createMsg(message, type) {
    
    const msg = document.createElement('p');

    msg.innerText = message
    msg.setAttribute('id', type)

    chatContainer.appendChild(msg)
    
}
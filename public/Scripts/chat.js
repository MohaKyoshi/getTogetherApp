const socket = io();

const chatContainer = document.getElementById('chatContainer').firstElementChild

const msgBox = document.getElementById('msgBox')

const data = JSON.parse(sessionStorage.getItem('data'))


socket.emit('register', data)

socket.on("joined", _ =>{
    createMsg(`You Joined ${data.roomname}`, "recieve")

    socket.emit('sendMessage', `${data.username} Joined ${data.roomname}` )
})

socket.on("created", _ =>{
    createMsg(`You Created ${data.roomname}`, "recieve")
})


document.getElementById("roomname").innerText = data.roomname




msgBox.addEventListener('keydown', event =>{
    if (event.key == 'Enter'){
        socket.emit('sendMessage', msgBox.value)
        
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
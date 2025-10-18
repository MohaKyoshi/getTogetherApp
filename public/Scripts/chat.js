const socket = io();

const chatContainer = document.getElementById('chatContainer')

const msgBox = document.getElementById('msgBox')

const data = JSON.parse(sessionStorage.getItem('data'))


socket.emit('register', data)

socket.on("joined", _ =>{
    createMsg(`You Joined ${data.roomname}`, "notification")

    socket.emit('sendNotification', `${data.username} Joined ${data.roomname}` )
})

socket.on("created", _ =>{
    createMsg(`You Created ${data.roomname}`, "notification")
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
        createMsg(msg, 'recieve', from)
})


socket.on('recieveNotification', (from, msg)=>{
        createMsg(msg, 'notification')
})



function createMsg(message, type, from) {
    
    const msg = document.createElement('p');


    if (type == 'recieve'){
        const recieveBox = document.createElement('div')

        recieveBox.setAttribute('class','recieveBox');

        const nameUser = document.createElement('p')
        nameUser.innerText = from
        nameUser.setAttribute('class','fromname');


        chatContainer.appendChild(recieveBox)
        recieveBox.appendChild(nameUser)
        recieveBox.appendChild(msg)

    }else{
        chatContainer.appendChild(msg)
    }

    msg.innerText = message
    msg.setAttribute('class', type)
    
}

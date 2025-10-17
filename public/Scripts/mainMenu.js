const socket = io()


const usernameInput = document.getElementsByClassName("usernameInput")[0]
const roomnameInput = document.getElementsByClassName("roomnameInput")[0]

const joinButton = document.getElementsByClassName('joinbtn')[0]
const createButton = document.getElementsByClassName('createbtn')[0]

let user = {}


createButton.addEventListener('click', event =>{
        if (usernameInput.value != "" && roomnameInput.value != ""){

        user = {
            username:usernameInput.value.trim().toLowerCase(),
            roomname:roomnameInput.value.trim().toLowerCase(),
            created:true
        }

        
        socket.emit("creating-room", user)
    }else{
        refused();
    }
})

socket.on("acceptCreating", existRoom =>{
    if (existRoom){
        console.log(user.roomname + " exist")

        refused();
    }else {
        // if room does not exist it will create one
        sessionStorage.setItem("data",JSON.stringify(user))
        location.href = "/chat"
    }
})



joinButton.addEventListener('click', event =>{
        if (usernameInput.value != "" && roomnameInput.value != ""){

        user = {
            username:usernameInput.value.trim().toLowerCase(),
            roomname:roomnameInput.value.trim().toLowerCase(),
            created:false
        }

        
        socket.emit("join-room", user)
    }else{
        refused();
    }
})


socket.on("acceptjoinning", existRoom =>{
    if (existRoom){
        // if room does not exist it will create one
        sessionStorage.setItem("data",JSON.stringify(user))
        location.href = "/chat"
    }else {
        refused();
        console.log(user.roomname + " Does not exist")
    }
})







function refused() {
    usernameInput.classList.add("refused");
    roomnameInput.classList.add("refused");

    setTimeout(() => {
    usernameInput.classList.remove("refused");
    roomnameInput.classList.remove("refused");
    }, 500);   
}

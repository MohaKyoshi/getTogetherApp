const port = 3000;

const express = require("express");
const fs = require("fs");
const http = require("http");
const path = require("path");




const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
    cors:{
        origin:`http://localhost:${port}/`
    }
});

app.use(express.static(path.join(__dirname, "public")))

app.use(express.json());



app.get("/", (req, res) =>{
    res.sendFile(path.join(__dirname, "public", "main.html"))
})

app.get("/chat", (req, res)=>{
    res.sendFile(path.join(__dirname,"public", "roomchat.html"))
})

app.post("/submit", (req, res) =>{
         
        res.status(200).json({ success: true });

        console.log("New user Joined Server : " + JSON.stringify(req.body.username))
    })





// This will take the new id we create by socket.io and change it later to username
let registerdUser = {};

io.on("connection", async (socket) =>{
    
    // Create Room
    socket.on('creating-room', user =>{
        const rooms = io.sockets.adapter.rooms

        const existRoom = rooms.get(user.roomname)

        socket.emit("acceptCreating", existRoom)
    })

    // Join Room
    socket.on('join-room', user =>{
        const rooms = io.sockets.adapter.rooms

        const existRoom = rooms.get(user.roomname)

        socket.emit("acceptjoinning", existRoom)
    })


    // Register
    socket.on("register", data =>{
        socket.join(data.roomname)

        if (data.created == true){
            socket.emit("created")
        }else{
            socket.emit("joined")
        }

        socket.data = data
    })


    // Send and recieve Message
    socket.on("sendMessage", (msg) =>{

        socket.to(socket.data.roomname).emit("recieveMessage", socket.data.username, msg);

    })



    socket.on("disconnect", _=>{
        console.log("User Disconnected : " + socket.id)
    })
})


server.listen(port, _=>{
    console.log("Server running at http://localhost:" + port.toString());
})

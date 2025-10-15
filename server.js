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
    fs.readFile(path.join(__dirname, "dataBase.json"), (Rerr, data)=>{
        if (Rerr) {console.log("There is error in Reading file and it is : " + Rerr)}
        
        let get_data = []
        try {
            get_data = JSON.parse(data);
        } catch (parseError) {
            console.log("There is error with parsing info" + parseError)
        }

        const exist = get_data.some(u => u.username === req.body.username)


        if (!exist){
                get_data.push(req.body)
                fs.writeFile(path.join(__dirname, "dataBase.json"), JSON.stringify(get_data, null, 2), err =>{ 
                    if(err) console.log("There is Error in writing File and it is : " + err) 
                    })

                res.status(200).json({ success: true });

                console.log("New user Joined Server : " + JSON.stringify(req.body.username))
        }else if (exist) {
            console.log ("User already exists : " + JSON.stringify(req.body.username))
            res.status(200).json({ success: true });
        }
        
    })

})

// This will take the new id we create by socket.io and change it later to username
let registerdUser = {};

io.on("connection", async (socket) =>{
    
    // Register
    socket.on('register', username =>{

        registerdUser[username] = socket.id

        console.log(username + " Registered as : " + socket.id)
    })

    

    socket.on('sendMessage', (from, msg, to) =>{

        const targetSocketId = registerdUser[to]

        console.log("from : " + targetSocketId, " Message : " + msg, "To : ", to)
        
        if (targetSocketId){
            io.to(targetSocketId).emit('recieveMessage', from, msg);

            console.log(registerdUser)
        } else {
            io.to(targetSocketId).emit('recieveMessage', from, 'UserOffline');
        }

    } )

    socket.on("disconnect", _=>{
        console.log("User Disconnected : " + socket.id)
    })
})


server.listen(port, _=>{
    console.log("Server running at http://localhost:" + port.toString());
})

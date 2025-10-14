const port = 3000;

const express = require("express");
const fs = require("fs");
const http = require("http");
const path = require("path");



const app = express();
const server = http.createServer(app);

app.use(express.static(path.join(__dirname, "public")))

app.use(express.json());



app.get("/", (req, res) =>{
    res.sendFile(path.join(__dirname, "public", "index.html"))
})

app.get("/chat", (req, res)=>{
    res.sendFile(path.join(__dirname,"public", "roomchat.html"))
})

app.post("/submit", (req, res) =>{
    fs.readFile(path.join(__dirname, "dataBase.json"), (Rerr, data)=>{
        if (Rerr) console.log("There is error in Reading file and it is : " + Rerr)
        
        const get_data = JSON.parse(data)

        const exist = get_data.some(u => u.username === req.body.username)

        if (!exist){
                get_data.push(req.body)
                fs.writeFile(path.join(__dirname, "dataBase.json"), JSON.stringify(get_data), err =>{ if(err) console.log("There is Error in writing File and it is : " + err) })

                console.log("New user Joined Server : " + JSON.stringify(req.body.username))
        }else console.log ("User already exists : " + JSON.stringify(req.body.username))
        
    })

})



server.listen(port, _=>{
    console.log("Server running at http://localhost:" + port.toString());
})

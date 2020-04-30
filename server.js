"use strict"

const express = require("express")
const socketIO = require("socket.io")

const port = process.env.PORT || 3000
const index = "/pictionary.html"
const server = express()
    .use((req, res)=>{
        res.sendFile(index, {root : __dirname})
    })
    .listen(port, ()=>{
        console.log("server started on port", port);
    });
const io = socketIO(server)

io.on("connection", (socket)=>{
    console.log("a new user join the game");
    onConnection(socket)
})
let users = []
let currentPlayer = null
let timeOut = null
const word = ["apple", "machin", "truc"]
function onConnection(socket){
    socket.on("username", (username)=>{
        console.log(("Player name:", username));
        socket.username = username
        if (users.length === 0) {
            currentPlayer = socket
            users.push(socket)
            switchPlayer()
        }else{
            users.push(socket)
            sendUsers()
        }
        
       
    })
    socket.on("disconnect", ()=>{
        console.log("user left");
        users = users.filter((user)=>{
            return user != socket
        })
        sendUsers()
        if (users.length === 0) {
            timeOut = clearTimeout(timeOut)
        }
    })
    socket.on("line", (data)=>{
        socket.broadcast.emit("line", data)
    })
}
function sendUsers(){
    io.emit("users", users.map((user)=>{
        return {
            "username" : user.username,
            "isActive" : currentPlayer === user
        }
    }))
}
function switchPlayer(){
    const indexCurrentPlayer = users.indexOf(currentPlayer)
    currentPlayer = users[(indexCurrentPlayer + 1)%users.length]
    sendUsers()
    const newWord = word[Math.floor(Math.random()*word.length)]
    currentPlayer.emit("word", newWord)
    io.emit("clear")
    timeOut =  setTimeout(switchPlayer, 60000)
}
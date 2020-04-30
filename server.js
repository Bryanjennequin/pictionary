"use strict"

const express = require("express")
const  socketIO = require("socket.io")

const port = process.env.PORT || 3000
const index = "/pictionary.html"
const server = express()
    .use((req, res)=>{
        res.sendFile(index, {root : __dirname})
    })
    .listen(port, ()=>{
        console.log("server started on port", port);
    })
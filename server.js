const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// GAME VARIABLES
let currentCommand = "stop";
let jumpCommand = false;
let currentChat = "";      // <--- THE CHAT VARIABLE
let streamID = "";

// 1. Handle Movement
app.post('/control', (req, res) => {
    if (req.body.direction) {
        currentCommand = req.body.direction;
        setTimeout(() => { currentCommand = "stop"; }, 500); 
    }
    if (req.body.jump) {
        jumpCommand = true;
        setTimeout(() => { jumpCommand = false; }, 500);
    }
    res.send({ status: "received" });
});

// 2. Handle Chat (THIS WAS MISSING!)
app.post('/chat', (req, res) => {
    currentChat = req.body.message;
    console.log("Chat received:", currentChat);
    res.send({ status: "saved" });
});

// 3. Handle Video ID
app.post('/set-stream', (req, res) => {
    streamID = req.body.id;
    res.send({ status: "saved" });
});

// 4. Send Data to Roblox
app.get('/get-command', (req, res) => {
    res.json({ 
        command: currentCommand, 
        jump: jumpCommand, 
        chat: currentChat, // <--- Sends chat to Roblox
        streamID: streamID 
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Variables to hold the game state
let currentCommand = "stop";
let jumpCommand = false;
let currentChat = "";
let streamID = ""; // <--- NEW: Stores the video ID

// 1. Receive Movement or Jump
app.post('/control', (req, res) => {
    if (req.body.direction) {
        currentCommand = req.body.direction;
        // Safety: Auto-stop after 0.5s so he doesn't walk forever
        setTimeout(() => { currentCommand = "stop"; }, 500);
    }
    if (req.body.jump) {
        jumpCommand = true;
        setTimeout(() => { jumpCommand = false; }, 500);
    }
    res.send({ status: "received" });
});

// 2. Receive the Video ID from the Host
app.post('/set-stream', (req, res) => {
    streamID = req.body.id;
    console.log("New Stream ID set:", streamID);
    res.send({ status: "saved" });
});

// 3. Roblox (and Phone) asks for data
app.get('/get-command', (req, res) => {
    res.json({ 
        command: currentCommand, 
        jump: jumpCommand, 
        chat: currentChat,
        streamID: streamID // <--- Sends the ID to the phone
    });
});

// Start Server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
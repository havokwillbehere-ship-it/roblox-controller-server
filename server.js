const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Variables to hold the current game state
let currentCommand = "stop";
let jumpCommand = false;
let currentChat = "";

// 1. Receive Movement or Jump commands
app.post('/control', (req, res) => {
    // Handle Movement
    if (req.body.direction) {
        currentCommand = req.body.direction;
        console.log("Move:", currentCommand);
    }
    // Handle Jump
    if (req.body.jump) {
        jumpCommand = true;
        console.log("Command: JUMP");
        // Reset the jump switch after 0.5 seconds so he doesn't fly
        setTimeout(() => { jumpCommand = false; }, 500);
    }
    res.send({ status: "received" });
});

// 2. Receive Chat messages
app.post('/chat', (req, res) => {
    currentChat = req.body.message;
    console.log("Chat:", currentChat);
    res.send({ status: "sent" });
});

// 3. Roblox asks "What should I do?"
app.get('/get-command', (req, res) => {
    res.json({ 
        command: currentCommand,
        jump: jumpCommand,
        chat: currentChat
    });
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
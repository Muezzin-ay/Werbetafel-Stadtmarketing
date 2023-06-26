const http = require('http');
const express = require('express');
const { Server } = require('socket.io');

// Own 
const api = require('./modules/module_api');
const db = require('./modules/db');
const commands = require('./modules/system_commands');
const { debugBot } = require('./modules/telegram_bot');

//const webdriver = require('./modules/webdriver');

// Settings
const PORT = 8084;

//establish database connection
//commands.startMariaDBServer()
db.authenticate();
//db.initDatabase();
var app = express();

app.use(function(req, res, next){
    next();
});

// Backend connection
app.use('/api', api);

// Frontend 
app.use('/', express.static(__dirname + "/public"))
app.use('/show', express.static(__dirname + "/public/show.html"))

var server = http.createServer(app)

const io = new Server(server);
io.on('connection', (socket) => {
    console.log('[SERVER] Socket connection established');
});

debugBot.on('message', (msg) => {
    const chatId = msg.chat.id;
    io.emit("letsgo", msg);
    debugBot.sendMessage(chatId, 'Received your message');
});

server.listen(PORT);
console.log('[SERVER] Listening on Port ' + PORT);

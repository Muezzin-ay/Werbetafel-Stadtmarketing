/*
    Head File 'Werbetafel Stadtmarketing'-Project
    Author: Robin Hart
    Creation date: 04.11.22
    Github: https://github.com/Muezzin-ay/Werbetafel-Stadtmarketing
*/


const http = require('http');
const express = require('express');
const { Server } = require('socket.io');

// Own 
const api = require('./modules/module_api');
const db = require('./modules/db');
const commands = require('./modules/system_commands');
const { establishTelegramConnection } = require('./modules/telegram_bot');

// Settings
const PORT = 8084;

//establish database connection
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

establishTelegramConnection(io);

server.listen(PORT);
console.log('[SERVER] Listening on Port ' + PORT);

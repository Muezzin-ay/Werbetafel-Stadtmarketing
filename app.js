var http = require('http');
var express = require('express');

// Own 
const api = require('./modules/module_api');
const db = require('./modules/db')
const commands = require('./modules/system_commands')


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

var server = http.createServer(app).listen(PORT);
console.log('[SERVER] Listening on Port ' + PORT);


const TelegramBot = require('node-telegram-bot-api');

const database = require('./db');


function establishTelegramConnection(io) {
    database.readTelegramSecret((token) => {
        let debugBot;

        if (token != "") {
            try {
                debugBot = new TelegramBot(token, {polling: true});
            
                debugBot.on('message', (msg) => {
                    const chatId = msg.chat.id;
                    io.emit("showMessage", msg);
                    debugBot.sendMessage(chatId, 'Received your message');
                });
            } catch(e) {
                console.error('[BOT] An error occured, while connection to Telegram!');
            }
        } else {
            console.error('[BOT] Did not start, there was no Token set!');
        }
    
    });
}


module.exports = { establishTelegramConnection }
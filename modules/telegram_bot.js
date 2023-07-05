
const TelegramBot = require('node-telegram-bot-api');

const database = require('./db');


function establishTelegramConnection(io) {
    database.readTelegramSecret((token) => {
        let debugBot;
    
        try {
            debugBot = new TelegramBot(token, {polling: true});
        } catch(e) {
            console.error('[BOT] An error occured, while connection to Telegram!')
            return;
        }

        try {
            debugBot.on('message', (msg) => {
                const chatId = msg.chat.id;
                io.emit("letsgo", msg);
                debugBot.sendMessage(chatId, 'Received your message');
            });
        } catch(e) {
            console.error('Could not connect to debug Bot, please check connection to the internet!');
            return;
        }
    });
}


module.exports = { establishTelegramConnection }
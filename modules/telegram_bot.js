
const TelegramBot = require('node-telegram-bot-api');

const token = '6289890383:AAGNLZQH9GZ0aNSFWkGGt2hX6oR9XqMBmnA';
let debugBot;

try {
    debugBot = new TelegramBot(token, {polling: true});
} catch(e) {

}


module.exports = {debugBot}
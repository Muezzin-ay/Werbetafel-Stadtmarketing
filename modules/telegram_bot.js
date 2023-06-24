
const TelegramBot = require('node-telegram-bot-api');

const token = '6289890383:AAGNLZQH9GZ0aNSFWkGGt2hX6oR9XqMBmnA';

const bot = new TelegramBot(token, {polling: true});

module.exports = {bot}
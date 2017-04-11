const io = require("socket.io-client");

const GeneralsSocket = require("./GeneralsSocket");
const GameData = require("./GameData");
const MOVES = require("./moves");

const socket = new GeneralsSocket('http://botws.generals.io');

const BOT_CONFIG = {
    user_id: 'botYepke',
    username: '[Bot]Yepke'
};

var gameData;
socket.init = function () {
    console.log('Connected to server.');
    this.setUsername(BOT_CONFIG.user_id, BOT_CONFIG.username);
    var custom_game_id = 'my_private_game44567';
    this.joinPrivate(custom_game_id, BOT_CONFIG.user_id);
    this.setForceStart(custom_game_id, true);
    console.log('Joined custom game at http://bot.generals.io/games/' + encodeURIComponent(custom_game_id));
};

socket.gameStart = function (data) {
    // Get ready to start playing the game.
    gameData = new GameData(data.playerIndex);
    var replay_url = 'http://bot.generals.io/replays/' + encodeURIComponent(data.replay_id);
    console.log('Game starting! The replay will be available after the game at ' + replay_url);
};


socket.gameUpdate = function (data) {
    gameData.patch(data.generals, data.map_diff, data.cities_diff);
    MOVES.randomMove(gameData, socket);
};

socket.gameLost = function() {  this.leaveGame(); };
socket.gameWon  = function() {  this.leaveGame(); };
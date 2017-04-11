/**
 * Created by madewael on 10/04/17.
 */
const io = require("socket.io-client");

function GeneralsSocket(url) {
    this.socket = io(url);

    const gs = this;
    this.socket.on("game_start",   function(data){ gs.gameStart(data);    });
    this.socket.on("game_update",  function(data){ gs.gameUpdate(data);   });
    this.socket.on("game_lost",    function(data){ gs.gameLost(data);     });
    this.socket.on("game_won",     function(data){ gs.gameWon(data);      });
    this.socket.on("chat_message", function(data){ gs.receiveChatMessage(data); });
    this.socket.on("stars",        function(data){ gs.stars(data);        });
    this.socket.on("rank",         function(data){ gs.rank(data);         });


    this.socket.on('connect', function () {
        gs.init();
    });

    this.socket.on('disconnect', function () {
        console.error('Disconnected from server.');
        process.exit(1);
    });
};

GeneralsSocket.prototype.setUsername = function(user_id, username) {
    this.socket.emit("set_username", user_id, username);
};

GeneralsSocket.prototype.play = function(user_id) {
    this.socket.emit("play", user_id);
};

GeneralsSocket.prototype.join1v1 = function(user_id, username) {
    this.socket.emit("join_1v1", user_id, username);
};

GeneralsSocket.prototype.joinPrivate = function(custom_game_id, user_id) {
    this.socket.emit("join_private", custom_game_id, user_id);
    // console.log('Join the same custom game at http://bot.generals.io/games/' + encodeURIComponent(custom_game_id));
};

GeneralsSocket.prototype.setCustomTeam = function(custom_game_id, team) {
    this.socket.emit("set_custom_team", custom_game_id, team);
};

GeneralsSocket.prototype.joinTeam = function(team_id, user_id) {
    this.socket.emit("join_team", team_id, user_id);
    //console.log('Join the same 2v2 team at http://bot.generals.io/teams/' + encodeURIComponent(team_id));
};

GeneralsSocket.prototype.leaveTeam = function(team_id) {
    this.socket.emit("leave_team", team_id);
};

GeneralsSocket.prototype.cancel = function() {
    this.socket.emit("cancel");
};

GeneralsSocket.prototype.setForceStart = function(queue_id, doForce) {
    this.socket.emit("set_force_start", queue_id, doForce);
};

GeneralsSocket.prototype.attack = function(start, end, is50) {
    this.socket.emit("attack", start, end, is50);
};

GeneralsSocket.prototype.clearMoves = function() {
    this.socket.emit("clear_moves");
};

GeneralsSocket.prototype.pingTile = function(index) {
    this.socket.emit("ping_tile", index);
};

GeneralsSocket.prototype.sendChatMessage = function(chat_room, text) {
    this.socket.emit("chat_message", chat_room, text);
};

GeneralsSocket.prototype.leaveGame = function() {
    this.socket.emit("leave_game");
};

GeneralsSocket.prototype.starsAndRank = function(user_id) {
    this.socket.emit("stars_and_rank", user_id);
};

function createDefaultSocketEventHandler(name) {
    return function(data) {
        console.log("SocketEvent "+ name, JSON.stringify(data));
    };
}

GeneralsSocket.prototype.gameStart   = createDefaultSocketEventHandler("game_start");
GeneralsSocket.prototype.gameUpdate  = createDefaultSocketEventHandler("game_update");
GeneralsSocket.prototype.gameLost    = createDefaultSocketEventHandler("game_lost");
GeneralsSocket.prototype.gameWon     = createDefaultSocketEventHandler("game_won");
GeneralsSocket.prototype.receiveChatMessage = createDefaultSocketEventHandler("chat_message");
GeneralsSocket.prototype.stars        = createDefaultSocketEventHandler("stars");
GeneralsSocket.prototype.rank         = createDefaultSocketEventHandler("rank");


module.exports = GeneralsSocket;
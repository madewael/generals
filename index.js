const io = require("socket.io-client");

var socket = io('http://botws.generals.io');

const BOT_CONFIG = {
    user_id: 'botYepke',
    username: '[Bot]Yepke'
};



// Game data.
var playerIndex;
var generals;
var cities = [];
var map = [];

socket.on('disconnect', function () {
    console.error('Disconnected from server.');
    process.exit(1);
});

socket.on('connect', function () {
    console.log('Connected to server.');

    socket.emit('set_username', BOT_CONFIG.user_id, BOT_CONFIG.username);
    var custom_game_id = 'my_private_game44567';
    socket.emit('join_private', custom_game_id, BOT_CONFIG.user_id);
    socket.emit('set_force_start', custom_game_id, true);
    console.log('Joined custom game at http://bot.generals.io/games/' + encodeURIComponent(custom_game_id));
});

socket.on('game_start', function (data) {
    // Get ready to start playing the game.
    playerIndex = data.playerIndex;
    var replay_url = 'http://bot.generals.io/replays/' + encodeURIComponent(data.replay_id);
    console.log('Game starting! The replay will be available after the game at ' + replay_url);
});

/* Returns a new array created by patching the diff into the old array.
 * The diff formatted with alternating matching and mismatching segments:
 * <Number of matching elements>
 * <Number of mismatching elements>
 * <The mismatching elements>
 * ... repeated until the end of diff.
 * Example 1: patching a diff of [1, 1, 3] onto [0, 0] yields [0, 3].
 * Example 2: patching a diff of [0, 1, 2, 1] onto [0, 0] yields [2, 0].
 */
function patch(old, diff) {
    var out = [];
    var i = 0;
    while (i < diff.length) {
        if (diff[i]) {  // matching
            Array.prototype.push.apply(out, old.slice(out.length, out.length + diff[i]));
        }
        i++;
        if (i < diff.length && diff[i]) {  // mismatching
            Array.prototype.push.apply(out, diff.slice(i + 1, i + 1 + diff[i]));
            i += diff[i];
        }
        i++;
    }
    return out;
}

socket.on('game_update', function (data) {

// Patch the city and map diffs into our local variables.
    cities = patch(cities, data.cities_diff);
    map = patch(map, data.map_diff);
    generals = data.generals;
    console.log("LOG",generals);

// The first two terms in |map| are the dimensions.
    var width = map[0];
    var height = map[1];
    var size = width * height;

// The next |size| terms are army values.
// armies[0] is the top-left corner of the map.
    var armies = map.slice(2, size + 2);

// The last |size| terms are terrain values.
// terrain[0] is the top-left corner of the map.
    var terrain = map.slice(size + 2, size + 2 + size);

// Make a random move.
    while (true) {
        // Pick a random tile.
        var index = Math.floor(Math.random() * size);

        // If we own this tile, make a random move starting from it.
        if (terrain[index] === playerIndex) {
            var row = Math.floor(index / width);
            var col = index % width;
            var endIndex = index;

            var rand = Math.random();
            if (rand < 0.25 && col > 0) { // left
                endIndex--;
            } else if (rand < 0.5 && col < width - 1) { // right
                endIndex++;
            } else if (rand < 0.75 && row < height - 1) { // down
                endIndex += width;
            } else if (row > 0) { //up
                endIndex -= width;
            } else {
                continue;
            }

            // Would we be attacking a city? Don't attack cities.
            if (cities.indexOf(endIndex) >= 0) {
                continue;
            }

            socket.emit('attack', index, endIndex);
            break;
        }
    }
});

function leaveGame() {
    socket.emit('leave_game');
}

socket.on('game_lost', leaveGame);

socket.on('game_won', leaveGame);
/**
 * Created by madewael on 11/04/17.
 */

function randomMove(gameData, socket) {
    while (true) {
        // Pick a random tile.
        var index = Math.floor(Math.random() * gameData.size);

        // If we own this tile, make a random move starting from it.
        if (gameData.isOurs(index)) {
            var row = Math.floor(index / gameData.width);
            var col = index % gameData.width;
            var endIndex = index;

            var rand = Math.random();
            if (rand < 0.25 && col > 0) { // left
                endIndex--;
            } else if (rand < 0.5 && col < gameData.width - 1) { // right
                endIndex++;
            } else if (rand < 0.75 && row < gameData.height - 1) { // down
                endIndex += gameData.width;
            } else if (row > 0) { //up
                endIndex -= gameData.width;
            } else {
                continue;
            }

            // Would we be attacking a city? Don't attack cities.
            if (gameData.isCity(endIndex)) {
                continue;
            }


            break;
        }
    }
    socket.attack(index,endIndex,false);
    console.log("attack",index,endIndex);
}

module.exports = {
    randomMove : randomMove
};
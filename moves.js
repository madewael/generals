/**
 * Created by madewael on 11/04/17.
 */

function randomMove(gameData, socket) {
    while (true) {
        // Pick a random tile.
        var index = Math.floor(Math.random() * gameData.size);

        // If we own this tile, make a random move starting from it.
        if (gameData.isOurs(index)) {
            var endIndex = false;

            var rand = Math.random();
            if (rand < 0.25 ) { endIndex = gameData.left(index);
            } else if (rand < 0.5 ) { endIndex = gameData.right(index);
            } else if (rand < 0.75 ) { endIndex = gameData.down(index);
            } else  { endIndex = gameData.up(index);
            }

            // Would we be attacking a city? Don't attack cities.
            if (!endIndex || gameData.isCity(endIndex)) {
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
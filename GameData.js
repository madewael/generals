/**
 * Created by madewael on 11/04/17.
 */
const TerrainConstants = {
    TILE_EMPTY: -1,
    TILE_MOUNTAIN: -2,
    TILE_FOG: -3,
    TILE_FOG_OBSTACLE: -4 // Cities and Mountains show up as Obstacles in the fog of war.
};

function GameData(playerIndex) {
    this.playerIndex = playerIndex;
    this.map = [];
    this.cities = [];
}

GameData.prototype.initMap = function(map) {
    this.map = map;

    this.width = this.map[0];
    this.height = this.map[1];

    this.size = this.width * this.height;

    this.armies = map.slice(2, this.size + 2);
    this.terrain = map.slice(this.size + 2, this.size + 2 + this.size);
};

GameData.prototype.patch = function(generals, map_diff, cities_diff) {
    this.generals = generals;
    this.initMap( patch(this.map, map_diff) );
    this.cities = patch(this.cities, cities_diff);
};

// Indexes and Moves

GameData.prototype.row = function(index) {
    return  Math.floor(index / this.width);
};

GameData.prototype.col = function(index) {
    return  index % this.width;
};

GameData.prototype.left = function(index) {
    return ( this.col(index) > 0) && (index-1);
};

GameData.prototype.right = function(index) {
    return ( this.col(index) < (this.width - 1)) && (index+1);
};

GameData.prototype.up = function(index) {
    return ( this.row(index) > 0) && (index-this.width);
};

GameData.prototype.down = function(index) {
    return ( this.row(index) < (this.height - 1)) && (index+this.width);
};


// Predicates
GameData.prototype.isOurs = function(index) {
    return this.terrain[index] === this.playerIndex;
};

GameData.prototype.isCity = function(index) {
    return this.cities.indexOf(index) >= 0;
};

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

module.exports = GameData;
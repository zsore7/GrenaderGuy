var Game = {};

Game.init = function(){
    game.stage.disableVisibilityChange = true;
};

Game.preload = function(){
    game.load.tilemap('map', 'assets/map/secondTilemap.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.spritesheet('tileset', 'assets/map/simples_pimples.png', 32, 32);
    game.load.image('sprite', 'assets/sprites/sprite.png');
};

var upKey;
var downKey;
var rightKey;
var leftKey;

Game.create = function(){
    Game.playerMap = {};

    // add tilemap to game
    //enable arcade phyics
	game.physics.startSystem(Phaser.Physics.ARCADE);

	upKey = game.input.keyboard.addKey(Phaser.keyboard.UP);
	downKey = game.input.keyboard.addKey(Phaser.keyboard.DOWN);
	rightKey = game.input.keyboard.addKey(Phaser.keyboard.RIGHT);
	leftKey = game.input.keyboard.addKey(Phaser.keyboard.LEFT);

    var map = game.add.tilemap('map');
    // add the tileset ontop of the tilemap
    map.addTilesetImage('opensTileset', 'tileset');

    // set up layers for tilemap
    var backgroundLayer = map.createLayer('backgroundLayer');
    var blockedLayer = map.createLayer('blockedLayer');
    var objectLayer = map.createLayer('objectLayer');

    map.setCollisionBetween(1, 5000, true, blockedLayer);
    map.setCollisionBetween(1, 5000, true, objectLayer);
    console.log(blockedLayer);
    backgroundLayer.inputEnabled = true; // Allows clicking on map
    Client.askNewPlayer();

    backgroundLayer.events.onInputUp.add(Game.getCoordinates, this);
    layer.events.onInputUp.add(Game.getCoordinates, this);
};

Game.update = function () {

}

Game.addNewPlayer = function(id, x, y){ // add a new player to the game map
     // the player in the player map id with
    var sprite = Game.playerMap[id] = game.add.sprite(x, y, 'sprite'); 
    game.physics.arcade.enable(sprite);

    //create new player
    Game.playerMap[id] = game.add.sprite(x, y, 'sprite'); // the player in the player map id with
    // passed id is added to the game with a sprite
};

Game.removePlayer = function(id){
    Game.playerMap[id].destroy();
    delete Game.playerMap[id];
};

Game.getCoordinates = function(layer, pointer){
    console.log("Got an input from client");
    Client.sendClick(pointer.worldX, pointer.worldY);
};

Game.movePlayer = function(id, x, y){
    var player = Game.playerMap[id];
    var distance = Phaser.Math.distance(player.x, player.y, x, y);
    var duration = distance*10;
    var tween = game.add.tween(player);
    tween.to({x:x, y:y}, duration);
    tween.start();
};


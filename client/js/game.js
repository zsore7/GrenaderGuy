var Game = {};

Game.init = function(){
    game.stage.disableVisibilityChange = true;
};

Game.preload = function(){
    // Load everything you will need to do
    game.load.tilemap('map', 'assets/map/secondTilemap.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.spritesheet('tileset', 'assets/map/simples_pimples.png', 16, 16);
    game.load.image('sprite', 'assets/sprites/player-1.png');
    game.load.image('crater-1', 'assets/sprites/crater-1.png');
    game.load.image('red-sprite', 'assets/sprites/player-1.png');
    game.load.image('pink-sprite', 'assets/sprites/player-2.png');
    game.load.image('yellow-sprite', 'assets/sprites/player-4.png');
    game.load.image('blue-sprite', 'assets/sprites/player-5.png');
    game.load.image('green-sprite', 'assets/sprites/player-9.png');
    game.load.image('bomb', 'assets/sprites/bomb.png');
};

Game.create = function(){

    // Set up and start the game
    Game.playerMap = {};

    // add tilemap to game
    //enable arcade phyics
    game.physics.startSystem(Phaser.Physics.ARCADE);

	this.upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
	this.downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
	this.rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    this.leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);

    this.map = game.add.tilemap('map');
    //Game.map = map;
    // add the tileset ontop of the tilemap
    this.map.addTilesetImage('opensTileset', 'tileset');
    this.map.addTilesetImage('crater', 'crater-1');

    // set up layers for tilemap
    this.layer = this.map.createLayer('backgroundLayer');
    this.layer = this.map.createLayer('blockedLayer');
    var objectLayer = this.map.createLayer('objectLayer');
    console.log(objectLayer);

    this.map.setCollision(204, true, this.layer);
    this.map.setCollision(254, true, this.layer);
    this.map.setCollision(4652, true);        
    
    //create player
    console.log(Game.startPlayers);
    var players = Game.startPlayers;
    console.log('my id: ' + Game.myID);
    for (var i = 0; i < Game.startPlayers.length; i++){
        var player = players[i];
        if (player.id == Game.myID){
            console.log('make my player');
            console.log(player);
            Game.addNewPlayer(player.id, player.x, player.y, player.color); 
        } else {
            console.log('make other player');
            console.log(player);
            Game.addOtherPlayer(player.id, player.x, player.y, player.color);
        }
    }

    this.bombs = game.add.group();
    this.items = {};
    game.physics.enable(this.bombs, Phaser.Physics.ARCADE);
    this.bombs.enableBody = true;
    

    //this.layer.inputEnabled = true; // Allows clicking on map

    //this.layer.events.onInputUp.add(Game.getCoordinates, this);

    this.layer.resizeWorld();

    Game.createItems();

    this.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
    this.scale.setUserScale(1.5, 1.5, 0, 0);
};

Game.findObjectsByType = function(type, map, layer){
	var result = new Array();
	console.log(map);
	map.objects.objectLayer.forEach(function(element){
		if(element.type === type){
			element.y -= map.tileHeight;
			result.push(element);
		}
	});
	return result;
}

Game.createFromTiledObject = function(element, group){
	var sprite = group.create(element.x, element.y, 'crater-1');
}

Game.createItems = function(){
	items = game.add.group();
	items.enableBody = true;
	var item;
	result = Game.findObjectsByType('breakable', Game.map, 'objectLayer');
	console.log(result);
	result.forEach(function(element){
		Game.createFromTiledObject(element, items);
	}, Game);
}

Game.update = function () {
    
    moving = true;
    game.physics.arcade.collide(this.player, this.layer);
    //Moving Input
    if (this.leftKey.isDown){
        this.player.body.velocity.x = -100;
        //Client.sendMove("LEFT");
    }
    else if (this.rightKey.isDown){
        this.player.body.velocity.x = 100;
        //Client.sendMove("RIGHT");
    }
    else if (this.upKey.isDown){
        this.player.body.velocity.y = -100;
        //Client.sendMove("UP");
    }
    else if (this.downKey.isDown){
        this.player.body.velocity.y = 100;
        //Client.sendMove("DOWN");
    } else {
       moving = false;
       if (this.player){
            this.player.body.velocity.x = 0;
            this.player.body.velocity.y = 0;
       }
    }
    if (moving){
        Client.sendMove(Game.myID, this.player.x, this.player.y);
    }

    //Bomb input
    if (this.spaceKey.isDown){
        console.log('space pressed');
        console.log(this.bombDelay);
    }
    if (this.spaceKey.isDown && !this.bombDelay){
        console.log('recorded bomb button');
        Client.placeBomb(this.player.x, this.player.y);
        this.bombDelay = true;
        console.log("bombDelay: " + this.bombDelay);
        setTimeout(() => {
            console.log(' called bomb timeout ' );
            this.bombDelay = false;
            console.log(this.bombDelay);
        }, 2000);
    }
}

Game.addNewPlayer = function(id, x, y, color){ // add the main player to the game map
    var sprite = color + '-sprite';
    console.log(sprite);    
    this.player = game.add.sprite(x, y, sprite);
    Game.playerMap[id] = this.player;
    game.physics.enable(this.player);
    this.player.body.collideWorldBounds = true;
    console.log(this.player.body);
    this.player.body.setSize(10, 10, 3, 6);
};

Game.addOtherPlayer = function(id, x, y, color){
    var player = game.add.sprite(x, y, 'sprite');
    Game.playerMap[id] = player;
    game.physics.enable(player);
    player.body.setSize(10, 10, 3, 6);
};


Game.removePlayer = function(id){
    Game.playerMap[id].destroy();
    delete Game.playerMap[id];
};

Game.movePlayer = function(id, x, y){
    var player = Game.playerMap[id];
//    player.x = x;
//    player.y = y;
    var distance = Phaser.Math.distance(player.x, player.y, x, y);
    var duration = distance*8.6;
    var tween = game.add.tween(player);
    tween.to({x:x, y:y}, duration);
    tween.start();
};

Game.placeBomb = function(x, y, id){
    var sprite = 'bomb';
    var newBomb = this.bombs.create(x, y, 'bomb');
    newBomb.id = id;
    console.log('created new bomb - id should be ' + id);
    //console.log(this.bombs.getChildAt(id));
    //this.bombs[id] = game.add.sprite(x, y, sprite);
    //this.bombs.add(new Bomb(x, y, id));
};

Game.explode = function(bomb){
    console.log('explode function');
    console.log(bomb);
    console.log(this.bombs);
    this.bombs.forEach((bombChild)=> {
        if (bombChild.id == bomb.id && bombChild){
            this.bombs.remove(bombChild);
        }
    });
    //var childBomb = this.bombs.getChildAt(bomb.id);
    //this.bombs.remove(childBomb);
    console.log(this.bombs);
}

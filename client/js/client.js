var Client = {};
Client.socket = io.connect();

Client.askNewPlayer = function(){
    Client.socket.emit('newplayer');
};

Client.socket.on('newplayer', function(data) { // upon getting newplayer message from server, add that player to the Game object.
    Game.addNewPlayer(data.id, data.x, data.y);
});

Client.socket.on('allplayers', function(data){ //upon getting allplayers message, add all players to Game object
    console.log(data);
    for (var i = 0; i < data.length; i++){
        Game.addNewPlayer(data[i].id, data[i].x, data[i].y);
    }
});

Client.socket.on('remove', function(id){
    Game.removePlayer(id);
});

//Mouse-click movement
Client.sendClick = function(x, y){
    Client.socket.emit('click', {x:x, y:y});
};
Client.socket.on('move', function(data) {
	Game.movePlayer(data.id, data.x, data.y);
});


///////ADDED BY WILL FOR MOVEMENT///////////////
Client.sendRight = function (x, y) {
    Client.socket.emit('right', {x:x, y:y});
};
Client.sendLeft = function (x, y) {
	Client.socket.emit('left', {x:x, y:y});
};
Client.sendUp = function (x, y) {
	Client.socket.emit('up', {x:x, y:y});
};
Client.sendDown = function (x, y) {
	Client.socket.emit('down', {x:x, y:y});
};

Client.socket.on('move_direction', function (data) {
    Game.movePlayer(data.id, data.x, data.y);
});
///////END: ADDED BY WILL FOR MOVEMENT///////////////

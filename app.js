var mongodb = require("mongodb");
var MongoClient = mongodb.MongoClient;
var ObjectID = mongodb.ObjectID;
var client = new MongoClient("mongodb://localhost:27017", { useNewUrlParser: true, useUnifiedTopology: true });
var db;

var startTime = Date.now();

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

var http = require("http");
var server = http.Server(app);
var socketio = require("socket.io");
var io = socketio(server);

module.exports = app;

var numClients = 0;
//sockets
var player1; 
var player2;
//ship placements
var officialPlayer1;  
var officialPlayer2;

var player1Tag;
var player2Tag;
//guesses
var p1Guess = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];
var p2Guess = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];
var playerReady = 0;
var playerTurn = 0; // 0 is p1, 1 is p2
var p1sunk = 0;
var p2sunk = 0;
var isHit;
//hit ships
var p1ships ={
    carrier: {
        coord1: null,
        coord2: null,
        coord3: null,
        coord4: null,
        coord5: null
    },
    battleship: {
        coord1: null,
        coord2: null,
        coord3: null,
        coord4: null
    },
    cruiser: {
        coord1: null,
        coord2: null,
        coord3: null
    },
    submarine: {
        coord1: null,
        coord2: null,
        coord3: null
    },
    destroyer: {
        coord1: null,
        coord2: null
    }
}
var p2ships ={
    carrier: {
        coord1: null,
        coord2: null,
        coord3: null,
        coord4: null,
        coord5: null
    },
    battleship: {
        coord1: null,
        coord2: null,
        coord3: null,
        coord4: null
    },
    cruiser: {
        coord1: null,
        coord2: null,
        coord3: null
    },
    submarine: {
        coord1: null,
        coord2: null,
        coord3: null
    },
    destroyer: {
        coord1: null,
        coord2: null
    }
}
function p1hit(r, c){
    console.log("hit!");
    if(officialPlayer2[r][c] == "2"){
        if(!p1ships.destroyer.coord1){
            p1ships.destroyer.coord1 = [r, c];
        }
        else{
            p1ships.destroyer.coord2 = [r, c];
            sunk(2, p1ships.destroyer, player1);
        }
    }
    else if(officialPlayer2[r][c] == "3B"){
        if(!p1ships.submarine.coord1){
            p1ships.submarine.coord1 = [r, c];
        }
        else if(!p1ships.submarine.coord2){
            p1ships.submarine.coord2 = [r, c];
        }
        else{
            p1ships.submarine.coord3 = [r, c];
            sunk(3, p1ships.submarine, player1);
        }
    }
    else if(officialPlayer2[r][c] == "3A"){
        if(!p1ships.cruiser.coord1){
            p1ships.cruiser.coord1 = [r, c];
        }
        else if(!p1ships.cruiser.coord2){
            p1ships.cruiser.coord2 = [r, c];
        }
        else{
            p1ships.cruiser.coord3 = [r, c];
            sunk(3, p1ships.cruiser, player1);
        }
    }
    else if(officialPlayer2[r][c] == "4"){
        if(!p1ships.battleship.coord1){
            p1ships.battleship.coord1 = [r, c];
        }
        else if(!p1ships.battleship.coord2){
            p1ships.battleship.coord2 = [r, c];
        }
        else if(!p1ships.battleship.coord3){
            p1ships.battleship.coord3 = [r, c];
        }
        else{
            p1ships.battleship.coord4 = [r, c];
            sunk(4, p1ships.battleship, player1);
        }
    }
    else{
        if(!p1ships.carrier.coord1){
            p1ships.carrier.coord1 = [r, c];
        }
        else if(!p1ships.carrier.coord2){
            p1ships.carrier.coord2 = [r, c];
        }
        else if(!p1ships.carrier.coord3){
            p1ships.carrier.coord3 = [r, c];
        }
        else if(!p1ships.carrier.coord4){
            p1ships.carrier.coord4 = [r, c];
        }
        else{
            p1ships.carrier.coord5 = [r, c];
            sunk(5, p1ships.carrier, player1);
        }
    }
}
function p2hit(r, c){
    console.log("hit!");
    if(officialPlayer1[r][c] == "2"){
        if(!p2ships.destroyer.coord1){
            p2ships.destroyer.coord1 = [r, c];
        }
        else{
            p2ships.destroyer.coord2 = [r, c];
            sunk(2, p2ships.destroyer, player2);
        }
    }
    else if(officialPlayer1[r][c] == "3B"){
        if(!p2ships.submarine.coord1){
            p2ships.submarine.coord1 = [r, c];
        }
        else if(!p2ships.submarine.coord2){
            p2ships.submarine.coord2 = [r, c];
        }
        else{
            p2ships.submarine.coord3 = [r, c];
            sunk(3, p2ships.submarine, player2);
        }
    }
    else if(officialPlayer1[r][c] == "3A"){
        if(!p2ships.cruiser.coord1){
            p2ships.cruiser.coord1 = [r, c];
        }
        else if(!p2ships.cruiser.coord2){
            p2ships.cruiser.coord2 = [r, c];
        }
        else{
            p2ships.cruiser.coord3 = [r, c];
            sunk(3, p2ships.cruiser, player2);
        }
    }
    else if(officialPlayer1[r][c] == "4"){
        if(!p2ships.battleship.coord1){
            p2ships.battleship.coord1 = [r, c];
        }
        else if(!p2ships.battleship.coord2){
            p2ships.battleship.coord2 = [r, c];
        }
        else if(!p2ships.battleship.coord3){
            p2ships.battleship.coord3 = [r, c];
        }
        else{
            p2ships.battleship.coord4 = [r, c];
            sunk(4, p2ships.battleship, player2);
        }
    }
    else{
        if(!p2ships.carrier.coord1){
            p2ships.carrier.coord1 = [r, c];
        }
        else if(!p2ships.carrier.coord2){
            p2ships.carrier.coord2 = [r, c];
        }
        else if(!p2ships.carrier.coord3){
            p2ships.carrier.coord3 = [r, c];
        }
        else if(!p2ships.carrier.coord4){
            p2ships.carrier.coord4 = [r, c];
        }
        else{
            p2ships.carrier.coord5 = [r, c];
            sunk(5, p2ships.carrier, player2);
        }
    }
}

function sunk(size, ship, player){
    console.log("sunk!");
    if(player == player1){
        for(var i = 0; i < size; i++){
            var coord = (Object.values(ship)[i]);
            p1Guess[coord[0]].splice(coord[1], 1, 3); // 3 = sunk;
        }
        p1sunk++;
        //console.log(p1ships.ship);
        //player1.emit('youSunk', ship.name)
    }else{
        for(var i = 0; i < size; i++){
            var coord = (Object.values(ship)[i]);
            p2Guess[coord[0]].splice(coord[1], 1, 3); // 3 = sunk;
        }
        p2sunk++;
    }
}


function player1guess(r,c){
    if(p1Guess[r][c] == 0){ // no need to update things already guessed
        if(officialPlayer2[r][c] == " "){
            p1Guess[r][c] = 2; //miss
            isHit = 0;
        }
        else{
            p1Guess[r][c] = 1; //hit
            p1hit(r,c); //adds coords to ship object
            isHit = 1;
        }
    }
}
function player2guess(r,c){
    if(p2Guess[r][c] == 0){ // no need to update things already guessed
        if(officialPlayer1[r][c] == " "){ //if theres nothing in p1 
            p2Guess[r][c] = 2; //miss
            isHit = 0;
        }
        else{
            p2Guess[r][c] = 1; //hit
            p2hit(r,c); //adds coords to ship object
            isHit = 1;
        }
    }
}

function checkDocuments(documents){
    if(documents[0]){
        return true;
    }
    return false;
}

function validateUser(documents, password){
    if(documents[0].password == password){
        console.log("Password was correct.");
        return true;
    }else{
        return false;
    }
}

function validateInput(data, socket){
    if(data.tag == "" || data.password == ""){
        console.log("Invalid. Empty string.");
    }else{
        db.collection("leaderboard").find({"tag": data.tag}).toArray(function(error, documents){
            if (error != null) {
                console.log(error);
            }else{
                if(!checkDocuments(documents)){
                    console.log("Creating new player");
                    var newUser = {tag: data.tag, password: data.password, wins: 0}
                    db.collection("leaderboard").insertOne(newUser);
                    sendLeaderboard();
                    connect(socket, data.tag);
                }else{
                    if(validateUser(documents, data.password)){
                        connect(socket, data.tag);
                    }else{
                        console.log("Wrong password");
                    }
                    console.log("Checking password");
                }
            }
        }
    )}
}

function sendLeaderboard(){
    console.log("Sending");
    db.collection("leaderboard").find({}).toArray(function(error, documents){
        if (error != null) {
			console.log(error);
		}else{
            console.log(documents);
            io.emit("displayLeaderboard", documents);
        }
    });
}

function connect(socket, tag){
    if (numClients == 0){
        player1 = socket;
        player1Tag = tag;
        console.log(player1Tag);
        player1.emit('created'); //First player created game.
        numClients++;
    }
    else if(numClients == 1){
        player2 = socket;
        player2Tag = tag;
        console.log(player2Tag);
        player1.emit('join'); // First player joined game.
        player2.emit('joined'); // 2nd joined
        numClients++;
    }
    else{
        socket.emit('wait'); 
    }
}

function updateWin(winner){
    console.log(winner);
    var numWins;
    db.collection("leaderboard").find({"tag": winner}).toArray(function(error, documents){
        if(error != null){
            console.log(error);
        }else{
            numWins = documents[0].wins + 1;
            db.collection("leaderboard").updateOne({tag: winner}, {$set: {wins: numWins}});
            sendLeaderboard();
        }
    });
}

io.on("connection", function(socket){
    sendLeaderboard();
    socket.emit('login');
    console.log("Someone connected!");
    socket.on('loggedin', function(data){
        console.log(data.tag);          //FIRST NEED TO VALIDATE DATA BEFORE ASSIGNING P1 and P2
        console.log(data.password);
        validateInput(data, socket);
            //db.collection("leaderboard").insertOne(data); //THIS ADDS A USER TO THE LEADERBOARD COLLECTION
            //sendLeaderboard(socket);
            
    });

    socket.on("getTimeStamp", function(callback){
        callback(startTime);
    });

    socket.on("disconnect", function() {
        console.log("Player disconnected.");
		if((player1 != null && socket.id == player1.id) || (player2 != null && socket.id == player2.id )){
			numClients = 0;
			io.emit('clientDisconnect'); 
			console.log("Player disconnected.");
			player1 = null; 
            player2 = null;
            //ship placements
            officialPlayer1 = null;  
            officialPlayer2 = null;

            player1Tag = null;
            player2Tag = null;
            //guesses
            p1Guess = [
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            ];
            p2Guess = [
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            ];
            playerReady = 0;
            playerTurn = 0; // 0 is p1, 1 is p2
            p1sunk = 0;
            p2sunk = 0;
            isHit;
            //hit ships
            p1ships ={
                carrier: {
                    coord1: null,
                    coord2: null,
                    coord3: null,
                    coord4: null,
                    coord5: null
                },
                battleship: {
                    coord1: null,
                    coord2: null,
                    coord3: null,
                    coord4: null
                },
                cruiser: {
                    coord1: null,
                    coord2: null,
                    coord3: null
                },
                submarine: {
                    coord1: null,
                    coord2: null,
                    coord3: null
                },
                destroyer: {
                    coord1: null,
                    coord2: null
                }
            }
            p2ships ={
                carrier: {
                    coord1: null,
                    coord2: null,
                    coord3: null,
                    coord4: null,
                    coord5: null
                },
                battleship: {
                    coord1: null,
                    coord2: null,
                    coord3: null,
                    coord4: null
                },
                cruiser: {
                    coord1: null,
                    coord2: null,
                    coord3: null
                },
                submarine: {
                    coord1: null,
                    coord2: null,
                    coord3: null
                },
                destroyer: {
                    coord1: null,
                    coord2: null
                }
            }
		}
		else{
			console.log("someone disconnected.");
        }
    });
    socket.on('newGuess', function(data){
        if(playerTurn){
            if(socket == player2){
                player2guess(data.row, data.col);
                var guess = p2Guess;
                player1.emit('otherGuess', {guess, isHit});
                player2.emit('myGuess', {guess, isHit});
                if(p2sunk == 5){ //check win
                    console.log("P2 win");
                    updateWin(player2Tag);
                    player1.emit('lose');
                    player2.emit('win');
                }else{
                    player1.emit('yourTurn');
                    player2.emit('notTurn');
                    playerTurn = 0;
                } 
            }
        }else{
            if(socket == player1){
                player1guess(data.row, data.col);
                var guess = p1Guess;
                player2.emit('otherGuess', {guess, isHit});
                player1.emit('myGuess', {guess, isHit});
                if(p1sunk == 5){ //check win
                    console.log("P1 win");
                    updateWin(player1Tag);
                    player1.emit('win');
                    player2.emit('lose');
                }else{
                    player2.emit('yourTurn');
                    player1.emit('notTurn');
                    playerTurn = 1;
                }
            }
        }
    });
    socket.on('updateShips', function(data){
        if(socket == player1){
            officialPlayer1 = data;
            playerReady++;
        }
        else if(socket == player2){
            officialPlayer2 = data;
            playerReady++;
        }
        if(playerReady == 2){
            io.emit('ready'); //say we are ready for guessing!
            player1.emit('yourTurn');
            player2.emit('notTurn');
        }
    });
});

//Try to connect to MongoDB
client.connect(function(err) {
	if (err != null) throw err; //No DB connection?  Then let our server crash with an error.
	else {
		db = client.db("Battleship"); //Get our specific database

		//Start listening for client connections
		server.listen(80, function() {
			console.log("Server with socket.io is ready.");
		});
	}
});

/*server.listen(80, function() {
    console.log("Server is waiting on port 80")
});*/
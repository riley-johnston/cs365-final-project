/*var mongodb = require("mongodb");
var MongoClient = mongodb.MongoClient;
var ObjectID = mongodb.ObjectID;
var client = new MongoClient("mongodb://localhost:27017", { useNewUrlParser: true, useUnifiedTopology: true });
var db;*/

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
var player1;
var player2;
var officialPlayer1;
var officialPlayer2;
var p1Guess;
var p2Guess;
var playerReady = 0;


function player1guess(p1guesses){
    for(var i = 0; i < 10; i++){
        for(var j = 0; j < 10; j++){
            if(p1guesses[i][j] != 0){ // no need to update things already guessed
                if(officialPlayer1[i][j] == " "){
                    p1guesses[i][j] = 2; //miss
                }
                else{
                    p1guesses[i][j] = 1; //hit
                }
            }
        }
    }
    console.log(p1guesses);
    return p1guesses;
}
function player2guess(p2guesses){
    for(var i = 0; i < 10; i++){
        for(var j = 0; j < 10; j++){
            if(p2guesses[i][j] != 0){ // no need to update things already guessed
                if(officialPlayer2[i][j] == " "){
                    p2guesses[i][j] = 2; //miss
                }
                else{
                    p2guesses[i][j] = 1; //hit
                }
            }
        }
    }
    console.log(p2guesses);
    return p2guesses;
}

/* ALL OF THE FOLLOWING IS NOT COMPLETED YET.
function sendLeaderboardToClient(theSocket){
    db.collection("players").find({}, {sort: [['wins', -1], ['standing', 1]]}).toArray(function(error, documents){
        if(error != null){
            console.log(error);
        }
        else if(theSocket == null){
            io.emit("setLeaderboard", documents);
        }
        else{
            theSocket.emit("setLeaderboard", documents);
        }
    });
}

function updateClientIfNoError(error, result){
    if(error != null){
        console.log(error);
    }
    else{
        sendLeaderboardToClient(null);
    }
}*/

io.on("connection", function(socket){
    console.log("Someone connected!");

    if (numClients == 0){
        player1 = socket;
        player1.emit('created'); //First player created game.
        numClients++;
    }
    else if(numClients == 1){
        player2 = socket;
        player1.emit('join'); // First player joined game.
        player2.emit('joined'); // 2nd joined
        numClients++;
    }
    else{
        //socket.emit('');
    }
    socket.on("disconnect", function() {
		if((player1 != null && socket.id == player1.id) || (player2 != null && socket.id == player2.id )){
			numClients = 0;
			io.emit('clientDisconnect'); 
			console.log("Player disconnected.");
			player1 = null;
			player2 = null;
		}
		else{
			console.log("someone disconnected.");
        }
    });

    socket.on('newGuess', function(data){
        //update this players guess grid 
        if(socket == player1){
            p1Guess = player1guess(data);
            console.log("player 1 guessed");
            player2.emit('updateDisplay', p1Guess);
        }
        else if(socket == player2){
            p2Guess = player2guess(data);
            console.log("player 2 guessed");
            console.log(p2Guess);
            player1.emit('updateDisplay', p2Guess);
        }
        else{
            console.log("whos playing");
        }
    });
    
    socket.on('updateShips', function(data){
        if(socket == player1){
            console.log("player 1 is ready");
            officialPlayer1 = data;
            console.log(officialPlayer1);
            playerReady++;
        }
        else if(socket == player2){
            console.log("player 2 is ready");
            officialPlayer2 = data;
            console.log(officialPlayer2);
            playerReady++;
        }
        else{
            console.log("whos playing");
        }
        if(playerReady == 2){
            io.emit('ready'); //say we are ready for guessing!
        }
    });
});


server.listen(80, function() {
    console.log("Server is waiting on port 80");
});

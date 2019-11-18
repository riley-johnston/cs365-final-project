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
var playerTurn = 0; // 0 is p1, 1 is p2


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
        socket.emit('wait');
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
        if(playerTurn){
            if(socket == player2){
                p2Guess = player2guess(data);
                console.log("player 2 guessed");
                console.log(p2Guess);
                player1.emit('updateDisplay', p2Guess);
                //p1 turn now
                player1.emit('yourTurn');
                player2.emit('notTurn');
                playerTurn = 0;
            }else{
                //p1 guessed on not their turn :(
            }
        }else{
            if(socket == player1){
                p1Guess = player1guess(data);
                console.log("player 1 guessed");
                player2.emit('updateDisplay', p1Guess);
                //p2 turn now
                player2.emit('yourTurn');
                player1.emit('notTurn');
                playerTurn = 1;
            }
            else if(socket == player2){
                //not their turn :(
            }
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
            player1.emit('yourTurn');
            player2.emit('notTurn');
        }
    });
});


server.listen(80, function() {
    console.log("Server is waiting on port 80");
});

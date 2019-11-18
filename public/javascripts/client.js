var socket = io();
//
//import { Socket } from "dgram";

var v = new Vue({
    el: '#app',
    data:{
        numPlayers: 0,
        color: "water",
        myGuess: [
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
        ],
        otherGuess: [
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
        ],
        myShips: [
            [" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
            [" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
            [" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
            [" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
            [" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
            [" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
            [" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
            [" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
            [" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
            [" ", " ", " ", " ", " ", " ", " ", " ", " ", " "]
        ]
    },
    methods: {
        changeResult(row, col){
            if(this.myGuess[row][col] == 0){
                if(this.myShips[row][col] != " "){
                        /*The ship has not been sunk, but has been hit*/
                        this.myGuess[row].splice(col, 1, 1); //hit
                } else {
                        /*There is no ship there*/
                    this.myGuess[row].splice(col, 1, 2); //miss
                }
            }
            //emit a new guess here
            socket.emit('newGuess', this.myGuess);
        },
        forfeit(){
            
        },
        randomPlacement(){
            for(var i = 0; i < 5; i++){
                this.myShips[i].splice(2, 1, "5"); //place carrier
            }
            for(var i = 6; i < 9; i++){
                this.myShips[5].splice(i, 1, "3"); //place cruiser
            }
            for(var i = 6; i < 10; i++){
                this.myShips[9].splice(i, 1, "4"); //place battleship
            }
            for(var i = 3; i < 6; i++){
                this.myShips[i].splice(9, 1, "3"); //place submarine
            }
            for(var i = 0; i < 2; i++){
                this.myShips[6].splice(i, 1, "2"); //place destroyer
            }
        },
        styleFor(typeOfSquare) {
            if(typeOfSquare == 0){
                return "water";
            }
            else if(typeOfSquare == 1){
                return "hit";
            }
            else if(typeOfSquare == 2){
                return "miss";
            }
            else if(typeOfSquare == 3){
                return "sunk";
            }
            else{
                return " ";
            }
        }
    }
});

socket.on('updateDisplay', function(data){
    for(let i = 0; i< 10; i++){
        for(let j = 0; j< 10; j++){
            v.otherGuess[i].splice(j, 1, data[i][j]); 
        }
    }
});

socket.on('created', function(data){
    console.log('Game is created');
    //player 1 created a game
});

socket.on('join', function(data){
    console.log('p1 joined');
    //player 1 joined game
});

socket.on('joined', function(data){
    console.log('p2 joined');
    //p2 join
});

socket.on("clientDisconnect", function(dataFromServer) {
   //player disconnects
});

socket.on("ready", function(dataFromServer) {
    //players are ready and can start guessing 
    //display guesses board
    $("#table1").css("display", "block");
 });

 socket.on("setLeaderboard", function(leaderboard){
     //Add a player to the leaderboard.
     $("#theLeaderboard").html("");
     for(let player of leaderboard){
         var tdUsername = $("<td></td>").text(player.username);
         var tdWins = $("<td></td>").text(player.wins);
         var tdLoss = $("<td></td>").text(player.losses);

         var tr = $("<tr></tr>")
            .append(tdUsername)
            .append(tdWins)
            .append(tdLoss);

        $("#theLeaderboard").append(tr);
     }

     console.log(leaderboard);
 });

$("#login").click(function(){
    //When a player clicks the login function
    //create a player collection and set 
    //username, wins, and losses.
    var player = {};
    player.username = $("username").val();
    player.wins = 0;
    player.losses = 0;

    socket.emit("login", player);

    $("#username").val("");
})

$("#ready").click(function(){
    socket.emit("updateShips", v.myShips);
    $("#random").css("visibility", "hidden");
});

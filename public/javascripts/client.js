var socket = io();
//THIS GETS THE PAGE TO RELOAD IF SERVER CRASHES/IS TAKEN DOWN
var serverStamp = null;
socket.on("connect", function(){ 
    socket.emit("getTimeStamp", function(stamp){
        if(serverStamp == null){
            serverStamp = stamp;
        }
        else if(serverStamp != stamp){
            location.reload(true);
        }
    })
});

var v = new Vue({
    el: '#app',
    data:{
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
        ],
        layout: 0
    },
    methods: {
        changeResult(row, col){ 
            socket.emit('newGuess', {row, col});
        },
        checkStatus(){
            
        },
        forfeit(){
            
        },
        clearShips(){ //clears board when deciding ship placement
            for(var i = 0; i < 10; i++){
                for(var j = 0; j < 10; j++){
                    this.myShips[i].splice(j, 1, " "); 
                }
            }
        },
        randomPlacement(){ //cycles through ship placements
            this.clearShips();
            if(this.layout < 1){ 
                this.layout++;
            }
            else{ 
                this.layout = 0; 
            }
            if(this.layout == 0){
                for(var i = 0; i < 5; i++){
                    this.myShips[i].splice(2, 1, "5"); //place carrier
                }
               for(var i = 6; i < 9; i++){
                    this.myShips[5].splice(i, 1, "3A"); //place cruiser
                }
                for(var i = 6; i < 10; i++){
                    this.myShips[9].splice(i, 1, "4"); //place battleship
                }
                for(var i = 3; i < 6; i++){
                    this.myShips[i].splice(9, 1, "3B"); //place submarine
                }
                for(var i = 0; i < 2; i++){
                    this.myShips[6].splice(i, 1, "2"); //place destroyer
                }
            }else if(this.layout == 1){
                for(var i = 1; i < 6; i++){
                    this.myShips[2].splice(i, 1, "5"); //place carrier
                }
               for(var i = 1; i < 4; i++){
                    this.myShips[0].splice(i, 1, "3A"); //place cruiser
                }
                for(var i = 5; i < 9; i++){
                    this.myShips[i].splice(4, 1, "4"); //place battleship
                }
                for(var i = 3; i < 6; i++){
                    this.myShips[i].splice(8, 1, "3B"); //place submarine
                }
                for(var i = 4; i < 6; i++){
                    this.myShips[i].splice(2, 1, "2"); //place destroyer
                }
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
socket.on('win', function(data){
    $("h3").text("You win!");
    $("#tagForm").css("display", "block");
    $("#table1").css("pointer-events" ,"none");
    //textbox for initials + enter button => go to leaderboard
    //wins ++
});
socket.on('lose', function(data){
    $("h3").text("You lose :(");
    $("#tagForm").css("display", "block");
    $("#table1").css("pointer-events" ,"none");
    //textbox for initials + enter button => go to leaderboard
    //wins + 0
});
//updates the guess grid displayed under your ships
socket.on('otherGuess', function(data){
    for(let i = 0; i< 10; i++){
        for(let j = 0; j< 10; j++){
            v.otherGuess[i].splice(j, 1, data[i][j]); 
        }
    }
});
//updates the guess grid displayed on your playable grid
socket.on('myGuess', function(data){
    for(let i = 0; i< 10; i++){
        for(let j = 0; j< 10; j++){
            v.myGuess[i].splice(j, 1, data[i][j]); 
        }
    }
});
socket.on('created', function(data){
    $("h3").text("Waiting for player 2.");
    console.log('Game is created');
});
socket.on('join', function(data){
    $("h3").text("Hello player 1!");
    console.log('p1 joined');
});
socket.on('joined', function(data){
    $("h3").text("Hello player 2!");
    console.log('p2 joined');
});
socket.on("clientDisconnect", function(dataFromServer) {
   //player disconnects
});
socket.on("ready", function(dataFromServer) {
    //how to get players to take turns?
    $("h3").text("Ready to play!");
    $("#table1").css("display", "block");
 });
 socket.on("yourTurn", function(data){
    $("h3").text("Your turn!");
    $("#table1").css("pointer-events" ,"auto"); //makes table clickable
 });
 socket.on("notTurn", function(data){
    $("h3").text("Wait for your turn!");
    $("#table1").css("pointer-events" ,"none"); //make table unclickable
 })
 socket.on("wait", function(dataFromServer) {
    $("h3").text("Game is full.");
    $("#myTable5").css("visibility", "hidden");
    $("#table2").css("display", "none");
 });
 
 /*socket.on("setLeaderboard", function(leaderboard){
     //Add a player to the leaderboard.
     //Copied from notes.
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
 
 $("#submit").click(function() {
     //I THINK WE NEED DATA FROM SERVER TO KNOW WHETHER
     //OR NOT THE PLAYER HAS WON OR LOST.
     //After a player wins or loses, prompt them
     //for a 3 character username and add it to 
     //the leaderboard with their score.
     //Copied from notes.
     var player = {};
     player.username = $("#username").val();
     player.wins += 1;
     player.loss = 0;
     
     socket.emit("submit", player);
     
     $("#username").val("");
 });*/

$("#ready").click(function(){
    socket.emit("updateShips", v.myShips);
    $("#random").css("visibility", "hidden");
});

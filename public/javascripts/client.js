/*
  Riley Johnston
  Anna D'Amico
  Friday November 29th 2019
*/
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

//SOUND STUFF
var audio; // so we can play/pause on audio element
var sound = 0; //so we know if audio was played to then pause audio
var audioPlay;
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
        changeResult(row, col){  //sending our guess to the server
            socket.emit('newGuess', {row, col});
        },
        forfeit(){
            socket.emit('forfeit');
        },
        clearShips(){ //clears board when deciding ship placement
            for(var i = 0; i < 10; i++){
                for(var j = 0; j < 10; j++){
                    this.myShips[i].splice(j, 1, " "); 
                }
            }
        },
        randomPlacement(){ //cycles through ship placements
            $("#ready").css("visibility", "visible");
            this.clearShips();
            if(this.layout < 2){ 
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
            }else if(this.layout == 2){
                for(var i = 3; i < 8; i++){
                    this.myShips[7].splice(i, 1, "5"); //place carrier
                }
               for(var i = 0; i < 3; i++){
                    this.myShips[i].splice(1, 1, "3A"); //place cruiser
                }
                for(var i = 3; i < 7; i++){
                    this.myShips[i].splice(5, 1, "4"); //place battleship
                }
                for(var i = 5; i < 8; i++){
                    this.myShips[9].splice(i, 1, "3B"); //place submarine
                }
                for(var i = 0; i < 2; i++){
                    this.myShips[i].splice(8, 1, "2"); //place destroyer
                }
            }
        },
        styleFor(typeOfSquare) {    //iterates through the types of squares so we can later set the css
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

$("#forfeit").click(function(){
    $("h3").text("Are you sure you want to forfeit?");
    $("#confirm").css("display", "block");
})
$("#guest").click(function(){   //When the player clicks play as guest, set username and password to guest
    socket.emit('loggedin', {tag: "guest", password: "guest"});
});

$("#play").click(function(){    //When the player clicks play, grab the username and password and 
    var tag = $("#tag").val();  //emit to the server that someone has logged in
    $("#tag").val("");
    var password = $("#password").val();
    $("#password").val("");
    socket.emit('loggedin', {tag: tag, password: password});
});

$("#continue").click(function(){    //When a player clicks continue to leaderboard, reload everything
    location.reload(true);          //to the login page
});

socket.on('login', function(data){      //Display login format, hide app
    $("#login").css("display", "block");
    $("#app").css("display", "none");
    $("#leaderboard").css("display", "block"); //display leaderboard when logging in
});
socket.on('win', function(data){        //When someone wins, show the continue to leaderboard button
    $("h3").text("You win!");           //and disable clicking on the tables.
    $("#table1").css("pointer-events" ,"none");
    $("#continue").css("display", "block");
});
socket.on('lose', function(data){       //When someone loses, show the continue to leaderboard button
    $("h3").text("You lose :(");        //and disable clicking on the tables.
    $("#table1").css("pointer-events" ,"none");
    $("#continue").css("display", "block");
});
//updates the guess grid displayed under your ships
socket.on('otherGuess', function(data){
    for(let i = 0; i< 10; i++){
        for(let j = 0; j< 10; j++){
            v.otherGuess[i].splice(j, 1, data.guess[i][j]); 
        }
    }
    playSound(data.isHit);
});
//updates the guess grid displayed on your playable grid
socket.on('myGuess', function(data){
    for(let i = 0; i< 10; i++){
        for(let j = 0; j< 10; j++){
            v.myGuess[i].splice(j, 1, data.guess[i][j]); 
        }
    }
    playSound(data.isHit);
});
socket.on('created', function(data){        //Sends proper data/displays proper things when a game is created
    $("h3").text("Waiting for player 2.");
    $("#login").css("display", "none");
    $("#leaderboard").css("display", "none");
});
socket.on('join', function(data){       //sends proper data/displays proper things when player 1 joins
    $("h3").text("Hello player 1!");
    $("#app").css("display", "block");
});
socket.on('joined', function(data){     //sends proper data/displays proper things when player 2 joins
    $("h3").text("Hello player 2!");
    $("#app").css("display", "block");
    $("#login").css("display", "none");
    $("#leaderboard").css("display", "none");
});
socket.on("clientDisconnect", function(dataFromServer) {
    //reset all grids when someone disconnects from the server.
    v.myGuess = [
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
    v.otherGuess = [
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
    v.myShips = [
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
    ];
    v.layout = 0;
    location.reload(true);
});
socket.on("ready", function(dataFromServer) {   //When someone clicks ready to play
    $("h3").text("Ready to play!");
    $("#table1").css("display", "block");
    $("#forfeit").css("visibility", "visible");
 });
 socket.on("yourTurn", function(data){
    $("h3").text("Your turn!");
    $("#table1").css("pointer-events" ,"auto"); //makes table clickable
 });
 socket.on("notTurn", function(data){
    $("h3").text("Wait for your turn!");
    $("#table1").css("pointer-events" ,"none"); //make table unclickable
 })
 socket.on("wait", function(dataFromServer) {   //If more than one person loggs in, don't display anything
    $("h3").text("Game is full.");              //and wait until a slot opens up
    $("#myTable5").css("visibility", "hidden");
    $("#table2").css("display", "none");
 });

$("#ready").click(function(){           //When a user clicks ready to play, disable ship placement and 
    socket.emit("updateShips", v.myShips); //send the final ship placement to the server.
    $("#random").css("visibility", "hidden");
});

function playSound(playHit){
    audio = document.createElement('audio');
    if(playHit){
        audio.setAttribute("src", "sounds\\hit.wav");
    }else{
        audio.setAttribute("src", "sounds\\miss.wav");
    }
    playPromise = audio.play();
    if (playPromise !== undefined) {
        playPromise.then(_ => {
            sound = 1;
        })
        .catch(error => {
            sound = 0;
          console.log("error playing audio")
        });
    }
}
function stopSound(){
    if(sound == 1){
        audio.pause();
        audio.currentTime = 0;
    }
}

socket.on("displayLeaderboard", function(list){     //Displaying the leaderboard in a table format
    $("#theLeaderBoard").html("");
    for(let user of list){
        var username = $("<td></td>").text(user.tag);
        var wins = $("<td></td>").text(user.wins);

        var tr = $("<tr></tr>")
           .append(username)
           .append(wins);

       $("#theLeaderBoard").append(tr);
    }
});
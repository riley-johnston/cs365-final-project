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
            $("#ready").css("visibility", "visible");
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

$("#guest").click(function(){
    console.log("play as guest!");
    socket.emit('logged', {tag: "guest", password: "guest"});
});

$("#play").click(function(){
    console.log("play!");
    var tag = $("#tag").val();
    $("#tag").val("");
    var password = $("#password").val();
    $("#password").val("");
    socket.emit('loggedin', {tag: tag, password: password});
});
socket.on('login', function(data){
    $("#login").css("display", "block");
    $("#app").css("display", "none");
    //$("#leaderboard").css("display", "block"); display leaderboard when logging in
});
socket.on('win', function(data){
    $("h3").text("You win!");
    $("#table1").css("pointer-events" ,"none");
    $("#continue").css("display", "block");
    //button to say continue to leaderboard?
    //emit a win!
    //wins ++
});
socket.on('lose', function(data){
    $("h3").text("You lose :(");
    $("#table1").css("pointer-events" ,"none");
    $("#continue").css("display", "block");
    //button to say continue to leaderboard?
    //emit a lose
    //wins + 0
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
    console.log(data);
    for(let i = 0; i< 10; i++){
        for(let j = 0; j< 10; j++){
            v.myGuess[i].splice(j, 1, data.guess[i][j]); 
        }
    }
    playSound(data.isHit);
});
socket.on('created', function(data){
    $("h3").text("Waiting for player 2.");
    $("#login").css("display", "none");
    console.log('Game is created');
});
socket.on('join', function(data){
    $("h3").text("Hello player 1!");
    $("#app").css("display", "block");
    console.log('p1 joined');
});
socket.on('joined', function(data){
    $("h3").text("Hello player 2!");
    $("#app").css("display", "block");
    $("#login").css("display", "none");
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

$("#ready").click(function(){
    socket.emit("updateShips", v.myShips);
    $("#random").css("visibility", "hidden");
});

function playSound(playHit){
    audio = document.createElement('audio');
    if(playHit){
        console.log("hit sound");
        audio.setAttribute("src", "sounds\\hit.wav");
    }else{
        console.log("miss sound");
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

socket.emit("getLeaderboard");

socket.on("setLeaderboard", function(leaderboard){
    //Need to finish
    $("#theLeaderBoard").html("");
    for(let user of leaderboard){
        var tdUser = $("<td></td>").text(user.tag);
        var tdPass = $("<td></td>").text(user.password);
        var tdWins = $("<td></td>").text(user.wins);

        var tr = $("<tr></tr>")
            .append(tdUser)
            .append(tdPass)
            .append(tdWins);

        $("#theLeaderBoard").append(tr);
    }

    console.log(leaderboard);
});

$("#play").click(function(){
    if(!$("#tag")[0].checkValidity()){
        $("#tag")[0].focus();
        return;
    }
    if (!$("#password")[0].checkValidity()) {
        $("#password")[0].focus();
        return;
    }
    if (!$("#wins")[0].checkValidity()) {
        $("#wins")[0].focus();
        return;
    }

    var user = {};
    user.tag = $("#tag").val();
    user.password = $("#password").val();
    user.wins = parseFloat($("#wins").val());

    socket.emit("submit", user);

    $("#tag").val("");
    $("#password").val("");
    $("#wins").val("");
});
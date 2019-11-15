var socket = io();
//
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
        myShips: [
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
        ]
    },
    methods: {
        changeResult(row, col){
            if(this.myShips[row][col] != " "){
               if(/*The ship has been sunk*/this.color == "N/A"){
                   /*My color and the colors of the ship's squares around me turn black*/
                   //this.color = "Black";
               } else {
                   /*The ship has not been sunk, but has been hit*/
                   this.myGuess[row].splice(col, 1, 1); //hit
               }
            } else {
                /*There is no ship there*/
                this.myGuess[row].splice(col, 1, 2); //miss
            }
        },
        forfeit(){
            
        },
        randomPlacement(){
            for(var i = 0; i < 5; i++){
                this.myShips[i].splice(2, 1, 5); //place carrier
            }
            for(var i = 6; i < 9; i++){
                this.myShips[5].splice(i, 1, 3); //place cruiser
            }
            for(var i = 6; i < 10; i++){
                this.myShips[9].splice(i, 1, 4); //place battleship
            }
            for(var i = 3; i < 6; i++){
                this.myShips[i].splice(9, 1, 3); //place submarine
            }
            for(var i = 0; i < 2; i++){
                this.myShips[6].splice(i, 1, 2); //place destroyer
            }
            socket.emit("updateShips", this.myShips); //move into ready later
        },
        ready(){

        },
        //this will probably go into the server
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
    },
    computed: {
    }
});

socket.on('updateDisplay', function(data){
    //update our displayed grids.
   //myShips = data ? but also update screen ("myships"). 
})

socket.on('created', function(data){
    //player 1 created a game
});

socket.on('join', function(data){
    //player 1 joined game
});

socket.on('joined', function(data){
    //p2 join
});

socket.on("clientDisconnect", function(dataFromServer) {
   //player disconnects
});

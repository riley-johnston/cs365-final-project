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
            [" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
            [" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
            [" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
            [" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
            [" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
            [" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
            [" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
            [" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
            [" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
            [" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
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
                   this.myGuess[row][col] = 1; //hit
               }
            } else {
                /*There is no ship there*/
                this.myGuess[row][col] = 2; //miss
            }
            //$.post("/updateArray", {updatedResults: this.results}, function(){
            //});
            this.color = this.styleForRowCol(row, col);
            console.log(this.color);
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
            $.post("/updateArray", {updatedShips: this.myShips}, function(){
            });
        },
        ready(){

        },
        styleForRowCol(rowI, colI) {
            console.log(rowI);
            console.log(colI);
            if(this.myGuess[rowI][colI] == 0){
                return "water";
            }
            else if(this.myGuess[rowI][colI] == 1){
                return "hit";
            }
            else if(this.myGuess[rowI][colI] == 2){
                return "miss";
            }
            else if(this.myGuess[rowI][colI] == 3){
                return "sunk";
            }
        }
    },
    computed: {
        colorForRowCol(){
            return this.color;
        }
    }
})




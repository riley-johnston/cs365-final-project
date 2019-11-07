var v = new Vue({
    el: '#app',
    data:{
        numPlayers: 0,
        color: "N/A",
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
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
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
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        ]
    },
    
    methods: {
        changeResult(row, col){
            if(this.myShips[row][col] == 0){
               if(/*The ship has been sunk*/this.color == "N/A"){
                   /*My color and the colors of the ships around me turn black*/
                   this.color = "Black";
               } else {
                   /*The ship has not been sunk*/
                   this.color = "Red"; /*change the CSS property?*/
               }
            } else {
                /*There is no ship there*/
                this.color = "White";
            }
            this.myShips[row].splice(col, 1, this.color);
            $.post("/updateArray", {updatedResults: this.results}, function(){
            });
        },
        forfeit(){
            
        },
        randomPlacement(){
            for(var i = 0; i < 5; i++){
                this.myShips[i][2] = 5; //place carrier
            }
            for(var i = 6; i < 9; i++){
                this.myShips[5][i] = 3; //place cruiser
            }
            for(var i = 6; i < 10; i++){
                this.myShips[9][i] = 4; //place battleship
            }
            for(var i = 3; i < 6; i++){
                this.myShips[i][9] = 3; //place submarine
            }
            for(var i = 0; i < 3; i++){
                this.myShips[6][i] = 2; //place destroyer
            }
            console.log(this.myShips);
            $.post("/updateArray", {updatedShips: this.myShips}, function(){
            });
        },
        ready(){

        }
    }
})

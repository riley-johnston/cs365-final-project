var v = new Vue({
    el: '#app',
    data:{
        numPlayers: 0,
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
        changeResult(column, row, col){
            var color = "N/A";
            if(this.myShips[row][col] != 0){
               if(/*The ship has been sunk*/0 == 0){
                   /*My color and the colors of the ships around me turn black*/
               } else {
                   /*The ship has not been sunk*/
                   color = "Red";
               }
            } else {
                /*There is no ship there*/
                color = "White";
            }
            this.results[col].splice(row, 1, color);
            $.post("/updateArray", {updatedResults: this.results}, function(){
            });
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
            for(var i = 0; i < 3; i++){
                this.myShips[6].splice(i, 1, 2); //place destroyer
            }
            console.log(this.myShips);

        },
        ready(){

        }
    }
})




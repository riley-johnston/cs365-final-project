var v = new Vue({
    el: '#app',
    data:{
        numPlayers: 0,
        results: [
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        ]
    },
    
    methods: {
        changeResult(column, row, col){
            if(/*There is a ship there*/ 0 == 0){
               if(/*The ship has been sunk*/0 == 0){

               } else {
                   /*The ship has not been sunk*/
               }
            } else {
                /*There is no ship there*/
            }
            this.results[col].splice(row, 1, opposite);
            this.results[row].splice(col, 1, column);
            $.post("/updateArray", {updatedResults: this.results}, function(){
            });
        }
    }
})

console.log(v.results);
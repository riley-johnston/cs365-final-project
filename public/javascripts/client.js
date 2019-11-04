var v = new Vue({
    el: '#app',
    data:{
        numPlayers: 0,
        results: [
            [1, 2, 3],
            [1, 2, 3],
            [1, 2, 3]
        ]
    },
    
    methods: {
        changeResult(column, row, col){
            if(/*There is a ship there*/){
               if(/*The ship has been sunk*/){

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
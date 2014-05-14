var highscore = {
    
    getHighscores: function(){
        if(localStorage['highscores'] == undefined){
            return new Array();
        }else{
            return JSON.parse(localStorage['highscores']);
        }
    },
    insertHighscore: function(name, score){
        var highscores = this.getHighscores();
        highscores.push({'name':name,'score':score});
        
        function compare(a,b) {
            if (a.score > b.score)
               return -1;
            if (a.score < b.score)
              return 1;
            return 0;
        }

        highscores.sort(compare);
        localStorage['highscores'] = JSON.stringify(highscores);
    }
    
};
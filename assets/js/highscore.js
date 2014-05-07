var highscore = {
    
    getHighscores: function(){
        return JSON.parse(localStorage['highscores']);
    }
    
};
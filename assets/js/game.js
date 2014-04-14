var current = 0;
var current_party = {};
var num_result = 0;
var correct= 0;
var wrong= 0;

function generatePartyButtons() {

}

$(document).ready(function() {

        //event for time period selection
        $("#parties a").click(function(e){
           var timePeriod = $(this).html().split('-');
           quiz.startYear = timePeriod[0];
           quiz.endYear = timePeriod[1];
           $.mobile.loading("show", {
            text: 'Laddar från Korp',
            textVisible: true,
            textonly: false
           });
           quiz.loadNewSentences(function(){
               $.mobile.loading("hide");
               loadSentence();
               $("#start").hide();
               $("#header").hide();
               $("#quiz").show();
           });
        });
});

function loadSentence() {
   var sentence = quiz.getNewSentence();
   $('#random').html(sentence.s);
   $('#game-content').show("fast");
   
}

// check the answer and get new sentence
function guessParty(party) {

}
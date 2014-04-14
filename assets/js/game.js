var current = 0;
var current_party = {};
var num_result = 0;
var correct = 0;
var wrong = 0;

function generatePartyButtons() {

}

$(document).ready(function() {

    //event for time period selection
    $("#parties a").on("vclick", function(e) {
        var timePeriod = $(this).html().split('-');
        quiz.startYear = timePeriod[0];
        quiz.endYear = timePeriod[1];
        $.mobile.loading("show", {
            text: 'Laddar från Korp',
            textVisible: true,
            textonly: false
        });
        quiz.loadNewSentences(function() {
            $.mobile.loading("hide");
            loadSentence();
            $("#start").hide();
            $("#header").hide();
            $("#quiz").show();
        });
    });


    //go back to home
    $(".home").on("vclick", function(e) {
        $("#start").show();
        $("#header").show();
        $("#quiz").hide();
    });
});

function loadSentence() {
    var sentence = quiz.getNewSentence();
    $('#random').html(sentence.s);
    $('#game-content').show("fast");
    generateButtons();
}

function generateButtons() {
    var list = Array();

    list.push(quiz.current.p);

    for (var i = 0; i < 3; i++) {
        list.push(randomParty());
    }

    list = shuffle(list);

    console.log(list);
    var output = '';
    $("#parties").html("");
    for (var p in list) {
        console.log(list[p]);
        $.each(quiz.partyDict, function(key, value) {
            console.log(key + ':'+list[p]);
            if (key == list[p]) {
                console.log(key + ':' + value);
                output += '<li><a class="ui-btn" data-value="'+key+'">' + value + '</a></li>';
                
            }
        });
    }
    console.log(output)
    console.log("setting html");
    $("#guessParty").html(output);

}

function randomParty() {
    var ret;
    var c = 0;
    for (var key in quiz.partyDict)
        if (Math.random() < 1 / ++c)
            ret = key;
    return ret;
}

function shuffle(o) {
    for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x)
        ;
    return o;
}

// check the answer and get new sentence
function guessParty(party) {

}
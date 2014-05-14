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
        $("#score li").removeAttr('class');
        quiz.loadNewSentences(function() {
            $.mobile.loading("hide");
            loadSentence();
            $("#start").hide();
            $("#header").hide();
            $("#quiz").show();
        });
    });

    $("#highscoreBtn").on("vclick", function(e) {
        var hs = highscore.getHighscores();
        var output = '';
        
        jQuery.each(hs, function(key, h) {
            output += '<tr><td class="score">'+h.score+'</td><td>'+h.name+'</td></tr>';
        });
        console.log(output);
        $("#highscore-list").html(output);
        $("#start").hide();
        $("#highscore").show();
    });
    
    $("#saveScoreBtn").on("vclick", function(e) {
        highscore.insertHighscore($("#name").val(), $("#correct").html());
        $("#result").hide();
        $("#start").show();
        $("#header").show();
    });   
    
    $("#aboutBtn").on("vclick", function(e) {
        $("#start").hide();
        $("#about").show();
    });   

    //go back to home
    $(".home").on("vclick", function(e) {
        $("#start").show();
        $("#header").show();
        $("#quiz").hide();
        $("#result").hide();
        $("#highscore").hide();
        $("#about").hide();
    });
});

function loadSentence() {
    var sentence = quiz.getNewSentence();
    if(sentence.s.length > 210){
        sentence.s = sentence.s.substr(0,210)+'...';
    }
    $('#random').html(sentence.s);
    $('#game-content').show("fast");
    generateButtons();
}

function generateButtons() {
    var list = Array();

    list.push(quiz.current.p);

    while(list.length <= 3){
        var p = randomParty();
        console.log('random party '+p);
        if(jQuery.inArray(p.toString(), list) <= -1){
            list.push(p.toString());
        }
    }

    list = shuffle(list);

    var output = '';
    $("#guessParty").html("");
    for (var p in list) {
        $.each(quiz.partyDict, function(key, value) {
            if (key == list[p]) {
                output += '<li><a class="ui-shadow ui-btn ui-corner-all party '+key+'" data-value="'+key+'">' + value.label + '</a></li>';
            }
        });
    }
    $("#guessParty").html(output);
    $("#guessParty a").on("vclick",function(e){
        $("#guessParty a").unbind();
        var p = $(this).attr('data-value');
        console.log('gissade på '+p);
        
        $s = $("#score li:not([class]):first");
        
        if(p == quiz.current.p){
            $("#guessParty ."+p).addClass('correct');
            $s.addClass(p);
            $s.addClass('correct');
        }else{
            $("#guessParty ."+p).addClass('wrong');
            $("#guessParty ."+quiz.current.p).stop().addClass('correct', 700);
            $s.addClass(quiz.current.p);
            $s.addClass('wrong');
        }
        
        setTimeout(function(){ 
            if($("#score li:not([class])").length == 0){
                var correct = $("#score li.correct").length;
                $("#correct").html(correct);
                $("#total").html($("#score li").length);
                $("#quiz").hide();
                $("#result").show();
                console.log('antal rätt: '+correct);
            }else{
                loadSentence() ;
            }
        }, 800);
    });
}

function randomParty() {
    var ret;
    var c = 0;
    
    var parties = getPartiesBetween(quiz.startYear, quiz.endYear);
    console.log('parties');
    console.log(parties);
    for (var key in parties)
        if (Math.random() < 1 / ++c)
            ret = parties[key];
        
    return ret;
}

function getPartiesBetween(from, to){
    var result = new Array();
    for (var key in quiz.partyDict){
        var f = quiz.partyDict[key].from;
        var t = quiz.partyDict[key].to;
        if ((f >= from && t <= to) || (f <= from && t >= from)){
            result.push(key);
        }
    }
    return result;
}

function shuffle(o) {
    for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}
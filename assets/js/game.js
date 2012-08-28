//List of parties
var par = {
	    "all": 	"Alliansen",
	    "c": 	"Centerpartiet",
	    "rg": 	"De r&ouml;dgr&ouml;na",
	    "fi": 	"Feministiskt initiativ",
	    "fp": 	"Folkpartiet",
	    "jr": 	"Jordbrukarnas riksf&ouml;rbund",
	    "kd": 	"Kristdemokraterna",
	    "la": 	"Lantmannapartiet",
	    "labp": "Lantmanna- och borgarepartiet",
	    "lisp": "Liberala samlingspartiet",
	    "mp": 	"Milj&ouml;partiet",
	    "m": 	"Moderaterna",
	    "npf": 	"Nationella framstegspartiet",
	    "nyd": 	"Ny demokrati",
	    "pp": 	"Piratpartiet",
	    "sd": 	"Sverigedemokraterna",
	    "k_h": 	"Sveriges kommunistiska parti, H&ouml;glundarna",
	    "k_k": 	"Sverges kommunistiska parti, Kilbommarna",
	    "svp": 	"Sverges socialdemokratiska v&auml;nsterparti",
	    "lp": 	"Sveriges liberala parti",
	    "s": 	"Socialdemokraterna",
	    "v": 	"V&auml;nsterpartiet"
};

var korp_url = "http://demosb.spraakdata.gu.se/cgi-bin/korp/korp.cgi?callback=?";
var corpus = "VIVILL";
var cqp = '[(pos = "NN")]';
var current = 0;
var current_party = {};
var num_result = 0;
var correct= 0;
var wrong= 0;

function generatePartyButtons() {

    $("#parties").html('');
    $.each(par, function(key, val) {
        $("#parties").append('<li class="party_item"><a class="p_button" id="' + key + '">' + val + '</a></li>');
    });

    $("#parties").shuffle();
    
    var tmp;
    
    if ($("#" + current_party.text_party).length ) {
    	tmp = $("#" + current_party.text_party).parent();
    }else{
    	tmp = '<li class="party_item"><a class="p_button" id="' + current_party.text_party + '">' + current_party.text_party + '</a></li>';
    }

    $("#" + current_party.text_party).parent().remove();
	
    $('.party_item:gt(2)').remove();

    //$('.p_button').remove();
    $("#parties").append(tmp);
    $("#parties").shuffle();
	
	$('#parties').listview('refresh');
	$('#game-content').slideDown("fast");

    //Click-event for guess
    $('.p_button').click(function(event) {
        event.preventDefault();
        guessParty($(this).attr('id'));
    });
}

$(document).ready(function() {
	// Load first sentence
	loadSentence(1);
});

function loadSentence(num) {
	$('#game-content').slideUp("fast");
	
    var data = {
        command: 'query',
        corpus: corpus,
        cqp: cqp,
        start: num,
        end: (num),
        defaultcontext: '1 sentence'
    };

    data.show_struct = ['text_year', 'text_party', 'text_type'];

    $.ajax({
        url: korp_url,
        dataType: "jsonp",
        data: data,
        traditional: true,
        success: corpus_results
    });
}

// recive the data and render
function corpus_results(data) {
    if (current == 0) {
        num_result = data.hits;
        var num = Math.floor(Math.random() * num_result) + 1;
        current = num;
        loadSentence(num);
        return 0;
    }

    if(data.kwic[0].tokens.length > 40){
        var num = Math.floor(Math.random() * num_result) + 1;
        loadSentence(num);
        return 0;
    }
    
    var punct = ['.', ',', '!', '?', ';', '-', '"', '\'', '(', ')'];

    var i = 0;
    var korp_sentence = "";
    $.each(data.kwic[0].tokens, function(key, val) {
        if (jQuery.inArray(val.word, punct) > -1) korp_sentence += val.word;
        else korp_sentence += ' ' + val.word;
    });

    $("#random").html(korp_sentence).hide().fadeIn("fast");;
    current_party = data.kwic[0].structs;
    generatePartyButtons();
}

// check the answer and get new sentence
function guessParty(party) {
    var status = "";
    if (party == current_party.text_party) {
        correct++;
        $("#correct").fadeOut("fast").html(correct).fadeIn("fast");
        $("#info").addClass('correct');
        $("#info").removeClass('wrong');        
        status = "R&auml;tt! <strong>"+par[current_party.text_party]+"</strong> ("+current_party.text_year+")";
    } else {
        wrong++;
        $("#wrong").fadeOut("fast").html(wrong).fadeIn("fast");
        $("#info").addClass('wrong');
        $("#info").removeClass('correct');
        status = "Nu blev det lite fel, r&auml;tt svar &auml;r: <strong>"+par[current_party.text_party]+"</strong> ("+current_party.text_year+")";
    }
    $("#info").html(status+"<p><em>"+$("#random").html()+"</em></p>").hide().fadeIn("slow");
    
    var num = Math.floor(Math.random() * num_result) + 1;
    current = num;
    loadSentence(num);
}
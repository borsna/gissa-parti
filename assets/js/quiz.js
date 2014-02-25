

var quiz = {
    backend : "http://demosb.spraakdata.gu.se/cgi-bin/korp/korp.cgi",
    params : {
        command: 'query_sample',
        corpus: 'VIVILL',
        cqp: '[(pos = "NN")]',
        start:0,
        end:10,
        defaultcontext:'1 sentence',
        show_struct:['text_year', 'text_party','text_type']
    },
    punct : ['.', ',', '!', '?', ';', '-', '"', '\'', '(', ')'],
    partyDict : {
        "all":  "Alliansen",
        "c":    "Centerpartiet",
        "rg":   "De r&ouml;dgr&ouml;na",
        "fi":   "Feministiskt initiativ",
        "fp":   "Folkpartiet",
        "jr":   "Jordbrukarnas riksf&ouml;rbund",
        "kd":   "Kristdemokraterna",
        "la":   "Lantmannapartiet",
        "labp": "Lantmanna- och borgarepartiet",
        "lisp": "Liberala samlingspartiet",
        "mp":   "Milj&ouml;partiet",
        "m":    "Moderaterna",
        "npf":  "Nationella framstegspartiet",
        "nyd":  "Ny demokrati",
        "pp":   "Piratpartiet",
        "sd":   "Sverigedemokraterna",
        "k_h":  "Sveriges kommunistiska parti, H&ouml;glundarna",
        "k_k":  "Sverges kommunistiska parti, Kilbommarna",
        "svp":  "Sverges socialdemokratiska v&auml;nsterparti",
        "lp":   "Sveriges liberala parti",
        "s":    "Socialdemokraterna",
        "v":    "V&auml;nsterpartiet"        
    },
    presets : [
                {
                    sentence:"Test one to threeeee",
                    year:1976,
                    party:"m"
                },
                {
                    sentence:"Wombat mapaat",
                    year:1996,
                    party:"s"
                }
            ],
     getNewSentence : function(){
         
     },
     loadNewSentences : function(){
         jQuery.ajaxSettings.traditional = true;
         jQuery.ajax({url:this.backend, data:this.params}).done(function(data){
            var korp_sentence = "";
            jQuery.each(data.kwic[0].tokens, function(key, val) {
                if (jQuery.inArray(val.word, this.punct) > -1) korp_sentence += val.word;
                else korp_sentence += ' ' + val.word;
            });
            var party = data.kwic[0].structs.text_party;
            var year  = data.kwic[0].structs.text_year;
            console.log(quiz.partyDict[party]+' '+year);
            console.log(korp_sentence);
         })
     }
}
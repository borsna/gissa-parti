var quiz = {
    //Default settings
    backend : "http://spraakbanken.gu.se/ws/korp?",
    params : {
        command: 'query_sample',
        corpus: 'VIVILL',
        cqp: '[(pos = "NN")]',
        start:0,
        end:10,
        defaultcontext:'1 sentence',
        show_struct:['text_year', 'text_party']
    },
    startYear: 1887,
    endYear:2442,
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
    presets : [],
    getNewSentence : function(){
         var sentences = JSON.parse(localStorage['quiz-sentences']);
         console.log('left: '+sentences.length);
         if(sentences.length < 2){
             this.loadNewSentences();
         }
         var random = Math.floor(Math.random()*sentences.length);
         sentences.splice(random,1);
         localStorage['quiz-sentences'] = JSON.stringify(sentences);
         return sentences[random];
    },
    loadNewSentences : function(callback){
         jQuery.ajaxSettings.traditional = true;
         this.params.cqp = '[(int(_.text_datefrom) >= '+this.startYear+'0101 & int(_.text_dateto) <= '+this.endYear+'1231)]';
         jQuery.ajax({url:this.backend, data:this.params}).done(function(data){
            var sentences = Array();
            jQuery.each(data.kwic, function(i, kwic) {
                var sentence = "";
                jQuery.each(kwic.tokens, function(key, val) {
                    if (jQuery.inArray(val.word, quiz.punct) > -1){ 
                        sentence = sentence.trim() + val.word;
                    }
                    else{
                        sentence += ' ' + val.word;
                    }
                });
                sentences.push({s:sentence.trim(),y:kwic.structs.text_year,p:kwic.structs.text_party});
            });
            localStorage['quiz-sentences'] = JSON.stringify(sentences);
            console.log(JSON.parse(localStorage['quiz-sentences']));
            if (callback && typeof(callback) === "function") {
              callback();
            }            
         });
    }
}
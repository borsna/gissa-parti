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
    },partyDict2 : {
        "all":  {label:"Alliansen",from:2004,to:2014},
        "c":    {label:"Centerpartiet",from:1913,to:2014},
        "rg":   {label:"De r&ouml;dgr&ouml;na",from:2004,to:2014},
        "fi":   {label:"Feministiskt initiativ",from:2005,to:2014},
        "fp":   {label:"Folkpartiet",from:1934,to:2014},
        "jr":   {label:"Jordbrukarnas riksf&ouml;rbund",from:1915,to:1921},
        "kd":   {label:"Kristdemokraterna",from:1964,to:2014},
        "la":   {label:"Lantmannapartiet",from:1920,to:2014},
        "labp": {label:"Lantmanna- och borgarepartiet",from:1920,to:2014},
        "lisp": {label:"Liberala samlingspartiet",from:1920,to:2014},
        "mp":   {label:"Milj&ouml;partiet",from:1981,to:2014},
        "m":    {label:"Moderaterna",from:1920,to:2014},
        "npf":  {label:"Nationella framstegspartiet",from:1920,to:2014},
        "nyd":  {label:"Ny demokrati",from:1991,to:2000},
        "pp":   {label:"Piratpartiet",from:2006,to:2014},
        "sd":   {label:"Sverigedemokraterna",from:1988,to:2014},
        "k_h":  {label:"Sveriges kommunistiska parti, H&ouml;glundarna",from:1924,to:1926},
        "k_k":  {label:"Sverges kommunistiska parti, Kilbommarna",from:1929,to:1948},
        "svp":  {label:"Sverges socialdemokratiska v&auml;nsterparti",from:1921,to:1926},
        "lp":   {label:"Sveriges liberala parti",from:1920,to:2014},
        "s":    {label:"Socialdemokraterna",from:1920,to:2014},
        "v":    {label:"V&auml;nsterpartiet",from:1920,to:2014}        
    },
    current : {},
    getNewSentence : function(){
         var sentences = JSON.parse(localStorage['quiz-sentences']);
         
         var random = Math.floor(Math.random()*sentences.length);

         quiz.current = sentences[random]
         sentences.splice(random,1);
         localStorage['quiz-sentences'] = JSON.stringify(sentences);

         if(sentences.length < 2){
             this.loadNewSentences();
         }         
         return quiz.current;
    },
    loadNewSentences : function(callback){
         jQuery.ajaxSettings.traditional = true;
         this.params.cqp = '[(int(_.text_datefrom) >= '+this.startYear+'0101 & int(_.text_dateto) <= '+this.endYear+'1231)]';
         jQuery.ajax({url:this.backend, dataType:'jsonp', data:this.params}).done(function(data){
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
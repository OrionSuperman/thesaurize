const thesaurus = require('thesaurus');
const pluralize = require('pluralize');
const _ = require('lodash');

const commonArr =["the","of","and","a","to","in","is","you","that","it","he","was","for","on","are","as","with","his","they","I","at","be","this","have","from","or","one","had","by","word","but","not","what","all","were","we","when","your","can","said","there","use","an","each","which","she","do","how","their","if","will","up","about","out","many","then","them","these","so","some","her","would","make","like","him","into","time","has","look","two","more","go","see","no","way","could","my","than","been","call","who","its","now","did","get","come","made","may","part","i","me","his"];

const customThesaurus = {
    "trump": trump()
};
  
function thesaurize(words, opts = {}){
    if(opts.customThesaurus){
        _.merge(customThesaurus, opts.customThesaurus);
    }
    return words
        .split(' ')
        .map(word => {
            let wordComponents = splitPunctuation(word);
            if(commonArr.includes(wordComponents.baseWord.toLowerCase())){
                console.log("returning common word");
                return word;
            }
        
            setWordProperties(wordComponents);
            let customThesWord = getCustomThesaurusWord(wordComponents);
            if(customThesWord){
                wordComponents.synonym = customThesWord;
            } else {
                wordComponents.synonym = getThesaurusWord(wordComponents.baseWord);
            }

            return constructWord(wordComponents);
        })
        .join(' ');
    
}

function getThesaurusWord(word){
    let tWordArr = thesaurus.find(word.toLowerCase());
    let tWord = chooseWord(tWordArr);
    return tWord ? tWord : word;
}

function getCustomThesaurusWord(wordComponents){
    console.log("hit");
    let returnWord = '';
    let customEntry = customThesaurus[wordComponents.originalWord.toLowerCase()]
        || customThesaurus[wordComponents.baseWord.toLowerCase()]
        || [];
    console.log(customEntry);
    if(customEntry.length){
        returnWord = chooseWord(customEntry);
    }
    return returnWord;
}

function setWordProperties(wordComponents){
    if(wordComponents.baseWord === wordComponents.baseWord.toUpperCase()){
        wordComponents.allCaps = true;
    } else if(wordComponents.baseWord.charAt(0) === wordComponents.baseWord.charAt(0).toUpperCase()){
        wordComponents.capitalize = true;
    }

    if(pluralize.isPlural(wordComponents.baseWord) && isLetter(wordComponents.baseWord[wordComponents.baseWord.length - 2])){ // checking for apostrophe
        wordComponents.isPlural = true;
        wordComponents.baseWord = pluralize.singular(wordComponents.baseWord.toLowerCase());
    } else {
        wordComponents.isPlural = false;
    }
}

function constructWord(wordComponents){
    if(wordComponents.isPlural){
        wordComponents.synonym = pluralize.plural(wordComponents.synonym);
    }
    if(wordComponents.allCaps){
        wordComponents.synonym = wordComponents.synonym.toUpperCase();
    } else if(wordComponents.capitalize){
        wordComponents.synonym = jsUcfirst(wordComponents.synonym);
    }
    return wordComponents.punctuation[0] + wordComponents.synonym + wordComponents.punctuation[1];
}

function splitPunctuation(word){
    let returnObj = {
        originalWord: word,
        baseWord: word,
        punctuation: ["",""]
    };
    while(!isLetter(returnObj.baseWord[returnObj.baseWord.length -1]) && returnObj.baseWord.length){
        returnObj.punctuation[1] = returnObj.baseWord.substring(returnObj.baseWord.length-1) + returnObj.punctuation[1];
        returnObj.baseWord = returnObj.baseWord.substring(0, returnObj.baseWord.length-1);
    }
    
    while(!isLetter(returnObj.baseWord[0]) && returnObj.baseWord.length){
        returnObj.punctuation[0] = returnObj.punctuation[0] + returnObj.baseWord.substring(0,1);
        returnObj.baseWord = returnObj.baseWord.substring(1);
    }
    
    return returnObj;
}

function chooseWord(tWordArr){
    console.log(tWordArr);
    return tWordArr.length ? tWordArr[Math.floor(Math.random()*tWordArr.length)] : false;
}

function isLetter(c) {
  return c ? c.toLowerCase() != c.toUpperCase() : true;
}

function jsUcfirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function trump() {

    return [
        "Agent of Deranged Change ",
        "The Angry Cheeto",
        "Bag of Toxic Sludge",
        "Bald-faced Crier",
        "The Bigoted Billionaire",
        "The Bilious Billionaire",
        "Blowhard",
        "The Bouffant Buffoon",
        "Bush Baby and Bush Baby Fingers",
        "The Bush Basher",
        "The Bush Beater",
        "Bushmaster",
        "Captain Bluster",
        "Captain Crunch",
        "Captain Tantastic",
        "Chimp-PAN-Zee",
        "Clown Prince of Politics",
        "The Combover Con Artist",
        "Commander-in-Grief",
        "Conspiracy Commander-in-Chief",
        "Con-Dike Gold Rush",
        "Crown Prince of Politwits",
        "Crybaby Prima Donald",
        "The Daft Draft Dodger",
        "Dainty Donald",
        "The Debate Hater",
        "Deeply Disturbed Fuzzy Orange Goofball",
        "Der Groepenfuehrer",
        "Der Trumpkopf",
        "Dickhead",
        "Dickhead Dongle",
        "Dingbat Donald",
        "Dishonest Don",
        "The Disruptor",
        "The Dick Tater",
        "Dodgy Donald",
        "Don the Con",
        "Don Dementia",
        "Donald Chump",
        "Donald deGonad",
        "Donald Dingbat",
        "Donald Dipshit",
        "The Donaldmeister",
        "Donald Doom",
        "The Donimator",
        "Donald Douche and the Bags",
        "Donald Duck",
        "Donald Duck Doo-Doo",
        "Donald Ducknuke",
        "Donald Dump",
        "Donald Gonad",
        "Donald the Menace",
        "Don Goner",
        "Donnie Bratso",
        "Donnie Darko",
        "Donnie TicTac",
        "Donnybaby",
        "Donnyboy",
        "Donnybrook",
        "Don of Orange",
        "Dr. Strangelove",
        "Duke Nuke ‘Em",
        "Dumbelldore",
        "Ego Maniac",
        "The Emperor with no Clothes",
        "Itty Bitty Ball Trump",
        "The Fanta Fascist",
        "Field Marshall Trump",
        "Flipper",
        "Flip Flopper",
        "The Fomentalist",
        "Forrest Trump",
        "The Fraud of Fifth Avenue",
        "Frisker-in-Chief",
        "Frisky Frisker",
        "The Frontrunner",
        "Golden Calf of Doom",
        "God-Emperor Trump",
        "Great Orange Hairball of Fear",
        "The Great White Dope",
        "The Great White Dope on a Self-Hanging Rope",
        "Grope Dope",
        "Halfwit Tweet Twit",
        "Head Twit",
        "Herr Führer Trump",
        "Herr Trump",
        "The Human Amplifier",
        "The Human Combover",
        "The Human Tanning Bed Warning Label",
        "The im-POTUS",
        "The Inane Interjector",
        "The Infuriator",
        "The ISIS Candidate",
        "Jack the Gripper",
        "King of Debt",
        "King Leer",
        "King of Sleaze",
        "King of Spin",
        "King Trump",
        "King Twit",
        "K-Mart Caesar",
        "Last of The Mango Mohawkans",
        "Liberal Lip",
        "Little Donnie Sissypants",
        "Little Dutch Boy",
        "The Lone DeRanger",
        "Long Dong Trump",
        "Lurch",
        "The Lyin King",
        "Macho McGrump",
        "The Mad Shambler",
        "Mango Mussolini",
        "Master Debater",
        "MEGA-low-maniac",
        "Mr. Firepants",
        "Mr. Inappropriate",
        "Mr. Boinker Oinker",
        "New York Dork",
        "Orange Bozo",
        "Orange Caligula",
        "Orange Clown",
        "Orange-Hued Self-Immolator",
        "Orange Man",
        "The Orange Messiah",
        "Orange Moron",
        "Orange Omen of Doom",
        "Orange Toilet Bowl Crud Brought to Life as a Genital-Grabbing Golem",
        "Orange-Tufted Imbecile Intent on Armageddon",
        "Orange-Tufted Asshole",
        "OranguTAN",
        "Party Pooper",
        "President Gold Man Sucks",
        "President If-Urine-You’re-In",
        "President Rancid Velveeta",
        "Prima Donald",
        "Pudgy McTrumpcake",
        "Puffed Up Daddy",
        "Pussy Posse",
        "Putin’s Papaya-Flavored Pawn",
        "Putin’s Pet",
        "Queer Orangutan",
        "Republican Rapture Inducer",
        "Ryan’s Nope",
        "Scrooge McTrump",
        "Sexual-Predator-in-Chief",
        "Shitler",
        "Sir Sissypants",
        "The Spin King",
        "The Suicide Bummer",
        "The Swamp Draining Lizard-Man-Toddler",
        "The Talking Yam",
        "The Tanning Bed Warning Label",
        "Tangerine Jesus",
        "Tepid Trumpeter",
        "Thin Skinned Orange Peel",
        "Tic-Tacky Trump",
        "Timid Trumpster",
        "Tiny Hands Trump",
        "Tricky Trump",
        "T-Rump",
        "Trumpalump",
        "Trumpamaniac",
        "Trump Card",
        "Trumpledore",
        "Trumpletoes",
        "Trumpling Dildo",
        "Trumpmeister",
        "Trumpster",
        "Trumpthechumps",
        "Trumpty Dumpty",
        "Trump the Grump",
        "The Tufted Taliban",
        "Twat Twit",
        "Twitter Flitter",
        "Twitter Spitter",
        "The UNA Bomber",
        "Unreality King",
        "Venom-Drenched Regurgitated Slimy Orange Hairball",
        "Walking Punchline",
        "Whiny Don",
        "Whiny Donald",
        "The White Pride Piper",
        "YUGE Asshole",
        "YUGE Liar",
        "Zen Master of Hate"];
};


module.exports = thesaurize;
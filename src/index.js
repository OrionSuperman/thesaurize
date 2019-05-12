let thesaurus = require('thesaurus');
let pluralize = require('pluralize');
let fs = require('fs-extra');
let _ = require('lodash');

let commonArr = require('../data/common.json');

let customThesaurus = {
    "trump": require('../data/trump.json')
};

function thesaurize(words, opts = {}) {
    if (typeof words !== "string") {
        throw new error("thesaurize module requires a string input for processing");
    }
    if (opts.customThesaurus) {
        _.merge(customThesaurus, opts.customThesaurus);
    }
    return words
        .split('\n')
        .map(line => {
            return line.split(' ')
                .map(word => {
                    return processWord(word);
                })
                .join(' ');
        })
        .join('\n');

}

function processWord(word) {
    let wordComponents = setWordProperties(word);
    if (wordComponents.isCommonWord) {
        return word;
    }
    wordComponents.synonym = findSynonym(wordComponents);

    return constructWord(wordComponents);
}

function findSynonym(wordComponents){
    return getCustomThesaurusWord(wordComponents)
        || getThesaurusWord(wordComponents)
        || wordComponents.baseWord;
}

function setWordProperties(word) {
    let wordComponents = splitPunctuation(word);
    if (wordComponents.baseWord === wordComponents.baseWord.toUpperCase()) {
        wordComponents.allCaps = true;
    } else if (wordComponents.baseWord.charAt(0) === wordComponents.baseWord.charAt(0).toUpperCase()) {
        wordComponents.capitalize = true;
    }

    if (pluralize.isPlural(wordComponents.baseWord) && isLetter(wordComponents.baseWord[wordComponents.baseWord.length - 2])) { // checking for apostrophe
        wordComponents.isPlural = true;
        wordComponents.baseWord = pluralize.singular(wordComponents.baseWord.toLowerCase());
    } else {
        wordComponents.isPlural = false;
    }
    wordComponents.isCommonWord = getCommonWordStatus(wordComponents);
    return wordComponents;
}

function splitPunctuation(word) {
    let returnObj = {
        originalWord: word,
        baseWord: word,
        punctuation: ["", ""]
    };
    while (!isLetter(returnObj.baseWord[returnObj.baseWord.length - 1]) && returnObj.baseWord.length) {
        returnObj.punctuation[1] = returnObj.baseWord.substring(returnObj.baseWord.length - 1) + returnObj.punctuation[1];
        returnObj.baseWord = returnObj.baseWord.substring(0, returnObj.baseWord.length - 1);
    }

    while (!isLetter(returnObj.baseWord[0]) && returnObj.baseWord.length) {
        returnObj.punctuation[0] = returnObj.punctuation[0] + returnObj.baseWord.substring(0, 1);
        returnObj.baseWord = returnObj.baseWord.substring(1);
    }

    return returnObj;
}

function getCommonWordStatus(wordComponents) {
    return commonArr.includes(wordComponents.baseWord.toLowerCase())
        || commonArr.includes(wordComponents.originalWord.toLowerCase());
}

function getThesaurusWord(wordComponents) {
    let tWordArr = thesaurus.find(wordComponents.baseWord.toLowerCase());
    if (!tWordArr.length) {
        tWordArr = thesaurus.find(wordComponents.originalWord.toLowerCase());
    }
    let tWord = chooseWord(tWordArr);
    return tWord ? tWord : '';
}

function getCustomThesaurusWord(wordComponents) {
    let customEntry = customThesaurus[wordComponents.originalWord.toLowerCase()]
        || customThesaurus[wordComponents.baseWord.toLowerCase()]
        || [];
    let tWord = chooseWord(customEntry);
    return tWord ? tWord : '';
}


function constructWord(wordComponents) {
    if (wordComponents.isPlural) {
        wordComponents.synonym = pluralize.plural(wordComponents.synonym);
    }
    if (wordComponents.allCaps) {
        wordComponents.synonym = wordComponents.synonym.toUpperCase();
    } else if (wordComponents.capitalize) {
        wordComponents.synonym = jsUcfirst(wordComponents.synonym);
    }
    return wordComponents.punctuation[0] + wordComponents.synonym + wordComponents.punctuation[1];
}


function chooseWord(tWordArr) {
    return tWordArr.length ? tWordArr[Math.floor(Math.random() * tWordArr.length)] : false;
}

function isLetter(c) {
    return c ? c.toLowerCase() != c.toUpperCase() : true;
}

function jsUcfirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = thesaurize;

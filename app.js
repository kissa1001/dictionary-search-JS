var fs = require('fs');
var readline = require('readline');
var dictionary = [], tiles = [], tilesArray = [];
fs.readFile('dictionary.txt', function(err, data) {
    if(err) throw err;
    dictionary = data.toString().split(/\r?\n/).filter(Boolean);
});

fs.readFile('tiles.txt', function(err, data) {
    if(err) throw err;
    tiles = data.toString().split("\n").filter(Boolean);
    tilesArray = tiles.map(function(i){
      var filtered = i.split("").filter(function(e){return e !== " ";});
      return filtered.reduce(function(tilesObject, item) {
        if(item !== " "){
          tilesObject[item] = item;
          tilesObject.blank = 7 - filtered.length;
        }
        return tilesObject;
      }, {});
    });
    dictionarySearch(dictionary, tilesArray);
    process.exit();
});

function dictionarySearch(dictionary, tilesArray){
  var result = [];
  for(var i = 0; i < tilesArray.length; i++){
    for(var j = 0; j < dictionary.length; j++){
      if(match(dictionary[j],tilesArray[i])){
        result.push(dictionary[j]);
      }
    }
  }
  console.log(result);
}

function match(word, tiles){
  wordSplited = word.split("");
  blanks = tiles.blank;
  for(var i = 0; i < wordSplited.length; i++){
    currentLetter = wordSplited[i];
    if(!tiles[currentLetter]){
      if(blanks > 0){
        blanks -= 1;
      }
      else{
        return false;
      }
    }
    else{
      return true;
    }
  }
}

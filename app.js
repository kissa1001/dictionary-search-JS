//Reading dictionary.txt file and save result to an array
var fs = require('fs');
var readline = require('readline');
var dictionary = [], tiles = [], tilesArray = [];
fs.readFile('dictionary.txt', function(err, data) {
    if(err) throw err;
    dictionary = data.toString().split(/\r?\n/).filter(Boolean);
});
//Reading tiles.txt file and save result to array of objects
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
//Main function
function dictionarySearch(dictionary, tilesArray){
  //Intializing result array
  var result = [];
  //Looping through tiles array and dictionary array of objects
  for(var i = 0; i < tilesArray.length; i++){
    for(var j = 0; j < dictionary.length; j++){
      //put every word of array to every tiles set to check if that word match
      if(match(dictionary[j],tilesArray[i])){
        //if yes, push this word to result array
        result.push(dictionary[j]);
      }
    }
  }
  console.log(result);
}
//Function to check if the word matches tiles set
function match(word, tiles){
  //Creating array of word letters
  wordSplited = word.split("");
  //set number of wildcard to blanks variable
  blanks = tiles.blank;
  //Looping through each letter in the word
  for(var i = 0; i < wordSplited.length; i++){
    currentLetter = wordSplited[i];
    //Check to see if current letter is in our tile set
    //If not
    if(!tiles[currentLetter]){
      //We check if we have any blanks, and if yes, we decrement number of blanks
      if(blanks > 0){
        blanks -= 1;
      }
      //If there are no blanks, we return false
      else{
        return false;
      }
    }
    //If current letter is in tile set, return true
    else{
      return true;
    }
  }
}

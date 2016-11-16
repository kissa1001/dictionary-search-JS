var fs = require('fs');
var readline = require('readline');
//Reading dictionary.txt file and save result to an array
var dictionary = fs.readFileSync('dictionary.txt').toString().replace(/(\r\n|\n|\r)/gm, ",").split(",").filter(Boolean);
//I assumed that input is lines of strings
//Reading tiles.txt file and save result to array of objects
fs.readFile('tiles.txt', function(err, data) {
    if(err) throw err;
    var tiles = data.toString().split("\n").filter(Boolean);
    tilesArray = tiles.map(function(i){
      var filtered = i.split("").filter(function(e){return e !== " ";});
      return filtered.reduce(function(tilesObject, item) {
        if(item !== " " && !tilesObject[item]){
          tilesObject[item] = 1;
          tilesObject.blank = 7 - filtered.length;
        }
        else if(item !== " " && tilesObject[item]){
          tilesObject[item] += 1;
        }
        return tilesObject;
      }, {});
    });
    dictionarySearch(dictionary, tilesArray);
    process.exit();
});

//Main function
function dictionarySearch(dictionary, tilesArray){
  //Looping through tiles array and dictionary array of objects
  for(var i = 0; i < tilesArray.length; i++){
    matchDictionary(dictionary, tilesArray[i]);
  }
}
//Check dictionary with specific tile
function matchDictionary(dictionary, tiles){
  //Intializing result array
  var result = [];
  for(var j = 0; j < dictionary.length; j++){
    //put every word of array to every tiles set to check if that word match
    if(match(dictionary[j],tiles)){
      //if yes, push this word to result array
      result.push(dictionary[j]);
    }
  }
  console.log(result);
}
//Function to check if the word matches tiles set
function match(word, tiles){
  //Intializing screenArray(contains result of screening each letter)
  var screenArray = [],
  //Wordsplited variable is array of current word letters
  wordSplited = word.split(""),
  //Set in currentTiles variable copy of tiles object
  currentTiles = Object.assign({}, tiles),
  //Set in blanks array number of wildCards
  blanks = tiles.blank;
  //Looping through array of word letters
  for(var i = 0; i < wordSplited.length; i++){
    currentLetter = wordSplited[i];
    //If current letter is not in tiles object,
    //check blank spaces, if yes, decrement number of blanks,
    //if no, push the result false to screenArray
    if(!currentTiles[currentLetter]){
      if(blanks > 0){
        blanks -= 1;
      }
      else{
        screenArray.push(false);
      }
    }
    //If current letter is in tiles object,
    //check the count of this letter,
    //if > 0 we decrement letter count and push true to screenArray
    //if = 0 we push false to screenArray
    else{
      if(currentTiles[currentLetter] === 0){
        screenArray.push(false);
      }
      else{
        currentTiles[currentLetter] -= 1;
        screenArray.push(true);
      }
    }
  }
  //Finally we check if any false value is in screenArray
  //If yes, we return false, otherwise, return true
  if(screenArray.indexOf(false) > -1){
    return false;
  }
  else{
    return true;
  }
}

//Big O analysis
//Assume that we have a dictionary with length m and n number of tiles set
//We first loop through number of tiles (Main function), so time complexity depends on n
//Then we loop though each word in dictionary, so time complexity depends on m
//After that, we look through each letter of the word(that takes less or equal O(7), cos only 7 tiles),
//If that word matches criteria, we add to result
//So finally the time complexity is O(nm)

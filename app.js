var fs = require('fs');
var readline = require('readline');

// Reading dictionary.txt file asynchronously and save result to an array

var dictionary = fs.
readFileSync('dictionary.txt')
    .toString()
    .replace(/(\r\n|\n|\r)/gm, ",")
    .split(",")
    .filter(Boolean);

// I assumed that the input is lines of strings
// Reading tiles.txt file and save result to array of objects

var tiles = fs
    .readFileSync('tiles.txt')
    .toString()
    .split("\n")
    .filter(Boolean);

var tilesArray = tiles.map(function(i) {
    var filtered = i.split("").filter(function(e) {
        return e !== " ";
    });
    return filtered.reduce(function(tilesObject, item) {
        if (item !== " " && !tilesObject[item]) {
            tilesObject[item] = 1;
            tilesObject.blank = 7 - filtered.length;
        } else if (item !== " " && tilesObject[item]) {
            tilesObject[item] += 1;
        }
        return tilesObject;
    }, {});
});

// Calling main function, then exit program

console.log(dictionarySearch(dictionary, tilesArray));
process.exit();

// Main function

function dictionarySearch(dictionary, tilesArray) {
    // Looping through tiles array and matching each tiles object with dictionary
    for (var i = 0; i < tilesArray.length; i++) {
        return matchDictionary(dictionary, tilesArray[i]);
    }
}

// Check dictionary with specific tile

function matchDictionary(dictionary, tiles) {
    // Intializing result variable
    var result = "";
    for (var j = 0; j < dictionary.length; j++) {
        // put every word of array to every tiles set to check if that word match
        if (match(dictionary[j], tiles)) {
            // if yes, push this word to result
            result += dictionary[j] + ", "
        }
    }
    return result;
}

// Function to check if the word matches tiles set

function match(word, tiles) {
    // Intializing screenArray(contains result of screening each letter)
    var screenArray = [],
        // Set in current tiles variable copy of tiles object
        currentTiles = Object.assign({}, tiles),
        // Set in blanks array number of wildCards
        blanks = currentTiles.blank;
    // Looping through word letters
    for (var i = 0; i < word.length; i++) {
        currentLetter = word[i];
        // If the letter is not in tiles object or we dont have any current letters left
        if (!currentTiles[currentLetter] || currentTiles[currentLetter] === 0) {
            // We check if any blanks left, if yes, we substract number of blanks
            if (blanks > 0) {
                blanks -= 1;
            // Otherwise we push "false" to screen array fot this letter
            } else {
                screenArray.push(false);
            }
        // Otherwise, we decrement this letter count in tiles array and push "true" to screen array
        } else {
            currentTiles[currentLetter] -= 1;
            screenArray.push(true);
        }
    }
    // Finally we check if any false value is in screenArray
    // If yes, we return false, otherwise, return true
    if (screenArray.indexOf(false) > -1) {
        return false;
    } else {
        return true;
    }
}

/* Big O analysis
 Assume that we have a dictionary with length m and n number of tiles set
 We first loop through number of tiles (Main function), so time complexity depends on n
 Then we loop though each word in dictionary, so time complexity depends on m
 After that, we look through each letter of the word(that takes less or equal O(7), cos only 7 tiles),
 If that word matches criteria, we add to result
 So finally the time complexity is O(nm) , space complexity O(nm)*/

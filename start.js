//require inquirer
var inquirer = require('inquirer');
var isLetter = require('is-letter');
//require objects
var Word = require('./word.js');
var Game = require('./game.js');


//set the maxListener
require('events').EventEmitter.prototype._maxListeners = 100;


var hangman = {
  wordBank: Game.newWord.wordList,
  guessesRemaining: 10,
  //empty array to hold letters guessed by user.
  guessedLetters: [],
  //asks user if they are ready to play
  startGame: function() {
    var that = this;
    //clears guessedLetters before a new game starts.
    if(this.guessedLetters.length > 0){
      this.guessedLetters = [];
    }

    inquirer.prompt([{
      name: "play",
      type: "confirm",
      message: "Start Playing?"
    }]).then(function(answer) {
      if(answer.play){
        that.newGame();
      } else{
        console.log("See ya next time!");
      }
    })},
  //Starts New Game
  newGame: function() {
    if(this.guessesRemaining === 10) {
      console.log("Let's Get Started!");
      console.log('*****************');
      //generates random number based on the wordBank
      var randNum = Math.floor(Math.random()*this.wordBank.length);
      this.currentWord = new Word(this.wordBank[randNum]);
      this.currentWord.getLets();
      //Blanks for letters to show up
      console.log(this.currentWord.wordRender());
      this.keepPromptingUser();
    } else{
      this.resetGuessesRemaining();
      this.newGame();
    }
  },
  resetGuessesRemaining: function() {
    this.guessesRemaining = 10;
  },
  keepPromptingUser : function(){
    var that = this;
    //asks player for a letter
    inquirer.prompt([{
      name: "chosenLtr",
      type: "input",
      message: "Choose a letter:",
      validate: function(value) {
        if(isLetter(value)){
          return true;
        } else{
          return false;
        }
      }
    }]).then(function(ltr) {
      //changes letters to upper case
      var letterReturned = (ltr.chosenLtr).toUpperCase();
      //Adds to guessed letters array
      var guessedAlready = false;
        for(var i = 0; i<that.guessedLetters.length; i++){
          if(letterReturned === that.guessedLetters[i]){
            guessedAlready = true;
          }
        }
        //Runs through function if the letter wasn't already guessed
        if(guessedAlready === false){
          that.guessedLetters.push(letterReturned);

          var found = that.currentWord.checkIfLetterFound(letterReturned);
          //if none were found tell user that they guess incorrectly
          if(found === 0){
            console.log('Darn! You guessed incorrectly.');
            that.guessesRemaining--;
            that.display++;
            console.log('Guesses remaining: ' + that.guessesRemaining);
           

            console.log('\n--------------------');
            console.log(that.currentWord.wordRender());
            console.log('\n--------------------');

            console.log("Letters guessed: " + that.guessedLetters);
          } else{
            console.log('Awesome! You guessed right!');
              //Did the user win?
              if(that.currentWord.didWeFindTheWord() === true){
                console.log(that.currentWord.wordRender());
                console.log('Congratulations! You win!');
                // that.startGame();
              } else{
                // display the user how many guesses remaining
                console.log('Guesses remaining: ' + that.guessesRemaining);
                console.log(that.currentWord.wordRender());
                console.log('\n----------------');
                console.log("Letters guessed: " + that.guessedLetters);
              }
          }
          if(that.guessesRemaining > 0 && that.currentWord.wordFound === false) {
            that.keepPromptingUser();
          }else if(that.guessesRemaining === 0){
            console.log('Game over!');
            console.log('The word was: ' + that.currentWord.word);
          }
        } else{
            console.log("You've guessed that letter already. Try again.")
            that.keepPromptingUser();
          }
    });
  }
}

hangman.startGame();

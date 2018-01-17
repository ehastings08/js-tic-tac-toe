//Note : I did review the FCC provided code to modify my original attempt at this challenge. See https://codepen.io/FreeCodeCamp/full/adBpvw for the reviewed code.

//////////////////// GAME //////////////////////
function game() {
  
  // Set game variables
  var playerChoice = '',
    compChoice = '',
    gameNum = 0,
    gameBoard = [
    '#topLeft',
    '#topMiddle',
    '#topRight',
    '#middleLeft',
    '#middleMiddle',
    '#middleRight',
    '#bottomLeft',
    '#bottomMiddle',
    '#bottomRight'
  ],
      playerMoveIDs = [],
      compMoveIDs = [],
      freeMoves = [
      '#topLeft',
      '#topMiddle',
      '#topRight',
      '#middleLeft',
      '#middleMiddle',
      '#middleRight',
      '#bottomLeft',
      '#bottomMiddle',
      '#bottomRight'
    ],
    boardPlayedPlayer = [],
    boardPlayedComp = [];
  
  
  // Modal - Player selection.
 
  $('#myModal').modal('show');
  $('#xButton').click(function() {
    playerChoice = 'X';
    compChoice = 'O';
  });
  $('#oButton').click(function() {
    playerChoice = 'O';
    compChoice = 'X';
  });
  
  // ******************************** //
  function disableSpace(spaceID, freeMoves) {
    // Create a new list of free spaces using 1) the space selected and 2) the list of remaining free moves on the board
    var remaining = [];
    for (var i = 0; i < freeMoves.length ; i++) {
      if (!(freeMoves[i] === spaceID)) {
        remaining.push(freeMoves[i]);
      }
    }
    return remaining;
  }
  
// ******************************** //
  function resetGame() {
    // If a game is completed, clear the board of marks and reset player choice. Start game again.
    $('.box').empty();
    game();
  }
  
  
  // ******************************** //
   function boardMarks(markChoice, gameBoard) {
    // Get the marks that have been played on the board for a particular choice mark (x or o)
      var played = [];
      for (var i = 0 ; i < gameBoard.length; i++) {
        if ($(gameBoard[i]).find('h2').text() === markChoice) {
          played.push(i); // push the index of the tile that has that particular mark
        }
      }
      return played;
  }
  
  // ******************************** //
 
  function checkWin(boardMarksArray) {
    // Checks an array of marks played for a given player and answers the question: has this player won?
    // Returns true or false
    // Win conditions are: 0/1/2, 0/3/6, 0/4/8, 1/4/7, 2/4/7, 2/5/8, 3/4/5, 6/7/8
    function check(input) {
      if (boardMarksArray.indexOf(input) > -1) {
        return true;
      } else {
        return false;
      }
    }
   // Start with conditions at top-left
      if (check(0)) {
        if (check(1) && check(2)) {
          return true;
        } else if (check(3) && check(6)) {
          return true;
        }
      }
      // Move on to top middle
      if (check(1)) {
        if (check(4) && check(7)) {
          return true;
        }
      }
      if (check(2)) {
        if (check(4) && check(6)) {
          return true;
        } else if (check(5) && check(8)) {
          return true;
        }
      }
      if (check(3)) {
        if (check(4) && check(5)) {
          return true;
        }
      } 
      if (check(6)) {
        if (check(7) && check(8)) {
          return true;
        }
      }
      return false; // if none of the above have already returned, no win conditions were satisfied
  } // end checkwin function

  
  // ******************************** //
  // playerFirstTurn - either ends with game over or compTurn
  function playerTurn() {
    // Disable click events for disabled classes
    $('.box disabled').off('click');
    // Upon click...
    $('.box').click(function() {
        // check to see if game is over.
        if (isGameOver(compChoice, gameBoard)) {
          alert('Game over! Computer won!');
          resetGame();
        } else if (isGameOver(playerChoice, gameBoard)) {
          alert('Game over! You won!'); 
          resetGame();
        } else {
        // if game is not over...
           // add the player's choice to playerMoveIDs and write to the board
           $(this).append('<h2>' + playerChoice + '</h2>');
           $('.box').off('click');
           // Append chosen item to the list of move IDs
           playerMoveIDs.push('#'+$(this).attr('id'));
           // Then update free moves using disableSpace, which returns remaining allowed moves
           freeMoves = disableSpace('#'+$(this).attr('id'),freeMoves);
           $(this).addClass('disabled');
           // And updated board played
           boardPlayedPlayer.push('#'+$(this).attr('id'));
      
          // NOW CHECK AGAIN
          if (isGameOver(compChoice, gameBoard)) {
            alert('Game over! Computer won!');
            resetGame();
          } else if (isGameOver(playerChoice, gameBoard)) {
            alert('Game over! You won!'); 
            resetGame();
          } else {
           compTurn();
          }
        }
    });
    
  }
  
    
  // ******************************** //
  function compTurn() {
    if (isGameOver(compChoice, gameBoard)) {
          alert('Game over! Computer won!');
          resetGame();
        } else if (isGameOver(playerChoice, gameBoard)) {
          alert('Game over! You won!'); 
          resetGame();
        } else {
          // Now the computer picks a random space where the player has not gone.
          // Pick a random # between 0 and the length of the freeMoves array
          var randomNumber = Math.floor(Math.random() * freeMoves.length);
          // Then pick that move for the computer
          var computerMove = freeMoves[randomNumber];
          // Write to board
           $(computerMove).append('<h2>' + compChoice + '</h2>');
           // Append chosen item to the list of move IDs
           compMoveIDs.push(computerMove);
           // Then update free moves using disableSpace, which returns remaining allowed moves
           freeMoves = disableSpace(computerMove,freeMoves);
           $(this).addClass('disabled'); // Add disable class
           // And updated board played
           boardPlayedComp.push(computerMove);
          // Now it is the player's turn again
              // NOW CHECK AGAIN
              if (isGameOver(compChoice, gameBoard)) {
                alert('Game over! Computer won!');
                resetGame();
              } else if (isGameOver(playerChoice, gameBoard)) {
                alert('Game over! You won!'); 
                resetGame();
              } else {
              playerTurn();
              }
        }
  }
  
  // ******************************** //
  function isGameOver(markChoice, boardPlayed) {
    // Returns true if game is over after latest move, false otherwise
    // Accepts as an argument the player to test against
    // Use the boardMarks function to test the state of each player's choices so far - returns an array of indexes on the board indicating what that player has chosen so far.
   testMarks = boardMarks(markChoice, boardPlayed);
    // Check to see if any player (X or O) has made a winning combination (with their last move?) using the checkWins function for that player's choice
    if (checkWin(testMarks)) {
      return true;
    } else {
      return false;
    }
  } // end isGameOver function
        
  // Get the party started (game.playerTurn)
  playerTurn();
  
} // end game()

// Run game
game();
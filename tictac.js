(function($) {
    var currentPlayer = 1; // 2 is computer
    var gameBoard = [0,0,0,0,0,0,0,0,0];
    var winningCombos = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[6,4,2]];

    $(document).on('ready', function() {
        $('.move').on('click', function() {
            takeTurn($(this));
        });

        $('#new-game').on('click', function() {
            resetBoard();
        });
    });

    function resetBoard() {
        gameBoard = [0,0,0,0,0,0,0,0,0];
        $('.move').removeClass('winning-square player-1 player-2');
        currentPlayer = 1;
        changeStatus('Your move.');
        $('.move').off('click'); // prevent multiple click handlers if resetting game before over
        $('.move').on('click', function() {
            takeTurn($(this));
        });
    }

    function takeTurn(moveDivArray) {
        changeStatus('');
        // on click, check if spot is empty. If yes, color spot accordingly
        if (moveIsTaken(moveDivArray[0])) {
            changeStatus('Move is already taken');
            return;
        } else {
            gameBoard[moveDivArray[0].id] = currentPlayer;
            moveDivArray.addClass('player-' + currentPlayer);
        }

        // check if game is over with a win or tie
        if (gameIsOver()) {
            $('.move').off('click');
            return;
        }

        // if not, change currentPlayer
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        if (currentPlayer === 2) {
            computerTurn();
        }
    }

    function computerTurn() {
        var playerHas, playerDoesntHave;

        if (winOrPreventWin()) { 
            return;
        }

        function winOrPreventWin() {
            // Computer tries to find winning move.
            // If it can't, it tries to prevent human from winning

            // for each winning combination of moves, first check if player 2 (computer) can win in one move. If yes, take it.
            // if not, check if player 1 (human) can win in one move. If yes, take it.
            // Winning in one move means you have 2 out of 3 already in place.
            for (var player=2; player>0; player--) {
                for (var combo=0; combo<winningCombos.length; combo++){
                    playerHas = [];
                    playerDoesntHave = [];
                    for (var idx=0; idx<winningCombos[combo].length; idx++) {
                        gameBoardValue = gameBoard[winningCombos[combo][idx]];
                        if (gameBoardValue === player) {
                            playerHas.push(winningCombos[combo][idx]);
                        } else {
                            playerDoesntHave.push(winningCombos[combo][idx]);
                        }
                    }
                    if (playerHas.length == 2 && !moveIsTaken($('#' + playerDoesntHave[0])[0])) {
                        takeTurn($('#' + playerDoesntHave[0]));
                        return true;
                    }
                }
            }
            return false;
        }
        
        // if computer can't winOrPreventWin, get middle square first (it's the best!), else just take next available square
        if (moveIsTaken($('#4')[0])) {
            for (var x=0; x<gameBoard.length; x++){
                if (gameBoard[x] === 0 && !moveIsTaken($('#' + x)[0])) {
                    takeTurn($('#' + x));
                    return;
                }
            }
        } else {
            takeTurn($('#4'));
        }
    }

    function moveIsTaken(move) {
        return gameBoard[move.id] !== 0;
    }

    function gameIsOver() {
        var noMovesLeft = function() {
            for (var i=0; i<gameBoard.length; i++){
                if (gameBoard[i] === 0) {
                    return false;
                }
            }
            return true;
        };

        var isWin = function() {
            var first, second, third;
            var combos = winningCombos;

            for (var i=0; i<winningCombos.length; i++){
                idxArray = [combos[i][0], combos[i][1], combos[i][2]]
                first = gameBoard[combos[i][0]],
                second = gameBoard[combos[i][1]],
                third = gameBoard[combos[i][2]];

                // Win determined if gameboard has same value in all winningCombos indices (and doesn't equal 0).
                if (first === second && second === third &&
                        [first, second, third].indexOf(0) === -1) {
                    for (var idx=0; idx<idxArray.length; idx++) {
                        $('#' + idxArray[idx]).addClass('winning-square');
                    }
                    return true;
                }
            }
            return false;
        };

        if (isWin()){
            (currentPlayer === 1) ? changeStatus('You win!') : changeStatus('You lost!');
            return true;
        } else if (noMovesLeft()) {
            changeStatus("It's a tie!");
            return true;
        }
        return false;
    }

    function changeStatus(msg) {
        $('#status').text(msg);
    }

})(jQuery);

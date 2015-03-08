(function($) {
    var HUMAN = 1;
    var COMPUTER = 2;
    var WINNINGCOMBOS = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [6,4,2]
    ];

    $(document).on('ready', function() {
        var gameState = initializeGameState();
        humanTurn(gameState);

        $('#reset-game').on('click', function() {
            gameState = initializeGameState();
            resetGameBoard();
            humanTurn(gameState);
        });
    });

    function humanTurn(gameState) {
        changeStatus('Your move.');
        $('.move').on('click', function() {
            var squareID = this.id;

            if (moveIsAvailable(gameState.board, squareID)) {
                takeSquare(squareID, HUMAN);
                gameState.board = updateBoard(gameState.board, squareID, HUMAN);
                if (gameIsOver(gameState)) {
                    removeClickHandler();
                    displayResults(gameState);
                } else {
                    computerTurn(gameState);
                }
            } else {
                changeStatus('Move is Taken');
            }
        });
    }

    function computerTurn(gameState) {
        var squareID;

        removeClickHandler();
        changeStatus('Computer\'s move.');
        squareID = getComputerMove(gameState);

        if (squareID === null) {
            changeStatus('Error: can\'t find next move');
        }

        takeSquare(squareID, COMPUTER);
        gameState.board = updateBoard(gameState.board, squareID, COMPUTER);

        if (gameIsOver(gameState)){
            displayResults(gameState);
        } else {
            humanTurn(gameState);
        }
    }

    function getComputerMove(gameState) {
        // Computer tries to find winning move.
        // If it can't, it tries to prevent human from winning.
        // If neither of those are possible, take middle or next available square.
        var nextMove;

        function canWinOrPreventWin(potentialWinner) {
            var combo, playerHas, playerDoesntHave;
            for (combo=0; combo<WINNINGCOMBOS.length; combo++){
                playerHas = [];
                playerDoesntHave = [];

                playerAtFirst = gameState.board[WINNINGCOMBOS[combo][0]];
                playerAtSecond = gameState.board[WINNINGCOMBOS[combo][1]];
                playerAtThird = gameState.board[WINNINGCOMBOS[combo][2]];

                if (playerAtFirst === potentialWinner) {
                    playerHas.push(WINNINGCOMBOS[combo][0]);
                } else {
                    playerDoesntHave.push(WINNINGCOMBOS[combo][0]);
                }

                if (playerAtSecond === potentialWinner) {
                    playerHas.push(WINNINGCOMBOS[combo][1]);
                } else {
                    playerDoesntHave.push(WINNINGCOMBOS[combo][1]);
                }

                if (playerAtThird === potentialWinner) {
                    playerHas.push(WINNINGCOMBOS[combo][2]);
                } else {
                    playerDoesntHave.push(WINNINGCOMBOS[combo][2]);
                }

                if (playerHas.length === 2 && moveIsAvailable(gameState.board, playerDoesntHave[0])) {
                    nextMove = playerDoesntHave[0];
                    return true;
                }
            }
            return false;
        }

        if (canWinOrPreventWin(COMPUTER) || canWinOrPreventWin(HUMAN)) {
            return nextMove;
        } else if (moveIsAvailable(gameState.board, 4)) {
            return 4;
        } else {
            for (var x=0; x<gameState.board.length; x++){
                if (moveIsAvailable(gameState.board, gameState.board[x])) {
                    return x;
                }
            }
        }
        return null;
    }

    function gameIsOver(gameState) {
        gameState = checkForNewState(gameState);
        return gameState.isWin || gameState.isDraw;
    }

    function checkForNewState(gameState) {
        var playerAtFirst, playerAtSecond, playerAtThird;

        if (gameState.board.indexOf(0) === -1) {
            gameState.isDraw = true;
            return gameState;
        } else {
            for (var combo=0; combo<WINNINGCOMBOS.length; combo++) {
                playerAtFirst = gameState.board[WINNINGCOMBOS[combo][0]];
                playerAtSecond = gameState.board[WINNINGCOMBOS[combo][1]];
                playerAtThird = gameState.board[WINNINGCOMBOS[combo][2]];

                if (playerAtFirst === playerAtSecond && playerAtSecond === playerAtThird &&
                        [playerAtFirst, playerAtSecond, playerAtThird].indexOf(0) === -1) {
                    gameState.isWin = true;
                    gameState.winningCombo = WINNINGCOMBOS[combo];
                    gameState.winner = playerAtFirst;
                    return gameState;
                }
            }
        }
        return gameState;
    }

    function displayResults(gameState) {
        if (gameState.isWin) {
            for (var i=0; i<gameState.winningCombo.length; i++) {
                $('#' + gameState.winningCombo[i]).addClass('winning-square');
            }
            (gameState.winner === HUMAN) ? changeStatus('You win!') : changeStatus('You lost!');
        } else if (gameState.isDraw) {
            changeStatus('It\'s a tie!');
        }
    }

    function moveIsAvailable(gameBoard, id) {
        return gameBoard[id] === 0;
    }

    function takeSquare(id, player) {
        $('#' + id).addClass('player-' + player);
    }

    function updateBoard(gameBoard, id, player) {
       gameBoard[id] = player;
       return gameBoard;
    }

    function initializeGameState() {
        return {
            board: [0,0,0,0,0,0,0,0,0],
            isDraw: false,
            isWin: false,
            winner: null,
            winningombo: null
        };
    }

    function resetGameBoard(){
        $('.move').removeClass('winning-square player-1 player-2');
        $('.move').off('click');
    }

    function removeClickHandler(){
        $('.move').off('click');
    }

    function changeStatus(msg) {
        $('#status').text(msg);
    }
})(jQuery);

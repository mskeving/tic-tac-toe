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
        squareID = getNextMove(gameState.board);

        if (squareID === null) {
            changeStatus('Error: can\'t find next move');
        } else {
            takeSquare(squareID, COMPUTER);
            gameState.board = updateBoard(gameState.board, squareID, COMPUTER);
        }

        if (gameIsOver(gameState)){
            displayResults(gameState);
        } else {
            humanTurn(gameState);
        }
    }

    function getNextMove(gameBoard) {
        return calcMove(COMPUTER, gameBoard).move;

        function calcMove (player, state) {
            var bestScore, bestMove, newState, score, i;

            for (i = 0; i < state.length; i++) {
                if (state[i] == 0) {
                    newState = getNewState(player, state, i);
                    score = calcScore(player, newState);

                    if (bestScore == undefined || isNewScoreBestScore(score, best_score, player)) {
                        bestScore = score;
                        bestMove = i;
                    }
                }
            }

            return {
                move: bestMove,
                score: bestScore
            };
        }

        function getNewState(player, state, move) {
            var state_copy = state.slice();
            state_copy[move] = player;
            return state_copy;
        }

        function calcScore(player, state) {
            if (isWin(state)) {
                if (player == COMPUTER) {
                    return 1;
                } else {
                    return -1;
                }
            } else if (isDraw(state)) {
                return 0;
            } else {
                return calcMove(next_player(player), state).score;
            }
        }

        function next_player(player) {
            if (player == COMPUTER) {
                return HUMAN;
            }
            return COMPUTER;
        }

        function isNewScoreBestScore(score, bestScore_so_far, player) {
            return ((player == COMPUTER && score > bestScore_so_far) ||
                (player == HUMAN && score < bestScore_so_far));
        }
    }

    function isWin(board) {
        var playerAtFirst, playerAtSecond, playerAtThird;
        for (var combo=0; combo<WINNINGCOMBOS.length; combo++) {
            playerAtFirst = board[WINNINGCOMBOS[combo][0]];
            playerAtSecond = board[WINNINGCOMBOS[combo][1]];
            playerAtThird = board[WINNINGCOMBOS[combo][2]];

            if (playerAtFirst === playerAtSecond && playerAtSecond === playerAtThird &&
                    [playerAtFirst, playerAtSecond, playerAtThird].indexOf(0) === -1) {
                return true;
            }
        }
        return false;
    }

    function isDraw(board) {
        return (board.indexOf(0) === -1);
    }


    function gameIsOver(gameState) {
        gameState = checkForNewState(gameState);
        return gameState.isWin || gameState.isDraw;
    }

    function checkForNewState(gameState) {
        var playerAtFirst, playerAtSecond, playerAtThird;

        if (isDraw(gameState.board)) {
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
        removeClickHandler();
    }

    function removeClickHandler(){
        $('.move').off('click');
    }

    function changeStatus(msg) {
        $('#status').text(msg);
    }
})(jQuery);

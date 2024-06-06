function GameBoard() {
    const board = [];
    const size = 3;

    // fill board with cells with default value
    for (let i = 0; i < size; i++) {
        board[i] = [];
        for (let j = 0; j < size; j++) {
            board[i].push(Cell());
        }
    }

    // return board
    const getBoard = () => {
        return board;
    }

    // place X or O depending at x y coordinates
    const placeMark = (x, y, player) => {
        // check if spot is available
        if (board[x][y] === 0) {
            return;
        }

        board[x][y].setValue(player.getValue());
    }

    // check for a win/draw
    // -1 = draw, 0 = no win, but playable, 1 = X, 2 = O
    const checkWin = (x, y, player) => {
        // horizontal check
        for (let i = 0; i < size; i++) {
            if (board[x][i].getValue() != player.getValue()) {
                break;
            }
            if (i === size - 1) {
                return player.getValue();
            }
        }

        // vetical check
        for (let i = 0; i < size; i++) {
            if (board[i][y].getValue() != player.getValue()) {
                break;
            }
            if (i === size - 1) {
                return player.getValue();
            }
        }

        // diagonal check
        if (x === y) {
            for (let i = 0; i < size; i++) {
                if (board[i][i].getValue() != player.getValue()) {
                    break;
                }
                if (i === size - 1) {
                    return player.getValue();
                }
            }
        }

        // diagonal check
        if (x === y) {
            for (let i = 0; i < size; i++) {
                if (board[i][size - i - 1].getValue() != player.getValue()) {
                    break;
                }
                if (i === size - 1) {
                    return player.getValue();
                }
            }
        }

        return 0;
    }

    // print board to console
    const printBoard = () => {
        display = "  0 1 2\n";
        for (let i = 0; i < size; i++) {
            let row = `${i} `;
            for (let j = 0; j < size; j++) {
                row += board[i][j].getValue() + " ";
            }
            display += row + "\n";
        }
        console.log(display);
    }

    return {getBoard, placeMark, checkWin, printBoard};
};

// One square on the board. 
// A value of 0 is empty, 1 is X, 2 is O
function Cell() {
    let value = 0;
    const setValue = (player) => {
        value = player;
    };

    const getValue = () => {
        return value;
    };

    return {setValue, getValue};
};

// Player name is their display name (ex: player1)
// Value is whether they are X or O
function Player(pName, symbol) {
    const name = pName;
    let value = symbol;

    const getName = () => {
        return name;
    };
    const getValue = () => {
        return value;
    };
    const setValue = (symbol) => {
        value = symbol;
    };

    return {getName, getValue, setValue};
}

function GameController(playerOne = "Player One", playerTwo = "Player Two") {
    const board = GameBoard();

    const player1 = Player(playerOne, 1);
    const player2 = Player(playerTwo, 2);

    // player who is currently placing a mark
    let activePlayer = player1;

    // switch turn
    const switchPlayerTurn = () => {
        if (activePlayer === player1) {
            activePlayer = player2;
        } else {
            activePlayer = player1;
        }
    }

    // get the active player
    const getActivePlayer = () => {
        return activePlayer;
    }

    // calls who's turn it is
    const printNewTurn = () => {
        board.printBoard();
        console.log(`${getActivePlayer().getName()}'s turn.`);
    }

    const printWinner = () => {
        board.printBoard();
        console.log(`${getActivePlayer().getName()} wins!`);
    }

    // logic of one round
    const playTurn = (x, y) => {
        board.placeMark(x, y, activePlayer);

        console.log(board.checkWin(x, y, activePlayer));
        console.log(activePlayer.getValue());
        if (board.checkWin(x, y, activePlayer) === activePlayer.getValue()) {
            printWinner();
        } else {
            switchPlayerTurn();
            printNewTurn();
        }   
    }

    printNewTurn();

    return {
        playTurn,
        getActivePlayer
    };
};

const game = GameController();
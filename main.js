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

    const getSize = () => {
        return size;
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

    return {getBoard, placeMark, getSize, printBoard};
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

    const getBoard = () => {
        return board.getBoard();
    }

    const getSize = () => {
        return board.getSize();
    }

    // check for draw
    const checkDraw = () => {
        for (let i = 0; i < board.getSize(); i++) {
            for (let j = 0; j < board.getSize(); j++) {
                if (board.getBoard()[i][j].getValue() === 0) {
                    return;
                }
            }
        }
        return -1;
    }

    // check for a win
    // -1 = draw, but playable, 1 = X, 2 = O
    const checkWin = (x, y, player) => {

        // horizontal check
        for (let i = 0; i < board.getSize(); i++) {
            if (board.getBoard()[x][i].getValue() != player.getValue()) {
                break;
            }
            if (i === board.getSize() - 1) {
                return player.getValue();
            }
        }

        // vetical check
        for (let i = 0; i < board.getSize(); i++) {
            if (board.getBoard()[i][y].getValue() != player.getValue()) {
                break;
            }
            if (i === board.getSize() - 1) {
                return player.getValue();
            }
        }

        // diagonal check
        if (x === y) {
            for (let i = 0; i < board.getSize(); i++) {
                if (board.getBoard()[i][i].getValue() != player.getValue()) {
                    break;
                }
                if (i === board.getSize() - 1) {
                    return player.getValue();
                }
            }
        }

        // diagonal check
        if (x === y) {
            for (let i = 0; i < board.getSize(); i++) {
                if (board.getBoard()[i][board.getSize() - i - 1].getValue() != player.getValue()) {
                    break;
                }
                if (i === board.getSize() - 1) {
                    return player.getValue();
                }
            }
        }

        return 0;
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

    const printDraw = () => {
        board.printBoard();
        console.log("No Winners! Draw!");
    }

    // logic of one round
    const playTurn = (x, y) => {
        board.placeMark(x, y, activePlayer);

        if (checkDraw() === -1) {
            printDraw();
        }
        else if (checkWin(x, y, activePlayer) === activePlayer.getValue()) {
            printWinner();
        } else {
            switchPlayerTurn();
            printNewTurn();
        }   
    }

    printNewTurn();

    return {
        playTurn,
        getActivePlayer,
        getBoard,
        getSize
    };
};

function ScreenController() {
    const game = GameController();
    const playerTurnDiv = document.querySelector(".turn");
    const boardDiv = document.querySelector(".board");

    const updateScreen = () => {
        // clear the board
        boardDiv.textContent = "";

        // get the board and active player
        const board = game.getBoard();
        console.log(board);
        const activePlayer = game.getActivePlayer();

        // display player's turn
        playerTurnDiv.textContent = `${activePlayer.getName()}'s turn`

        // render board squares
        for(let i = 0; i < game.getSize(); i++) {
            for(let j = 0; j < game.getSize(); j++) {
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");

                cellButton.dataset.row = i;
                cellButton.dataset.column = j;
                cellButton.textContent = board[i][j].getValue();
                boardDiv.appendChild(cellButton);
            }
        }
    }

    // add event listener for board
    function clickHandlerBoard(e) {
        const selectedRow = e.target.dataset.row;
        const selectedColumn = e.target.dataset.column;

        if (!selectedRow || !selectedColumn) {
            return;
        }

        game.playTurn(selectedRow, selectedColumn)

        updateScreen();
    }

    boardDiv.addEventListener("click", clickHandlerBoard);

    // initial render
    updateScreen();
}

ScreenController();
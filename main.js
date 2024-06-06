function GameBoard(size = 3) {
    const board = [];
    const boardSize = size;

    // fill board with cells with default value
    for (let i = 0; i < boardSize; i++) {
        board[i] = [];
        for (let j = 0; j < boardSize; j++) {
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
        return boardSize;
    }

    return {getBoard, placeMark, getSize};
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

    return {getName, getValue};
}

function GameController(playerOne = "Player One", playerTwo = "Player Two", size = 3) {
    const board = GameBoard(size);

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
        if (Number(x) + Number(y) == board.getSize() - 1) {
            for (let i = 0; i < board.getSize(); i++) {
                if (board.getBoard()[board.getSize() - i - 1][i].getValue() != player.getValue()) {
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

    // logic of one round
    const playTurn = (x, y) => {
        // check to see if square is already taken
        if (board.getBoard()[x][y].getValue() != 0) {
            return 0;
        }

        board.placeMark(x, y, activePlayer);

        if (checkDraw() === -1) {
            return -1;
        }
        else if (checkWin(x, y, activePlayer) === activePlayer.getValue()) {
            return activePlayer.getValue();
        } else {
            switchPlayerTurn();
        }   
    }

    return {
        playTurn,
        getActivePlayer,
        getBoard,
        getSize
    };
};

function ScreenController() {
    let game = GameController();
    const playerTurnDiv = document.querySelector(".turn");
    const boardDiv = document.querySelector(".board");
    const resultDiv = document.querySelector(".result");

    // default settings
    let size = 3;
    let player1 = "Player One";
    let player2 = "Player Two";

    // result : -1 = draw, 0 = proceed normally, 1/2 = winner, 3 = new game
    const updateScreen = (result = 0) => {
        // clear the board
        boardDiv.textContent = "";

        if (result === 3) {
            resultDiv.textContent = "";
        }

        // get the board
        const board = game.getBoard();
        let gridSize = "";
        boardDiv.style.gridTemplate= "";

        // get the active player
        const activePlayer = game.getActivePlayer();

        // render board squares
        for(let i = 0; i < game.getSize(); i++) {
            for(let j = 0; j < game.getSize(); j++) {
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");

                cellButton.dataset.row = i;
                cellButton.dataset.column = j;

                // renders appropriate symbol
                if (board[i][j].getValue() === 0) {
                    cellButton.textContent = "";
                } else if (board[i][j].getValue() === 1) {
                    cellButton.textContent = "X";
                } else if (board[i][j].getValue() === 2) {
                    cellButton.textContent = "O"
                }
                boardDiv.appendChild(cellButton);
            }

            gridSize += "1fr ";
        }

        boardDiv.style.gridTemplate= `${gridSize} / ${gridSize}`;
  

        if (result === -1) {
            // generate result text
            resultDiv.textContent = "No Winners! Draw!";

            // disable game buttons
            const cells = document.querySelectorAll(".cell");
            cells.forEach((cell) => {
                cell.disabled = true;
            });

            // generate restart button
            const restartButton = document.createElement("button");
            restartButton.classList.add("restart");
            restartButton.textContent = "restart";
            restartButton.addEventListener("click", () => {
                game = GameController(player1, player2, size);

                updateScreen(result = 3);
            });

            resultDiv.appendChild(restartButton);
            return;
        } else if (result === activePlayer.getValue()){
            // generate result text
            resultDiv.textContent = `${activePlayer.getName()} wins!`;

            // disable game buttons
            const cells = document.querySelectorAll(".cell");
            cells.forEach((cell) => {
                cell.disabled = true;
            });

            // generate restart button
            const restartButton = document.createElement("button");
            restartButton.classList.add("restart");
            restartButton.textContent = "restart";
            restartButton.addEventListener("click", () => {
                game = GameController(player1, player2, size);

                updateScreen(result = 3);
            });

            resultDiv.appendChild(restartButton);
            return;
        }

        // display player's turn
        playerTurnDiv.textContent = `${activePlayer.getName()}'s turn`
    }

    // add event listener for board
    function clickHandlerBoard(e) {
        const selectedRow = e.target.dataset.row;
        const selectedColumn = e.target.dataset.column;

        if (!selectedRow || !selectedColumn) {
            return;
        }

        let result = game.playTurn(selectedRow, selectedColumn);

        updateScreen(result);
    }
    boardDiv.addEventListener("click", clickHandlerBoard);

    // Settings Page
    const settingsPage = document.querySelector(".settings-page");
    const settingsButton = document.querySelector(".settings");
    const closeButton = document.querySelector(".close-settings");
    const form = document.querySelector("form");

    settingsButton.addEventListener("click", () => {
        settingsPage.showModal();
    });

    closeButton.addEventListener("click", () => {
        settingsPage.close();
    });
    form.addEventListener("submit", (event) => {
        event.preventDefault();
    
        let playerOneName = document.getElementById("player-one-name").value;
        let playerTwoName = document.getElementById("player-two-name").value;
        let boardSize = Number(document.getElementById("size").value);

        if(playerOneName != "") {
            player1 = playerOneName;
        }
        if(playerTwoName != "") {
            player2 = playerTwoName;
        }
        if(boardSize != 0) {
            size = boardSize;
        }
        console.log(player2);

        game = GameController(player1, player2, size);

        updateScreen(result = 3);
        settingsPage.close();
    });

    

    // initial render
    updateScreen();
}

ScreenController();
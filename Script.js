const board = document.querySelector('#board');
const reset = document.getElementById('reset');
const turnTracker = document.getElementById('turnTracker');

class Box {
    constructor(element, beenClicked) {
        this.element = element;
        this.beenClicked = beenClicked;
    }
}

const Player = (name, symbol) => {
    const getName = () => name;
    const getSymbol = () => symbol;

    return {getName, getSymbol}
}

const gameBoard = (() => {
    const player1 = Player("Player 1", "X");
    const player2 = Player("Player 2", "O");
    let currPlayer = player1;
    let gameState = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
    let win = false;
    let tie = false;
    let winner = "";

    const buildBoard = (size) => {
        let boxList = [];
        board.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
        for(let i = 0; i < size**2; i++) {
            const box = new Box(document.createElement('div'), false);
            boxList[i] = box;
            box.element.classList.add('box'); 
            box.element.style.width = `${32/size} vw`
            box.element.style.height = `${32/size} vw`
            board.appendChild(box.element);
            box.element.addEventListener('click', () => {
                if(box.beenClicked == false && win == false) {
                    box.beenClicked = true;
                    let mark = document.createElement('h3');
                    mark.textContent = `${currPlayer.getSymbol()}`;
                    mark.classList.add('mark');
                    box.element.appendChild(mark);
                    gameState[i] = currPlayer.getSymbol();

                    checkWin();
                    checkTie(boxList);
                    if(win == false && tie == false) {
                        if(currPlayer == player1) {
                            currPlayer = player2;
                        } else {
                            currPlayer = player1;
                        }
                        turnTracker.textContent = `${currPlayer.getName()}'s Turn`
                    } else if(win){
                        turnTracker.textContent = `${winner} Wins!`
                    } else {
                        turnTracker.textContent = `Its a tie!`
                    }
                }
            });
         }
    };

    const clearBoard = () => {
        let boxList = Array.from(document.querySelectorAll('.box'));
        boxList.forEach(element => {
            board.removeChild(element);
        });
    }

    const checkWin = () => {
        for(let i = 0; i < 3; i++) {
            // if a row contains three in a row
            if(gameState[3*i] == gameState[3*i + 1] && gameState[3*i] == gameState[3*i + 2]) {
                win = true;
                winner = currPlayer.getName();
            // if a column contains three in a row
            } else if (gameState[i] == gameState[i + 3] && gameState[i] == gameState[i + 6]) {
                win = true;
                winner = currPlayer.getName();
            } 
        }
        if (
            (gameState[0] == gameState[4] && gameState[0] == gameState[8]) ||
            (gameState[2] == gameState[4] && gameState[2] == gameState[6])
        ) {
            win = true;
            winner = currPlayer.getName();
        } 
    };

    const checkTie = (boxList) => {
        let numClicked = 0;
        boxList.forEach(element => {
            if(element.beenClicked == true) {
                numClicked++;
            }
        });
        if(numClicked == 9) {
            tie = true;
        }
    }

    const resetGame = () => {
        clearBoard();
        buildBoard(3);
        gameState = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
        currPlayer = player1;
        turnTracker.textContent = `${currPlayer.getName()}'s Turn`
        win = false;
        tie = false;
    }

    return {buildBoard, resetGame};
})();

gameBoard.buildBoard(3);

reset.addEventListener('click', () => {
    gameBoard.resetGame();
});
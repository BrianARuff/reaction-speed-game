const startButton = document.querySelector('#startButton');
const resetButton = document.querySelector('#resetButton');
const board = document.querySelector('#board');
const evalDiv = document.querySelector('#evaluation');
const headerDiv = document.querySelector('#header');
const directionsDiv = document.querySelector('#directions');


const colors = ['red', 'green', 'blue', 'orange', 'purple'];

let score = 0;
let gameStarted = false;
let hasClickedGreen = false;
let hasNotClickedGreen = false;
let scoreIntervalID = null;
let changeBoardColorIntervalID = null;
let gameBoardID = null;
let randomTickRate = null;
let tickRate = 16.67;

function changeBoardColor() {
    score = 0;
    if (hasClickedGreen || hasNotClickedGreen) {
        clearTimeout(scoreIntervalID);
        clearTimeout(changeBoardColorIntervalID);
    }
    if (gameStarted) {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        board.style.backgroundColor = randomColor;
        randomTickRate = Math.floor(Math.random() * 1000) + 1000;
        changeBoardColorIntervalID = setTimeout(changeBoardColor, randomTickRate);
    }
}

function increaseScore() {
    if (!hasClickedGreen && !hasNotClickedGreen) {
        score += tickRate;
        scoreIntervalID = setTimeout(increaseScore, tickRate);
    }
}

function gameLoop() {
    if (gameStarted) {
        gameBoardID = setTimeout(gameLoop, tickRate);
    }
}

function setUpGame(event) {
    event.stopImmediatePropagation();
    score = 0;
    hasClickedGreen = false;
    hasNotClickedGreen = false;
    startButton.style.display = 'none';
    resetButton.style.display = 'none';
    headerDiv.style.display = 'none';
    directionsDiv.style.display = 'none';
    gameStarted = true;
    gameLoop();
    increaseScore();
    changeBoardColor();
}

function startGameBoard(event) {
    event.stopImmediatePropagation();
    if (gameStarted) {
        resetButton.style.display = 'block';
        gameStarted = false;
        const boardColor = board.style.backgroundColor;
        if (boardColor === 'green') {
            hasClickedGreen = true;
            evalDiv.textContent = `Congrats! You clicked on the green color. Your reaction time is ${Math.round(score)}! ms`;
            evalDiv.style.color = 'lightred';
        } else {
            hasNotClickedGreen = true;
        clearTimeout(gameBoardID);
        evalDiv.textContent = `You did not click green. Please try again. However, your reaction time from the last color to the one you clicked was ${Math.round(score)} ms!`;
            evalDiv.style.color = 'white';
        }
    }
}

function resetGame(event) {
    event.stopImmediatePropagation();
    gameStarted = false;
    evalDiv.textContent = '';
    headerDiv.style.display = 'block';
    directionsDiv.style.display = 'block';
    resetButton.style.display = 'none';
    startButton.style.display = 'block';
    board.style.backgroundColor = 'lightblue';
}

startButton.addEventListener('mousedown', setUpGame);
resetButton.addEventListener('mousedown', resetGame);
board.addEventListener('mousedown', startGameBoard);
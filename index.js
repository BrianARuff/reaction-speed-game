const startButton = document.querySelector('#startButton');
const resetButton = document.querySelector('#resetButton');
const board = document.querySelector('#board');
const evalDiv = document.querySelector('#evaluation');
const headerDiv = document.querySelector('#header');
const directionsDiv = document.querySelector('#directions');
const scoreListDiv = document.querySelector('#scoreList');
const averageScoreDiv = document.querySelector('#averageScore');


const colors = ['red', 'green', 'blue', 'orange'];

let score = 0;
let gameStarted = false;
let hasClickedGreen = false;
let hasNotClickedGreen = false;
let scoreIntervalID = null;
let changeBoardColorIntervalID = null;
let gameBoardID = null;
let tickRate = 10;
let scoreList = [];
let genreateedColors = [];

function getRandomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
}

function changeBoardColor() {
    score = 0;

    if (hasClickedGreen || hasNotClickedGreen) {
        clearTimeout(scoreIntervalID);
        clearTimeout(changeBoardColorIntervalID);
    }

    if (gameStarted) {
        let randomColor = getRandomColor();
        if (genreateedColors.length === 0 && randomColor === 'green') {
            randomColor = getRandomColor();
        }
        // make sure the same color is not generated twice in a row
        while (genreateedColors.length > 0 && randomColor === genreateedColors[genreateedColors.length - 1]) {
            console.log('new color generated')
            randomColor = getRandomColor();
        }
        board.style.backgroundColor = randomColor;
        const randomTickRate = Math.floor(Math.random() * 1000) + 1000;
        if (changeBoardColorIntervalID) clearTimeout(changeBoardColorIntervalID);
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
    gameStarted = true;
    gameLoop();
    changeBoardColor();
    increaseScore();
    hideResetButton();
    startButton.style.display = 'none';
    headerDiv.style.display = 'none';
    directionsDiv.style.display = 'none';
}

function clickedGameBoard(event) {
    event.stopImmediatePropagation();
    if (gameStarted) {
        showResetButton();
        gameStarted = false;
        const boardColor = board.style.backgroundColor;
        if (boardColor === 'green') {
            hasClickedGreen = true;
            evalDiv.textContent = `Congrats! You clicked on the green color. Your reaction time is ${Math.round(score)}! ms`;
            evalDiv.textContent = `Congrats! You clicked on the green color. Your reaction time is ${Math.round(score)}!`;
            scoreList.push(score);

            // append score to score list if list is less than 5 items
            if (scoreList.length < 5) {
                showResetButton();
                const scoreListItem = document.createElement('li');
                scoreListItem.textContent = `${scoreList.length}: ${score} ms`;
                scoreListDiv.appendChild(scoreListItem);
            }

            // if score list is 5 items, calculate average score and display it
            if (scoreList.length === 5) {
                genreateedColors = [];
                const averageScore = scoreList.reduce((a, b) => a + b) / scoreList.length;
                const scoreListItem = document.createElement('li');
                scoreListItem.textContent = `${scoreList.length}: ${score} ms`;
                scoreListDiv.appendChild(scoreListItem);
                averageScoreDiv.textContent = `Your average reaction time over the past five tries is ${Math.round(averageScore)} ms!`;
            }

            if (scoreList.length > 5) {
                genreateedColors = [];
                resetGame(event);
            }
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

    if (gameStarted && scoreList.length < 5) {
        scoreList = [];
        while (scoreListDiv.firstChild) {
            scoreListDiv.removeChild(scoreListDiv.firstChild);
        }
        averageScoreDiv.textContent = '';
    }

    // if start button is hidden, show it
    if (startButton.style.display === 'none') {
        startButton.style.display = 'block';
        hideResetButton();
    }

    gameStarted = false;
    evalDiv.textContent = '';
    headerDiv.style.display = 'block';
    directionsDiv.style.display = 'block';
    board.style.backgroundColor = 'lightblue';
}

startButton.addEventListener('mousedown', setUpGame);
resetButton.addEventListener('mousedown', resetGame);
board.addEventListener('mousedown', clickedGameBoard);

function showResetButton() {
    resetButton.style.display = 'block';
}

function hideResetButton() {
    resetButton.style.display = 'none';
}
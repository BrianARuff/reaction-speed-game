// DOM nodes
const startButton = document.querySelector('#startButton');
const resetButton = document.querySelector('#resetButton');
const board = document.querySelector('#board');
const evalDiv = document.querySelector('#evaluation');
const headerDiv = document.querySelector('#header');
const directionsDiv = document.querySelector('#directions');
const scoreListDiv = document.querySelector('#scoreList');
const averageScoreDiv = document.querySelector('#averageScore');

// app state variables
const colors = ['red', 'green', 'blue'];
const possibleTickRates = [1000, 1500, 2000, 2500];
let score = 0;
let gameStarted = false;
let hasClickedGreen = false;
let hasNotClickedGreen = false;
let changeBoardColorIntervalID = null;
let scoreList = [];
let genreatedColors = [];
let startDate = null;
let endDate = null;
let count = 0;
let randomTickRate = getRandomTickRate();

function getRandomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
}

function getRandomTickRate() {
    return possibleTickRates[Math.floor(Math.random() * possibleTickRates.length)];
}

function changeBoardColor() {
    startDate = 0;
    endDate = 0;

    console.log('randomTickRate: ', randomTickRate)
    
    changeBoardColorIntervalID = setInterval(() => {
        score = 0;

        if (hasClickedGreen || hasNotClickedGreen) {
            clearInterval(changeBoardColorIntervalID);
        }

        if (gameStarted) {
            let randomColor = getRandomColor();

            genreatedColors.push(randomColor);

            if (genreatedColors.length === 1 && randomColor === 'green') {
                randomColor = getRandomColor();
            }

            while (randomColor === board.style.backgroundColor) {
                randomColor = getRandomColor();
            }

            count++;

            if (count > 4) {
                randomColor = 'green';
            }

            genreatedColors.push(randomColor);
            
            board.style.backgroundColor = randomColor;
            startDate = +new Date();
            console.log('count: ', count)

            if (randomColor === 'green') {
                ding().play();
            }
        }
    }, randomTickRate);
}

function isInteractionTooEarly() {
    if (!genreatedColors.length ) {
        return true;
    }

    return false;
}


function setUpGame(event) {
    event.stopImmediatePropagation();
    gameStarted = true;
    changeBoardColor();
    hideResetButton();
    startButton.style.display = 'none';
    headerDiv.style.display = 'none';
    directionsDiv.style.display = 'none';
}

function clickedGameBoard(event) {
    if (isInteractionTooEarly()) return true;

    event.stopImmediatePropagation();

    score = (+new Date() - startDate) - 4;

    clearInterval(changeBoardColorIntervalID);


    if (gameStarted) {

        gameStarted = false;
        const boardColor = board.style.backgroundColor;
        if (boardColor === 'green') {
            hasClickedGreen = true;
            
            evalDiv.textContent = `Congrats! You clicked on the green color. Your reaction time is ${Math.round(score)}! ms`;
            
            scoreList.push(score);

            // append score to score list if list is less than 5 items
            if (scoreList.length < 5) {
                showResetButton('Try again');
                const scoreListItem = document.createElement('li');
                scoreListItem.textContent = `${scoreList.length}: ${Math.round(score)} ms`;
                scoreListDiv.appendChild(scoreListItem);
            }

            // if score list is 5 items, calculate average score and display it
            if (scoreList.length === 5) {
                showResetButton('Reset');
                const averageScore = scoreList.reduce((a, b) => a + b) / scoreList.length;
                const scoreListItem = document.createElement('li');
                scoreListItem.textContent = `${scoreList.length}: ${Math.round(score)} ms`;
                scoreListDiv.appendChild(scoreListItem);
                averageScoreDiv.textContent = `Your average reaction time over the past five tries is ${Math.round(averageScore)} ms!`;
            }

            // fail safe to reset game if score list is greater than 5 items
            if (scoreList.length > 5) {
                resetGame(event);
            }
        } else {
            // if not green color, reset game, show reset button with Try again text, and display evaluation text with error message
            showResetButton('Try again');
            hasNotClickedGreen = true;
            evalDiv.textContent = `You did not click green. Please try again. However, your reaction time from the last color to the one you clicked was ${Math.round(score)} ms!`;
            evalDiv.style.color = 'white';
        }
    }
}

function resetGame(event) {
    event.stopImmediatePropagation();

    genreatedColors = [];

    // if score list has 5 entries, reset score list, remove all li elements from score list div, and remove average score text from evaluation div
    if (scoreList.length === 5) {
        scoreList = [];
        while (scoreListDiv.firstChild) {
            scoreListDiv.removeChild(scoreListDiv.firstChild);
        }
        averageScoreDiv.textContent = '';
    }

    if (scoreList.length < 5) {
        // change text on reset button to try again
        resetButton.textContent = 'Try Again';
    }

    // if start button is hidden, show it
    if (startButton.style.display === 'none') {
        startButton.style.display = 'block';
        hideResetButton();
    }

    // after resetting game state
    score = 0;
    count = 0;
    endDate = 0;
    startDate = 0;
    gameStarted = false;
    hasClickedGreen = false;
    hasNotClickedGreen = false;

    // reset board, buttons, and headers to default text state.
    evalDiv.textContent = '';
    headerDiv.style.display = 'block';
    directionsDiv.style.display = 'block';
    board.style.backgroundColor = 'lightblue';
}

startButton.addEventListener('mousedown', setUpGame);
startButton.addEventListener('touchstart', setUpGame);

resetButton.addEventListener('mousedown', resetGame);
resetButton.addEventListener('touchstart', resetGame);

board.addEventListener('mousedown', clickedGameBoard);
board.addEventListener('touchstart', clickedGameBoard);

function showResetButton(text = '') {
    resetButton.style.display = 'block';

    if (text) resetButton.textContent = text;
}

function hideResetButton(text = '') {
    resetButton.style.display = 'none';

    if (text) resetButton.textContent = text;
}

function ding() {
    const audioPlayer = document.createElement('audio');
    audioPlayer.setAttribute('src', 'ding.mp3');
    audioPlayer.setAttribute('autoplay', 'autoplay');
    return audioPlayer;
}

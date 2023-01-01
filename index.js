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

// D3 initialization
// set the dimensions and margins of the graph
// var margin = {top: 10, right: 30, bottom: 30, left: 50},
// width = 460 - margin.left - margin.right,
// height = 400 - margin.top - margin.bottom;
// append the svg object to the body of the page
// var svg = d3.select("#my_dataviz")
// .append("svg")
// .attr("width", width + margin.left + margin.right)
// .attr("height", height + margin.top + margin.bottom)
// .append("g")
// .attr("transform",
//     "translate(" + margin.left + "," + margin.top + ")");

function getRandomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
}

function getRandomTickRate() {
    return possibleTickRates[Math.floor(Math.random() * possibleTickRates.length)];
}

function changeBoardColor() {
    startDate = 0;
    endDate = 0;
    
    changeBoardColorIntervalID = setInterval(() => {
        score = 0;

        if (hasClickedGreen || hasNotClickedGreen) {
            clearInterval(changeBoardColorIntervalID);
        }

        if (gameStarted) {
            let randomColor = getRandomColor();

            genreatedColors.push(randomColor);

            if (genreatedColors.length === 1 && isBoardGreen()) {
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

            if (isBoardGreen()) {
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


function isBoardGreen() {
    return board.style.backgroundColor === 'green';
}

function setUpGame(event) {
    event.stopImmediatePropagation();
    gameStarted = true;
    changeBoardColor();
    toggleResetButton(false);
    toggleStartButton(false);
    toggleHeader(false);
    toggleDirections(false);
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
            
            scoreList.push([{date: moment().format('YYYY-MM-DD')}, {value: score}]);

            // append score to score list if list is less than 5 items
            if (scoreList.length < 5) {
                toggleResetButton(true);
                const scoreListItem = document.createElement('li');
                scoreListItem.textContent = `${scoreList.length}: ${Math.round(score)} ms`;
                scoreListDiv.appendChild(scoreListItem);
            }
            console.log(scoreList)

            // if score list is 5 items, calculate average score and display it
            if (scoreList.length === 5) {
                toggleResetButton(true, 'Reset');
                const averageScore = scoreList.reduce((acc, curr) => acc + curr[1].value, 0) / scoreList.length;
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
            toggleResetButton(true);
            hasNotClickedGreen = true;
            evalDiv.textContent = `You did not click green. Please try again. However, your reaction time from the last color to the one you clicked was ${Math.round(score)} ms!`;
            evalDiv.style.color = 'white';
        }

        // setupD3LineChart(scoreList);
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
        toggleResetButton(false);
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

function toggleStartButton(shouldShow) {
    if (shouldShow) {
        startButton.style.display = 'block';
    } else {
        startButton.style.display = 'none';
    }
}

function toggleHeader(shouldShow) {
    if (shouldShow) {
        headerDiv.style.display = 'block';
    } else {
        headerDiv.style.display = 'none';
    }
}

function toggleDirections(shouldShow) {
    if (shouldShow) {
        directionsDiv.style.display = 'block';
    } else {
        directionsDiv.style.display = 'none';
    }
}

function toggleResetButton(shouldShow, text = 'Try again') {
    if (shouldShow) {
        resetButton.style.display = 'block';
    } else {
        resetButton.style.display = 'none';
    }

    if (text) resetButton.textContent = text;
}

function ding() {
    const audioPlayer = document.createElement('audio');
    audioPlayer.setAttribute('src', 'ding.mp3');
    audioPlayer.setAttribute('autoplay', 'autoplay');
    return audioPlayer;
}

startButton.addEventListener('mousedown', setUpGame);
startButton.addEventListener('touchstart', setUpGame);

resetButton.addEventListener('mousedown', resetGame);
resetButton.addEventListener('touchstart', resetGame);

board.addEventListener('mousedown', clickedGameBoard);
board.addEventListener('touchstart', clickedGameBoard);

// function setupD3LineChart(data = []) {
//     // Keep only the 90 first rows
//     // data = data.filter(function(d,i){ return i<90})

//     // Add X axis --> it is a date format
//     var x = d3.scaleTime()
//     .domain(d3.extent(data, function(d) { return d.date; }))
//     .range([ 0, width ]);
//     svg.append("g")
//     .attr("transform", "translate(0," + (height+5) + ")")
//     .call(d3.axisBottom(x).ticks(5).tickSizeOuter(0));

//     // Add Y axis
//     var y = d3.scaleLinear()
//     .domain( d3.extent(data, function(d) { return +d.value; }) )
//     .range([ height, 0 ]);
//     svg.append("g")
//     .attr("transform", "translate(-5,0)")
//     .call(d3.axisLeft(y).tickSizeOuter(0));

//     // Add the area
//     svg.append("path")
//     .datum(data)
//     .attr("fill", "#69b3a2")
//     .attr("fill-opacity", .3)
//     .attr("stroke", "none")
//     .attr("d", d3.area()
//         .x(function(d) { return x(d.date) })
//         .y0( height )
//         .y1(function(d) { return y(d.value) })
//         )

//     // Add the line
//     svg.append("path")
//     .datum(data)
//     .attr("fill", "none")
//     .attr("stroke", "#69b3a2")
//     .attr("stroke-width", 4)
//     .attr("d", d3.line()
//         .x(function(d) { return x(d.date) })
//         .y(function(d) { return y(d.value) })
//         )

//     // Add the line
//     svg.selectAll("myCircles")
//     .data(data)
//     .enter()
//     .append("circle")
//         .attr("fill", "red")
//         .attr("stroke", "none")
//         .attr("cx", function(d) { return x(d.date) })
//         .attr("cy", function(d) { return y(d.value) })
//         .attr("r", 3)
// }

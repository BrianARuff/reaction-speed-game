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
// Instead of cycling through random colors on a predictable interval, mimic
// Human Benchmark's behavior by waiting a random amount of time before
// switching to the target color.
const minDelay = 2000; // 2 seconds
const maxDelay = 5000; // 5 seconds
let timeoutID = null;
let score = 0;
let waitingForGreen = false;
let gameStarted = false;
let hasClickedGreen = false;
let hasNotClickedGreen = false;
let scoreList = [];
let startTime = null;
let endTime = null;

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

function scheduleGreen() {
    // Ensure any previous timer is cleared
    if (timeoutID) clearTimeout(timeoutID);

    score = 0;
    startTime = 0;
    endTime = 0;

    const delay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
    waitingForGreen = true;
    board.style.backgroundColor = 'red';

    timeoutID = setTimeout(() => {
        board.style.backgroundColor = 'green';
        // record the start time after the paint for better accuracy
        requestAnimationFrame(() => {
            startTime = performance.now();
            waitingForGreen = false;
            ding().play();
        });
    }, delay);
}


function isBoardGreen() {
    return board.style.backgroundColor === 'green';
}

function setUpGame(event) {
    event.stopImmediatePropagation();
    gameStarted = true;
    toggleResetButton(false);
    toggleStartButton(false);
    toggleHeader(false);
    toggleDirections(false);
    scheduleGreen();
}

function clickedGameBoard(event) {
    event.stopImmediatePropagation();

    if (waitingForGreen) {
        // clicked before green appeared
        clearTimeout(timeoutID);
        waitingForGreen = false;
        gameStarted = false;
        hasNotClickedGreen = true;
        evalDiv.textContent = 'Too soon! Please try again.';
        toggleResetButton(true);
        board.style.backgroundColor = 'lightblue';
        return;
    }

    if (gameStarted && isBoardGreen()) {
        endTime = performance.now();
        score = endTime - startTime;
        gameStarted = false;
        hasClickedGreen = true;
            
        evalDiv.textContent = `Congrats! You clicked on the green color. Your reaction time is ${Math.round(score)} ms!`;

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
        toggleResetButton(true);
    }
}

function resetGame(event) {
    event.stopImmediatePropagation();


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

    // reset game state
    if (timeoutID) {
        clearTimeout(timeoutID);
        timeoutID = null;
    }
    waitingForGreen = false;
    score = 0;
    endTime = 0;
    startTime = 0;
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

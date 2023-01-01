<h1>The Reaction Speed Game</h1>

<h2><u>How to Play</u></h2>
<ol>
    <li>Click start</li>
    <li>The goal is the click when the board is green, but you can click between any two colors.</li>
    <li>When the green area loads, a "ding" sound should play. This was implemented to replicate a game's sound cues. You can compare purely sound reaction speed versus purely visual reaction speed, if you want.</li>
    <li>When you click the green area, it will add that reaction time to a list that is shown above the reaction click area.</li>
    <li>After clicking the green area five times, you should see your reaction time average over the past five tries. After clicking reset again, your average is reset.</li>
</ol>

<p><a href="https://lighthearted-pastelito-14d999.netlify.app/">Play Game</a></p>

<h2><u>Potential Future Update Notes</u></h2>
<ul>
    <li>Line chart of attemtps</li>
</ul>

<h2><u>The Algorithm Used to get Reaction Speed</u></h2>
<p>Your score should be accurate because the algorithm is that every time a new color is generated, a start date object is created, and when you click the board, an end date object is made, and then I simply get the difference between the two dates and display it in milliseconds. This works much better than relying on setInterval/setTimeout/requestAnimationFrame as those methods are not 100% consistent.</p>

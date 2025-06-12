<h1>The Reaction Speed Game</h1>

<h2><u>Motivation for Making This</u></h2>
<p>I made a quick little game to measure you reaction speed. The point is the wait for the screen to be green and when it is, click it as fast as possible, once you do so, you'll get a score. If you repeat this process five times, you'll get your average score over the past five attempts (while showing each attempt's score along the way). I chose to do this on a "random" color because that matches real games and real life better than waiting on a screen to swap to a single other color like on <a href="https://humanbenchmark.com/tests/reactiontime">humanbenchmark.com</a>. I did make it so that it plays a "ding" sound when the green screen show so that you can compare pure sound reaction time versus sound and visual reaction time, or if you mute your sound, you can also compare against purely visual too.</p>

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
    <li>Line chart of attempts</li>
    <li>User accounts - Doing this allows for many more features like tracking reaction speed over a longer period of time.</li>
</ul>

<h2><u>The Algorithm Used to get Reaction Speed</u></h2>
<p>Your score should be accurate because the algorithm is that every time a new color is generated, a start time is recorded using the browser's <code>performance.now()</code> API, and when you click the board we capture another timestamp. The difference between these high&#x2011;resolution times is displayed in milliseconds, providing more precise results than the older <code>Date</code> approach.</p>

<h2><u>How this App Looks</u></h2>
<p>This app may look "ugly" to some as I'm not a designer, but this isn't about making it look good, it's about the core functionality.</p>

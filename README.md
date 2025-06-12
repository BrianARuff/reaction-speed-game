<h1>The Reaction Speed Game</h1>

<h2><u>Motivation for Making This</u></h2>
<p>I made a quick little game to measure your reaction speed. Wait for the screen to turn green and click as fast as possible. The board turns green after a random delay between two and five seconds, similar to <a href="https://humanbenchmark.com/tests/reactiontime">humanbenchmark.com</a>. A "ding" plays when the green screen shows so you can compare sound versus purely visual reaction times.</p>

<h2><u>How to Play</u></h2>
<ol>
    <li>Click start</li>
    <li>The board will turn red. Wait for it to switch to green.</li>
    <li>A "ding" sound will play when the screen turns green so you can compare reacting to audio versus visual cues.</li>
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
<p>Your score is measured using the browser's <code>performance.now()</code> API. When you press start a random delay between two and five seconds is scheduled. Once the board turns green we record the start time on the next animation frame so the timer begins only after the color is visible. When you click, we capture another timestamp and display the difference in milliseconds.</p>

<h2><u>How this App Looks</u></h2>
<p>This app may look "ugly" to some as I'm not a designer, but this isn't about making it look good, it's about the core functionality.</p>

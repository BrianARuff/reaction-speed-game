<h1>reaction-speed-game</h1>

<ol>
    <li>Click start</li>
    <li>The goal is the click when the board is green, but you can click between any two colors.</li>
    <li>When the green area loads, a "ding" sound should play. This was implemented to replicate a game's sound cues. You can compare purely sound reaction speed versus purely visual reaction speed, if you want.</li>
    <li>When you click the green area, it will add that reaction time to a list that is shown above the reaction click area.</li>
    <li>After clicking the green area five times, you should see your reaction time average over the past five tries. After clicking reset again, your average is reset.</li>
</ol>

<p><a href="https://lighthearted-pastelito-14d999.netlify.app/">Play Game</a></p>

<h2><u>Potential Future Update Notes</u></h2>

<p>Note that the timer may not be 100% accurate and may slightly vary from attempt to attempt, so with that in mind, I have future plans to use a more accurte timer. I like the timer logic posted on this SO post (https://stackoverflow.com/questions/29971898/how-to-create-an-accurate-timer-in-javascript), which was answered by Leon Williams on June 2, 2017. I plan on creating a backend at some point in the future to keep track of everyone's attempts. I also want to add a graph feature for your current five attempts, and also a graph for a user's entire time, which means user accounts and pulling their reaction speed data into a database when it's requested.</p>

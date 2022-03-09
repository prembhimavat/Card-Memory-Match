
var em = ["💐","🌹","🌻","🏵️","🌺","🌴","🌈","🍓","🍒","🍎","🍉","🍊","🥭","🍍","🍋","🍏","🍐","🥝","🍇","🥥","🍅","🌶️","🍄","🧅","🥦","🥑","🍔","🍕","🧁","🎂","🍬","🍩","🍫","🎈"];
var length = 0;
//Shuffling above array
var tmp, c, p = em.length;
if(p) while(--p) {
c = Math.floor(Math.random() * (p + 1));
tmp = em[c];
em[c] = em[p];
em[p] = tmp;
}

//Variables
var pre="", pID, ppID=0, turn=0, t="transform", flip="rotateY(180deg)", flipBack="rotateY(0deg)", time, mode;

//Resizing Screen
window.onresize = init;
function init() {
W = innerWidth;
H = innerHeight;
$('body').height(H+"px");
$('#ol').height(H+"px");
}

//Showing instructions
window.onload = function() {
$("#ol").html(`<center><div id="inst"><h3>Welcome !</h3>Instructions For Game<br/><br/><li>Make pairs of similiar blocks by flipping them.</li><li>To flip a block you can click on it.</li><li>If two blocks you clicked are not similar, they will be flipped back.</li><li>Top 5 best players from each mode will be displayed on Leaderboard.</li><p style="font-size:18px;">Click one of the following mode to start the game.</p></div ><button class="easy" onclick="start(3, 4);">Easy</button> <button class="medium" onclick="start(4, 5);">Medium</button><button class="hard" onclick="start(6, 6);">Hard</button><button class="font-effect-fire-animation"><a href="/leaderboard">LeaderBoard</a></button></center>`);
}

//Button Sounds
var pauseAudio = new Audio("sound/pauseSoundEffect.mp3");


//Starting the game
function start(r,l) {
//Timer and moves
length = l;
min=0; sec=0; moves=0;
$("#time").html("Time: 00:00");
$("#moves").html("Moves: 0");

var timer = function() {

sec++;
if(sec==60) {
min++; sec=0;
}
if(sec<10) 
$("#time").html("Time: 0"+min+":0"+sec);
else 
$("#time").html("Time: 0"+min+":"+sec);

};

var time = setInterval(timer,1000);

$("#pause").click(function(){
pauseAudio.play();
$("#pause").html(`<i class="fas fa-play"></i>`);  
clearInterval(time);
pauseLeaderBoard();
$("#ol").fadeIn(700);


$(".play").click(function(){
$("#ol").fadeOut(700);
time = setInterval(timer,1000);
$("#pause").html(`<i class="fas fa-pause"></i>`);
});

});

$("#reset").click(function(){
min = 0;
sec = -1;
moves = 0;
reStart(r,l);
});


rem=r*l/2, noItems=rem;
mode = r+"x"+l;
//Generating item array and shuffling it
var items = [];
for (var i=0;i<noItems;i++)
items.push(em[i]);
for (var i=0;i<noItems;i++)
items.push(em[i]);
var tmp, c, p = items.length;
if(p) while(--p) {
c = Math.floor(Math.random() * (p + 1));
tmp = items[c];
items[c] = items[p];
items[p] = tmp;
}
findItems = [...items];
//Creating table
$(".tablerow").html("");
var n=1;
for (var i = 1;i<=r;i++) {
$(".tablerow").append("<tr>");
for (var j = 1;j<=l;j++) {
$(".tablerow").append(`<td id='${n}' onclick="change(${n})"><div class='inner'><div class='front'></div><div class='back'><p>${items[n-1]}</p></div></div></td>`);
n++;

}
$(".tablerow").append("</tr>");
}
//Hiding instructions screen
$("#ol").fadeOut(500);
}


//pauseLeaderBoard
function pauseLeaderBoard(){
$("#ol").html(`<center><div id="inst1" class="playpause"><h1>Paused !</h1></div><button class="play">Resume</button><a href="/"><button class="play">Reset</button></a></center>`);    
clearInterval(time);
//<br/><table class = "leaderboardTable"><tr><th>Rank</th><th>Username</th><th>Moves</th><th>Time</th><th>Score</th></tr></table><br/>
}

//restarting game
function reStart(r,l){
$("#moves").html("Moves: 0");

$(".tablerow").fadeOut(250);

//setting rem to og value
rem=r*l/2, noItems=rem;

//shuffling array
var items = [];
for (var i=0;i<noItems;i++)
items.push(em[i]);
for (var i=0;i<noItems;i++)
items.push(em[i]);
var tmp, c, p = items.length;
if(p) while(--p) {
c = Math.floor(Math.random() * (p + 1));
tmp = items[c];
items[c] = items[p];
items[p] = tmp;
}

//Creating table
$(".tablerow").html("");
var n=1;
for (var i = 1;i<=r;i++) {
$(".tablerow").append("<tr>");
for (var j = 1;j<=l;j++) {
$(".tablerow").append(`<td id='${n}' onclick="change(${n})"><div class='inner'><div class='front'></div><div class='back'><p>${items[n-1]}</p></div></div></td>`);
n++;

}
$(".tablerow").append("</tr>");
}
moves = 0;
$(".tablerow").fadeIn(250);
}

var locked = false;
//Function for flipping blocks
function change(x) {
//Variables
let i = "#"+x+" .inner";
let f = "#"+x+" .inner .front";
let b = "#"+x+" .inner .back";

//Dont flip for these conditions
if (turn==2 || $(i).attr("flip")=="block" || ppID==x || locked == true) {}

//Flip
else {
if(!locked){
$(i).css(t, flip);
}
if (turn==1) {
//This value will prevent spam clicking
turn=2; 

//If both flipped blocks are not same
if (pre!=$(b).text()) {
locked = true;
setTimeout(function() {
locked = false;
$(pID).css(t, flipBack);
$(i).css(t, flipBack);
ppID=0;
//locked == false;
},1000);
}

//If blocks flipped are same
else {
rem--;
console.log(rem);
$(i).attr("flip", "block");
$(pID).attr("flip", "block");
}

setTimeout(function() {
turn=0;
//Increase moves
moves++;
$("#moves").html("Moves: "+moves);
},500);

}
else {
pre = $(b).text();
ppID = x;
pID = "#"+x+" .inner";
turn=1;
}

//If all pairs are matched
if (rem==0) {
clearInterval(time);
if (min==0) {
time = `${sec} seconds`;
conversion = sec*100;
calculation = 50000 * 100/conversion;
calculation1 = calculation/moves;
calculation1 += 150;
score = (calculation1 | 0);
}
else {
time = `${min} minute(s) and ${sec} second(s)`;
conversion = min*60 + sec;
conversion1 = conversion*100;
calculation = 50000 * 100/conversion1;
calculation1 = calculation/moves;
calculation1 += 150;
score = (calculation1 | 0);
}
setTimeout(function() {
$("#ol").html(`<center><div id="ol"><h1 class="youWin" style="font-size:60px;">You Win!</h1><p style="font-size:30px;">Moves : ${moves} </p><p style="font-size:30px;"> Time : ${time}.</p> <p style="font-size:30px;">Score : ${score}</p> <form action="/" method="post"> <label style="font-size:30px">Enter Leaderboard : </label> <input type="text" name="username" placeholder="Username" maxlength="15" autocomplete="off"></input><input type="text" style="display:none" name="score" value=${score}><input type="text" style="display:none" name="moves" value=${moves}><input type="text" style="display:none" name="min" value=${min}><input type="text" style="display:none" name="sec" value=${sec}><input type="text" style="display:none" name="mode" value=${length}><button class="go" type="submit">GO</button></form><br/><button class="playagain"><a href="/">Play Again ?</a></button></center>`);
$("#ol").fadeIn(750);
}, 1500);
}
}
}

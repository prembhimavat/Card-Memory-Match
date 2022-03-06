
const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/LeadBoard");
var conn = mongoose.connection;
conn.on('connected', function() {
    console.log('database is connected successfully');
});
conn.on('disconnected',function(){
    console.log('database is disconnected successfully');
})
conn.on('error', console.error.bind(console, 'connection error:'));
module.exports = conn;

app.get("/", function(req, res) {
    res.sendFile(__dirname+"/index.html");
});

const leaderBoardSchema = {
  username: String,
  userscore: String,
  usermoves: String,
  usertime: String,
  userMode: String
};

const leaderBoard = mongoose.model("leaderBoard", leaderBoardSchema);


app.post("/",function(req,res){
  if(req.body.username){
  const userScore = new leaderBoard({
    username: req.body.username,
    userscore: Number(req.body.score),
    usermoves: req.body.moves,
    usertime: req.body.min + " : " + req.body.sec,
    userMode: req.body.mode
  });
  userScore.save(function(err){
    if(!err){
      res.redirect("/");
    }
  });
  }
  else{
    res.redirect("/");
  }
});

app.get("/leaderboard", function(req,res){
  leaderBoard.find({userMode:4}, function(err, element){
    res.render("leaderboard",{
      leaderboards : element
    });
  }).sort({userscore:-1}).limit(5);
})

app.get("/mediumleaderboard", function(req,res){
  leaderBoard.find({userMode:5}, function(err, element){
    res.render("mediumleaderboard",{
      leaderboards : element
    });
  }).sort({userscore:-1}).limit(5);
});

app.get("/hardleaderboard", function(req,res){
  leaderBoard.find({userMode:6}, function(err, element){
    res.render("hardleaderboard",{
      leaderboards : element
    });
  }).sort({userscore:-1}).limit(5);
})
  
app.listen(process.env.PORT || 3000, function() {
    console.log("Server started on port 3000");
  });

_           = require('underscore');
azure       = require('azure')
fileSystem  = require('fs');
path        = require('path');
app         = require('express.io')()
nconf       = require('nconf')

app.http().io()
port = process.env.PORT || 2014

app.io.route('bigup!', function(req) {
    console.log("sending a big up to <" +req.data.userid+ ">");
    bigUpUser(req.data.userid)
})

app.io.route('login', function(req) {
  userid = req.data.userid;
  geotag = req.data.geo;
  console.log("joining bigup channel room for tag <"+geotag+">")
  req.io.join(getSubscriberOnlyRoom(geotag))
})

app.io.route('logout', function(req) {
  console.log("no more big ups for <"+req.data.userid+">")
  req.io.leave(getSubscriberOnlyRoom(req.data.geotag))
})

app.io.route('getBigUpInfo', function(req){
  req.io.emit('bigupInfo', getBigUpInfoForUser(req.data.userid))
})

// websocket route/event for getting leaderboard
app.io.route('getLeaderBoard', function(req){
  console.log("sending leaderboard")
  req.io.emit('leaderBoard', _.first(getLeaderBoard(), 10))
})

app.get('/bigups/:userid', function(req, res){
  res.json({bigupInfo: getBigUpInfoForUser(req.params.userid)})
})


app.get('/', function(req, res) {
    res.sendfile(__dirname + '/index.html')
})


app.get('/leaderboard', function(req, res) {
    res.sendfile(__dirname + '/leaderboard.html')
})

app.listen(port)

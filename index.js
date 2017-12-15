'use strict'
//import dependencies
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var User = require('./models/Users');
var CodeChallenge = require('./models/CodeChallenges');
var Lobby = require('./models/Lobbies');

//create instances
var app = express();
mongoose.connect('mongodb://poop:poop@ds113826.mlab.com:13826/final-project-db');
var router = express.Router();

//set port
var port = process.env.API_PORT || 3001;

//bodyParser and look for JSON data in the request body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//CORS
app.use(function(req, res, next) {
 res.setHeader('Access-Control-Allow-Origin', '*');
 res.setHeader('Access-Control-Allow-Credentials', 'true');
 res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
 res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');

//remove cacheing
 res.setHeader('Cache-Control', 'no-cache');
 next();
});

app.put('/lobbies/:lobby_id', function(req, res) {
  console.log("Hitting lobbies")
  Lobby.findById(req.params.lobby_id, function(err, lobby) {
    if (err) {
      res.send(err);
    }
    (req.body.title) ? lobby.title = req.body.title : null;
    if (req.body.participants) {
      lobby.participants = req.body.participants
    }

    lobby.save(function(err) {
      if (err) {
        res.send(err);
      }
      res.json({ message: 'Lobby has been updated' });
    });
  });
})

//set root path
router.get('/', function(req, res) {
 res.json({ message: 'API Initialized!'});
});

//add challenges route
router.route('/challenges')

//retrieve all challenges from the database
.get(function(req, res) {
  CodeChallenge.find(function(err, codeChallenges) {
    if (err)
    res.send(err);
    res.json(codeChallenges)
  });
})

//post challenge to database
.post(function(req, res) {
  var codeChallenge = new CodeChallenge();
  codeChallenge.sample = req.body.sample;
  codeChallenge.content = req.body.content;
  codeChallenge.answer = req.body.answer;
  codeChallenge.difficulty = req.body.difficulty
  codeChallenge.save(function(err) {
  if (err)
    res.send(err);
    res.json({ message: 'Challenge successfully added!' });
  });
});

//add users route
router.route('/users')

//retrieve all users from the database
.get(function(req, res) {
 //looks at our User Schema
 User.find(function(err, users) {
   if (err)
     res.send(err);
     res.json(users)
   });
 })

 //post new user to the database
 .post(function(req, res) {
   var user = new User();
   user.name = req.body.name;
   user.completedChallenges = req.body.completedChallenges;
   user.save(function(err) {
     if (err)
       res.send(err);
       res.json({ message: 'User successfully added!' });
   });
 });

//Use router config when call /api
app.use('/api', router);

//start server and listen for requests
app.listen(port, function() {
 console.log(`api running on port ${port}`);
});

'use strict'
//first we import our dependencies…
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var User = require('./models/Users');
var CodeChallenge = require('./models/CodeChallenges');

//and create our instances
var app = express();
var router = express.Router();

//set our port to either a predetermined port number if you have set
//it up, or 3001
var port = process.env.API_PORT || 3001;

//now we should configure the API to use bodyParser and look for
//JSON data in the request body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//To prevent errors from Cross Origin Resource Sharing, we will set
//our headers to allow CORS with middleware like so:
app.use(function(req, res, next) {
 res.setHeader('Access-Control-Allow-Origin', '*');
 res.setHeader('Access-Control-Allow-Credentials', 'true');
 res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
 res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');

//and remove cacheing so we get the most recent users
 res.setHeader('Cache-Control', 'no-cache');
 next();
});

//now we can set the route path & initialize the API
router.get('/', function(req, res) {
 res.json({ message: 'API Initialized!'});
});

//adding the /users route to our /api router
router.route('/challenges')
//retrieve all users from the database
.get(function(req, res) {

//looks at our User Schema
CodeChallenge.find(function(err, codeChallenges) {
if (err)
res.send(err);

//responds with a json object of our database users.
res.json(codeChallenges)
});
})

.post(function(req, res) {
var codeChallenge = new CodeChallenge();

//body parser lets us use the req.body
codeChallenge.title = req.body.title;
codeChallenge.difficulty = req.body.difficulty;
codeChallenge.description = req.body.description;
codeChallenge.content = req.body.content;
codeChallenge.answer = req.body.answer;
codeChallenge.save(function(err) {
if (err)
res.send(err);
res.json({ message: 'Challenge successfully added!' });
});
});

router.route('/users')


 //retrieve all users from the database
 .get(function(req, res) {

 //looks at our User Schema
 User.find(function(err, users) {
 if (err)
 res.send(err);

 //responds with a json object of our database users.
 res.json(users)
 });
 })

 //post new user to the database
 .post(function(req, res) {
 var user = new User();

 //body parser lets us use the req.body
 user.name = req.body.name;
user.save(function(err) {
 if (err)
 res.send(err);
 res.json({ message: 'User successfully added!' });
 });
 });


//Use our router configuration when we call /api
app.use('/api', router);

//starts the server and listens for requests
app.listen(port, function() {
 console.log(`api running on port ${port}`);
});

//db config
mongoose.connect('mongodb://poop:poop@ds113826.mlab.com:13826/final-project-db');

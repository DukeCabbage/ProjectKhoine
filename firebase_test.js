const domain = "localhost";
const port = "8081";
const express = require("express");
const bodyParser = require('body-parser');

const firebase_endpoint = "https://project-khoine.firebaseio.com/";
const firebase = require("firebase");
// Initialize the app with a service account, granting admin privileges
firebase.initializeApp({
  serviceAccount: "./serviceAccountCredentials.json",
  databaseURL: "https://project-khoine.firebaseio.com/",
  databaseAuthVariableOverride: {
    uid: "my-service-worker"
  }
});

// As an admin, the app has access to read and write all data, regardless of Security Rules
var db = firebase.database();
var ref = db.ref("/");
var usersRef = ref.child("users");
var counterRef = ref.child("counter");


var app = express();
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.put('/push_firebase', (req, res) => {
    console.log(req.body);
    // console.log(JSON.parse(req.body));
    // res.setHeader("Content-Type", "application/json");
    usersRef.update(req.body);

    // var ex = usersRef.child("key3");
    // ex.set("val434");

    res.end("Recieved");
});


var NanoTimer = require("NanoTimer");
var timer = new NanoTimer();

var toUpdate = true;

var timedUpdate = () => {
    console.log("tick");
    if (toUpdate) {
        counterRef.push({name : "Leo"});
    }
};

app.get('/update_on', (req, res) => {
    timer.clearInterval();
    timer.setInterval(timedUpdate, "", "2s");
    res.end();
});

app.get('/update_off', (req, res) => {
    timer.clearInterval();
    res.end();
});

var server = app.listen(port, domain, () => {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Server started on http://%s:%s", host, port);
});

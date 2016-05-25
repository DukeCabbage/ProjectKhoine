const domain = "localhost";
const port = "8081";
const express = require("express");

const firebase_endpoint = "https://project-khoine.firebaseio.com/";
const firebase = require("firebase");
// Initialize the app with a service account, granting admin privileges
firebase.initializeApp({
  serviceAccount: "./serviceAccountCredentials.json",
  databaseURL: "https://project-khoine.firebaseio.com/"
});

// As an admin, the app has access to read and write all data, regardless of Security Rules
var db = firebase.database();
var ref = db.ref("/");
ref.on("child_added", function(snapshot) {
  console.log(snapshot.val());
});

var app = express();
var server = app.listen(port, domain, () => {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Server started on http://%s:%s", host, port);
});

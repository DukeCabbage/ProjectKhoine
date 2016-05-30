const domain = "localhost";
const port = "8082";
const express = require("express");
const bodyParser = require('body-parser');

const firebase = require("firebase");
const firebase_endpoint = "https://project-khoine.firebaseio.com/";

// Initialize the app with a service account, granting admin privileges
firebase.initializeApp({
  serviceAccount: "./serviceAccountCredentials.json",
  databaseURL: firebase_endpoint,
  databaseAuthVariableOverride: {
    uid: "my-service-worker"
  }
});

// As an admin, the app has access to read and write all data, regardless of Security Rules
var db = firebase.database();
var resortSitesRef = db.ref("/resort_sites");

var app = express();
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

var timeLogger = (req, res, next) => {
    var currentdate = new Date();
    var datetime = "Time: " + (currentdate.getMonth()+1) + "/"
                + currentdate.getDate() + "@ "
                + currentdate.getHours() + ":"
                + currentdate.getMinutes() + ":"
                + currentdate.getSeconds();
    console.log(datetime);
    next();
};

var nameValidator = function(req, res, next) {
    var identifier = req.params.identifier;
    if (/[^a-zA-Z]/.test(identifier)) {
        console.log("Invallid identifier: " + identifier);
        res.status(400).send("Invalid identifier");
    } else {
        next();
    }
};

app.use("/resort_sites", timeLogger);
app.use("/resort_sites/:identifier", nameValidator);

app.post("/resort_sites/:identifier", function(req, res) {
    var identifier = req.params.identifier.toLowerCase();
    console.log("Post: ", identifier);

    resortSitesRef.child(identifier).once("value", (snapshot) => {
        if (snapshot.exists()) {
            console.log("Resort site already exsits");
            res.status(409).send("Resort site already exsits");
        } else {
            resortSitesRef.child(identifier).set(req.body, (error) => {
                if (error) {
                    console.log("Failed to add new site to firebase");
                    console.log(error);
                    res.status(500).send(error);
                } else {
                    console.log("Successfully added new site");
                    res.status(201).end();
                }
            });
        }
    });
});

app.get("/resort_sites/:identifier", (req, res) => {
    var identifier = req.params.identifier.toLowerCase();
    console.log("Get: ", identifier);

    resortSitesRef.child(identifier).once("value", (snapshot) => {
        if (snapshot.exists()) {
            console.log(snapshot.val());
            res.setHeader("Content-Type", "application/json");
            res.status(200).send(snapshot.val());
        } else {
            console.log("No resort found");
            res.status(404).end();
        }
    });
});

app.get("/resort_sites", (req, res) => {
    console.log("Get all");
    resortSitesRef.once("value", (snapshot) => {
        if (snapshot.exists()) {
            console.log(snapshot.val());
            res.setHeader("Content-Type", "application/json");
            res.status(200).send(snapshot.val());
        } else {
            console.log("No resorts found");
            res.status(404).end();
        }
    });
});

app.put("/resort_sites/:identifier", (req, res) => {
    var identifier = req.params.identifier.toLowerCase();
    console.log("Put: ", identifier);

    resortSitesRef.child(identifier).once("value", (snapshot) => {
        if (!snapshot.exists()) {
            console.log("Resort site doesn't exsit");
            res.status(404).send("Resort site doesn't exsit");
        } else {
            resortSitesRef.child(identifier).update(req.body, (error) => {
                if (error) {
                    console.log("Failed to update site to firebase");
                    console.log(error);
                    res.status(500).send(error);
                } else {
                    console.log("Successfully updated site");
                    res.status(200).end();
                }
            });
        }
    });
});

app.delete("/resort_sites/:identifier", (req, res) => {
    var identifier = req.params.identifier.toLowerCase();
    console.log("Delete: ", identifier);

    resortSitesRef.child(identifier).once("value", (snapshot) => {
        if (!snapshot.exists()) {
            console.log("Resort site doesn't exsit");
            res.status(404).send("Resort site doesn't exsit");
        } else {
            resortSitesRef.child(identifier).set(null, (error) => {
                if (error) {
                    console.log("Failed to delete site to firebase");
                    console.log(error);
                    res.status(500).send(error);
                } else {
                    console.log("Successfully deleted site");
                    res.status(200).end();
                }
            });
        }
    });
});

var server = app.listen(port, domain, () => {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Server started on http://%s:%s", host, port);
});

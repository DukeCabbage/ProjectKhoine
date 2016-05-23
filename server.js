const express = require("express");
const request = require("request");
const firebase = require("firebase");

const domain = "localhost";
const port = "8080";

var app = express();

app.get("/health-check", (req, res) => {
    console.log("Health check request received...");
    res.write("I'm alive!");
    res.end();
});

app.listen(port, domain, () => {
    console.log("Server started on " + domain + ":" + port);
});

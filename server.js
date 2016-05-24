const express = require("express");
const request = require("request");
const firebase = require("firebase");

const domain = "localhost";
const port = "8080";

const forecast_path = "https://api.forecast.io/forecast/";
const api_key = "f2778d0372266ff4099d2ee062db20bf";

const home_lat = 49.168625;
const home_lng = -123.142105;

const SUCCESS = 200;
const BAD_REQUEST = 400;
const INTERNAL_ERROR = 500;

var app = express();

app.get("/health-check", (req, res) => {
    console.log("Health check request received...");
    res.write("I'm alive!");
    res.end();
});

app.get("/test", (req, res) => {
    var lat = req.query.lat;
    var lng = req.query.lng;
    if (isNaN(lat) || isNaN(lng)) {
        res.status(BAD_REQUEST).send("Invalid latlng");
    } else {
        console.log("Fetching weather for %s, %s", lat, lng);
        var requestString = forecast_path + api_key + "/" + lat + "," + lng;
        requestString += "?exclude=[minutely, hourly, daily, flags]";
        request(requestString, (error, response, body) => {
            var defaultErrorStr = "Failed to fetch from forecase.io";
            if (typeof body === "string") {
                body = JSON.parse(body);
            }
            if (error || response.statusCode >= 400) {
                console.log(error || body);
                var code = body == null ? INTERNAL_ERROR : body["code"] || INTERNAL_ERROR;
                var errorStr = body == null ? defaultErrorStr : body["error"] || defaultErrorStr;
                res.status(code).send(errorStr);
            } else {
                res.status(SUCCESS).send(body);
            }
        });
    }
});

var server = app.listen(port, domain, () => {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Server started on http://%s:%s", host, port);
});

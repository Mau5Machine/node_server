var EventEmitter = require("events").EventEmitter;
var https = require("https");
var http = require("http");
var util = require("util");

/**
 * An EventEmitter to get a Treehouse students profile.
 * @param username
 * @constructor
 */

/* 
 ** ABOUT: This function handles the API
 **/
function Profile(username) {

    EventEmitter.call(this);

    profileEmitter = this;

    // Connect to the API URL (https://teamtreehouse.com/username.json)
    var request = https.get("https://teamtreehouse.com/" + username + ".json", function (response) {
        var body = "";

        // If the page is not OK
        if (response.statusCode !== 200) {
            // Abort
            request.abort();

            // Status Code Error
            profileEmitter.emit("error", new Error("There was an error getting the profile for " + username + ". (" + http.STATUS_CODES[response.statusCode] + ")"));
        }

        // Read the data
        response.on('data', function (chunk) {
            body += chunk;
            profileEmitter.emit("data", chunk);
        });

        response.on('end', function () {
            // If page is OK
            if (response.statusCode === 200) {
                try {
                    // Parse the data
                    var profile = JSON.parse(body);
                    profileEmitter.emit("end", profile);
                } catch (error) {
                    profileEmitter.emit("error", error);
                }
            }
        }).on("error", function (error) {
            profileEmitter.emit("error", error);
        });
    });
}

util.inherits(Profile, EventEmitter);

module.exports = Profile; // Export the Profile module
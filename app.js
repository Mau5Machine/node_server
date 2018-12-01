/* 
 ** ABOUT: Require the router file to handle the routes
 **/
var router = require("./router.js");
/* 
 ** Problem: Need a simple way to look at user's badge count, Js points from a browser
 ** Solution: Use nodeJs to perform profile lookups and serve templates with http 
 **/

/* 
 ** ABOUT: Require http for the server 
 **/
var http = require("http");

/*
 ** ABOUT: Create a web server 
 ** http createServer creates a server that listens on port 8000 
 **/
var server = http.createServer(function (req, res) {
    router.css(req, res); // Serve the CSS File(s)
    router.home(req, res); // Serve the Home Page
    router.user(req, res); // Serve the User Page
});
server.listen(8000); // Server listen on Port :8000

// Console server running
console.log("Server running at http://127.0.0.1:8000/");
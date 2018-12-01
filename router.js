var Profile = require("./profile.js"); // Require the profile file
var renderer = require("./renderer.js"); // Require the renderer file
var querystring = require("querystring"); // Require the querystring module
//  Need to require the file system module
var fs = require("fs");

// Variable to hold common headers throughout the routing process
var commonHeaders = {
    "Content-Type": "text/html"
};

function css(request, response) {
    // If css file is found
    if (request.url.indexOf(".css") !== -1) {
        var file = fs.readFileSync(`.${request.url}`, {
            'encoding': 'utf8'
        });
        response.writeHead(200, {
            'Content-Type': 'text/css'
        });
        response.write(file);
        response.end();
    }
}

/* 
 ** ABOUT: Handle HTTP route GET / and POST / i.e. Home 
 **/
function home(request, response) {
    // if url == "/" && GET
    if (request.url === "/") {
        if (request.method.toLowerCase() === "get") {
            // show search
            response.writeHead(200, commonHeaders);
            //function view(templateName, values, response)
            renderer.view("header", {}, response);
            renderer.view("search", {}, response);
            renderer.view("footer", {}, response);
            response.end();
        } else { // if url === "/" && POST

            // get the post data from body
            request.on("data", function (postBody) {
                // extract the username
                var query = querystring.parse(postBody.toString());

                // redirect to /:username
                response.writeHead(303, {
                    "Location": "/" + query.username
                });
                response.end();
            });
        }
    }
}

/* 
 ** ABOUT:Handle HTTP route for GET / :username i.e. /christianmartins2 
 **/
function user(request, response) {
    // if url == "/...."
    var username = request.url.replace("/", "");
    if (username.length > 0 && request.url.indexOf('.css') === -1) {
        response.writeHead(200, commonHeaders);
        renderer.view("header", {}, response);

        /* 
         ** ABOUT: get json data from the profile 
         **/
        var studentProfile = new Profile(username);

        // on "end"
        studentProfile.on("end", function (profileJSON) {
            // show profile
            // Store the values that we need
            var values = {
                avatarUrl: profileJSON.gravatar_url,
                username: profileJSON.profile_name,
                badges: profileJSON.badges.length,
                javascriptPoints: profileJSON.points.JavaScript
            }
            // Simple response
            renderer.view("profile", values, response);
            renderer.view("footer", {}, response);
            response.end();
        });

        // on "error"
        studentProfile.on("error", function (error) {
            // show error
            renderer.view("error", {
                errorMessage: error.message
            }, response);
            renderer.view("search", {}, response);
            renderer.view("footer", {}, response);
            response.end();
        });

    }
}

/* 
 ** ABOUT: Export the home, route, and css modules
 **/
module.exports.home = home;
module.exports.user = user;
module.exports.css = css;
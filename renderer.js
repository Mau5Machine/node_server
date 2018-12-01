/* 
 ** ABOUT: This file renders the HTML pages and writes to response
 */

//  Need to require the file system module
var fs = require("fs");

/* 
 ** ABOUT: This function merges the values from the API to the HTML Documents
 **/
function mergeValues(values, content) {
    // Cycle over they keys
    for (var key in values) {
        // Replace all {{key}} with the value from the values object
        content = content.replace("{{" + key + "}}", values[key]);
    }

    // return merged content
    return content;
}

/* 
 ** ABOUT: This function handles the templates and uses the readFile method
 ** to render the values to the response
 **/
function view(templateName, values, response) {
    // Read from the template files
    var fileContents = fs.readFileSync("./views/" + templateName + ".html", {
        encoding: "utf8"
    });
    // Insert values into the content
    fileContents = mergeValues(values, fileContents);
    // Write out to the response
    response.write(fileContents);
}

/* 
 ** ABOUT: Export the view module to use in the router.js file
 **/
module.exports.view = view;
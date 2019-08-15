/**
 * This file sets up API endpoints based on the current folder tree in Heroku.
 * 
 * Here's how it works:
 * Consumable JS files named with an HTTP method (all lowercase) are handed the Request and Response parameters from ExpressJS
 * The path of the file is set up as the endpoint on the server, and is set up with the HTTP method indicated by the filename 
 * 
 * Example: 
 * The file `./myapp/bugreport/post.js` is set up at `POST https://example.com/myapp/bugreport/`
 * 
 * For local development, set the "DEBUG" environment variable to "local" before starting the app
 */

const express = require('express'), app = express();
const bodyParser = require('body-parser');
const glob = require('glob');
const helpers = require('./helpers');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'uwpcommunity.github.io');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

const PORT = process.env.PORT || 5000;
const DEBUG = process.env.DEBUG == "local";

let RegexMethods = /((?:post|get|put|patch|delete)+)(?:.js)/;

glob(__dirname + '/**/*.js', function (err, result) {
    
    for (let filePath of result) {

        if (!filePath.includes("node_modules") && helpers.match(filePath, RegexMethods)) {
            let serverPath = filePath.replace(RegexMethods, "").replace("/app", "");
            
            if (DEBUG) serverPath = serverPath.replace(__dirname.replace(/\\/g, `/`), "");
            
            const method = helpers.match(filePath, RegexMethods);
            console.log(`Setting up ${filePath} as ${method.toUpperCase()} ${serverPath}`);

            switch (method) {
                case "post":
                    app.post(serverPath, require(filePath));
                    break;
                case "get":
                    app.get(serverPath, require(filePath));
                    break;
                case "put":
                    app.put(serverPath, require(filePath));
                    break;
                case "patch":
                    app.patch(serverPath, require(filePath));
                    break;
                case "delete":
                    app.delete(serverPath, require(filePath));
                    break;
            }
        }
    }
});


app.listen(PORT, (err) => {
    if (err) {
        console.error(`Error while setting up port ${PORT}:`, err);
        return;
    }
    console.log(`Ready, listening on port ${PORT}`);
});


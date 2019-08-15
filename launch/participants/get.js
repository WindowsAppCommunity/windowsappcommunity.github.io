const { Client } = require('pg');
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
});

//#region Shutdown handlers
process.on('exit', exitHandler.bind(null, { cleanup: true }));
process.on('SIGINT', exitHandler.bind(null, { exit: true }));

function exitHandler(options, exitCode) {
    if (options.cleanup) console.log('Cleaning up active DB connections');
    client.end();

    if (options.exit) process.exit();
}
//#endregion

module.exports = (req, res) => {
    if (!req.query.year) {
        res.status(422);
        res.json(JSON.stringify({
            error: "Malformed request",
            reason: "Year parameter not specified"
        }));
        return;
    }
    getLaunchCached(req.query.year, res, results => {
        res.end(results);
    });
};

function createTable() {

}

function getLaunchTable(year, res, cb) {
    client.query(`select * from launch${year}`, (err, queryResults) => {
        if (err.toString().includes("does not exist")) {
            console.error(err);
            res.status(404);
            res.json(JSON.stringify({
                error: "Not found",
                reason: `Data does not exist for year ${year}`
            }));
            return;
        }

        let results = [];
        for (let row of queryResults.rows) {
            results.push(JSON.stringify(row));
        }

        fs.writeFile(launchCachePath, results, () => { }); // Cache the results
        cb(JSON.stringify(results));
    });
}

// Get and cache the list of launch participants
// This API is our only surface for interacting with the database, so the cache should be updated when a new participant is added
const fs = require("fs");
const launchCacheFilename = "launchCache.json";
const launchCachePath = __dirname + "/" + launchCacheFilename;

function getLaunchCached(year, res, cb) {
    fs.readdir(__dirname, (err, fileResults) => {

        // If missing, get data from database and create the cache
        if (!fileResults.includes(launchCacheFilename)) {
            console.info("Data not cached, refreshing from DB");
            getLaunchTable(year, res, result => {
                cb(result);
            });
            return;
        }

        // If the file exists, get the contents
        fs.readFile(launchCachePath, (err, file) => {
            let fileContents = file.toString();

            if (fileContents.length <= 5) {
                // Retry
                getLaunchCached(year, res, cb);
                return;
            }
            cb(fileContents);
        });
    });
}


client.connect();

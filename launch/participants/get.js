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
    getLaunchCached(results => {
        res.end(results);
    });
};

function createTable() {

}

function getLaunchTable(cb) {
    client.query(`select table_name from information_schema.tables`, (err, queryResults) => {
        if (err) {
            console.error(err);
            client.end();
            cb(err);
        }
        let results = [];
        for (let row of queryResults.rows) {
            results.push(JSON.stringify(row));
        }
        client.end();

        fs.writeFile(launchCachePath, results, () => { }); // Cache the results
        cb(JSON.stringify(results));
    });
}

// Get and cache the list of launch participants
// This API is our only surface for interacting with the database, so the cache should be updated when a new participant is added
const fs = require("fs");
const launchCacheFilename = "launchCache.json";
const launchCachePath = __dirname + "/" + launchCacheFilename;

function getLaunchCached(cb) {
    fs.readdir(__dirname, (err, fileResults) => {

        // If missing, get data from database and create the cache
        if (!fileResults.includes(launchCacheFilename)) {
            console.info("Data not cached, refreshing from DB");
            getLaunchTable(result => {
                fs.writeFile(launchCachePath, result, () => { });
                cb(result);
            });
            return;
        }

        // If the file exists, get the contents
        fs.readFile(launchCachePath, (err, file) => {
            let fileContents = file.toString();

            if (fileContents.length <= 5) {
                // Retry
                getLaunchCached(cb);
                return;
            }
            cb(fileContents);
        });
    });
}


client.connect();

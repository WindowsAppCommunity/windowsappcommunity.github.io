const { Client } = require('pg');

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
});

process.on('exit', exitHandler.bind(null, { cleanup: true }));
process.on('SIGINT', exitHandler.bind(null, { exit: true }));

function exitHandler(options, exitCode) {
    if (options.cleanup) console.log('Cleaning up active DB connections');
    client.end();

    if (options.exit) process.exit();
}

client.connect();

module.exports = (req, res) => {
    queryDb(`select table_name from information_schema.tables`, results => {
        res.end(results);
    });
};

function queryDb(query, cb) {
    client.query(query, (err, queryResults) => {
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
        cb(JSON.stringify(results));
    });
}
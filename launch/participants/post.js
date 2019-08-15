// This endpoint submits an app to review for Launch, it does not modify the actual participants list
let db = require("./dbclient");
const currentLaunchYear = 2020;

/**
 * Example participant request obj
 */
let exampleParticipantRequest = {
    appName: "App",
    author: "SomeDev",
    description: "Brief app description",
    isPrivate: true,
    contact: {
        email: "", // Optional
        discord: "" // Required, server presence should be verified by discord bot
    }
};

module.exports = (req, res) => {
    const body = req.body;
    const bodyCheck = checkBody(body);

    if (!bodyCheck || bodyCheck[0] === false) {
        res.status(422);
        res.json(JSON.stringify({
            error: "Malformed request",
            reason: `Parameter "${bodyCheck[1]}" not provided or malformed`
        }));
        return;
    }
    submitParticipant(body, results => {
        res.end(results);
    });
};

function checkBody(body) {
    if (!body.appName) return [false, "appName"];
    if (!body.author) return [false, "author"];
    if (!body.description) return [false, "description"];
    if (!body.isPrivate != undefined) return [false, "isPrivate"];
    if (!body.contact || !body.contact.discord) return [false, "contact"];
    return true;
}

function submitParticipant(participantData, cb) {
    db.query(`select * from launch${currentLaunchYear}submissions`, (err, queryResults) => {
        if (err.toString().includes("does not exist")) {
            // create the table
            createTable(participantData, result => {
                cb(result);
            });
        }
    });
}

function createTable(participantData, cb) {
    db.query(`CREATE TABLE launch${currentLaunchYear} (
        appname VARCHAR,
        author VARCHAR,
        description VARCHAR,
        private int(1),
        
    )`,
        (err, queryResults) => {
            cb(queryResults);
        });
}
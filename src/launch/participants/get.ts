import { Request, Response } from "express";
import { Buffer } from "buffer";
import { Dirent } from "fs";
import { IQueryResult } from "./dbclient";

let db = require('./dbclient');


module.exports = (req: Request, res: Response) => {
    if (!req.query.year) {
        res.status(422);
        res.json(JSON.stringify({
            error: "Malformed request",
            reason: "Year parameter not specified"
        }));
        return;
    }
    getLaunchCached(req.query.year, res, (results: string) => {
        res.end(results);
    });
};

function getLaunchTable(year: number, res: Response, cb: Function) {
    db.query(`select * from launch${year}participants`, (err: string, queryResults: IQueryResult) => {
        if (err.toString().includes("does not exist")) {
            res.status(404);
            res.json(JSON.stringify({
                error: "Not found",
                reason: `Data does not exist for year ${year}`
            }));
            return;
        } else if (err.toString()) {
            console.error(err);
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
const launchCacheFilename: string = "launchCache.json";
const launchCachePath = __dirname + "/" + launchCacheFilename;

function getLaunchCached(year: number, res: Response, cb: Function) {
    fs.readdir(__dirname, (err: Error, fileResults: string[] | Buffer[] | Dirent) => {

        // If missing, get data from database and create the cache
        if (fileResults instanceof Array && fileResults instanceof String && !fileResults.includes(launchCacheFilename)) {
            console.info("Data not cached, refreshing from DB");
            getLaunchTable(year, res, (result: string) => {
                cb(result);
            });
            return;
        }

        // If the file exists, get the contents
        fs.readFile(launchCachePath, (err: Error, file: string[] | Buffer[] | Dirent) => {
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
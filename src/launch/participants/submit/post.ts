import { Request, Response } from "express";
import { IQueryResult } from "../dbclient";

// This endpoint submits an app to review for Launch, it does not modify the actual participants list
let db = require("../dbclient");
const currentLaunchYear = 2020;

interface IParticipantContact {
    email?: string;
    discord: string;
};

interface IParticipantRequest {
    appName: string;
    author: string;
    description: string;
    isPrivate: boolean;
    contact: IParticipantContact
};

module.exports = (req: Request, res: Response) => {
    const body = req.body;
    const bodyCheck: true | (string | boolean)[] = checkBody(body);

    if (!bodyCheck || bodyCheck instanceof Array && bodyCheck[0] === false) {
        res.status(422);
        res.json(JSON.stringify({
            error: "Malformed request",
            reason: `Parameter "${bodyCheck[1]}" not provided or malformed`
        }));
        return;
    }
    submitParticipant(body, (results: IQueryResult) => {
        res.end(JSON.stringify(results));
    });
};

function checkBody(body: IParticipantRequest) {
    if (!body.appName) return [false, "appName"];
    if (!body.author) return [false, "author"];
    if (!body.description) return [false, "description"];
    if (body.isPrivate == undefined) return [false, "isPrivate"];
    if (!body.contact || !body.contact.discord) return [false, "contact"];
    return true;
}

function submitParticipant(participantData: IParticipantRequest, cb: Function) {
    db.query(`select * from launch${currentLaunchYear}submissions`, (err: Error, queryResults: IQueryResult) => {
        if (err.toString().includes("does not exist")) {
            // create the table
            createTable(participantData, (result: IQueryResult) => {
                cb(result);
            });
        }
    });
}

function createTable(participantData: IParticipantRequest, cb: Function) {
    db.query(`CREATE TABLE launch${currentLaunchYear} (
        appname VARCHAR,
        author VARCHAR,
        description VARCHAR,
        private int(1),
        
    )`,
        (err: Error, queryResults: IQueryResult) => {
            cb(queryResults);
        });
}
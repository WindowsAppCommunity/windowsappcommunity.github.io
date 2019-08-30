import { Request, Response } from "express";
import { IQueryResult } from "../dbclient";

// This endpoint submits an app to review for Launch, it does not modify the actual participants list
let db = require("../dbclient");
const currentLaunchYear = 1; //2020

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
    if (!body.contact) return [false, "contact"];
    // if (!body.contact || !body.contact.discord) return [false, "contact"];
    return true;
}

function submitParticipant(participantData: IParticipantRequest, cb: Function) {
    const text = 'INSERT INTO participants(app_name, author, description, is_private, contact, year_id) VALUES($1, $2, $3, $4, $5, $6) RETURNING *';
    const values = [participantData.appName, participantData.author, participantData.description, 
                    participantData.isPrivate, participantData.contact, currentLaunchYear];
    // callback
    db.query(text, values, (err: Error, queryResults: IQueryResult) => {
        if (err) {
            console.log(err.stack)
        } else {
            cb(JSON.stringify(queryResults.rows[0]));
        }
    })
}
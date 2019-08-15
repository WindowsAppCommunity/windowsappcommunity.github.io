import { Request, Response } from "express";

module.exports = (req: Request, res: Response) => {
    res.redirect(`https://uwpcommunity.github.io`);
}
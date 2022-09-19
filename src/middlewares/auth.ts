import { Request, Response, NextFunction } from "express";
import Session from "../models/Session";


export const authenticate = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (req.signedCookies && req.signedCookies['session']) {
      const session = await Session.findById(req.signedCookies['session']);
      if (session) {
        res.locals.userID = session.userID;
        return next();
      }
    }
    
    return res.sendStatus(401);
  } 
}
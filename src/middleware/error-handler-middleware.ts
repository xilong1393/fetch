import { Application, NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { CustomError, IErrorResponse } from "../helper/custom-error";
import { logger } from '../helper/winston-logger'


export class GlobalErrorHandler {
    private app: Application;
    constructor(app: Application) {
        this.app = app
        this.setup();
    }
    private setup() {

        this.app.all('*', (req: Request, res: Response) => {
            res.status(StatusCodes.NOT_FOUND).json({ message: `${req.originalUrl} not found` })
        });

        this.app.use((error: IErrorResponse, req: Request, res: Response, next: NextFunction) => {
            if (error instanceof CustomError) {
                logger.error(error.serialize());
                return res.status(error.statusCode).json(error.serialize())
            }
            else{
                logger.error(error.message)
            }
            next()
        })
    }
}
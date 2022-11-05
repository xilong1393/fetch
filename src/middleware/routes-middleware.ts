import express, { Application, NextFunction, Router, Request, Response } from 'express'
import PointService from '../service/point-service';
import PointToConsume from '../model/point-to-consume';
import PointEvent from '../model/point-event';
import * as _ from "lodash";
import PointBalance from '../model/point-balance';
import { TreeSet } from 'tstl';
export class Routes {
    private app: Application;
    private router: Router;
    constructor(app: Application) {
        this.app = app
        this.router = express.Router()
        this.setup();
    }
    private setup() {
        this.app.use('/v1', this.router);

        this.router.get('/balances/all', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const mymap = await new PointService().getAll()
                res.send(mymap.serialize())
            } catch (error) {
                next(error)
            }
        });

        this.router.post('/balances/consume', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const pointToConsume: PointToConsume = req.body
                const result = await new PointService().consume(pointToConsume.points)
                res.send(result)
            } catch (error) {
                next(error)
            }
        });

        this.router.post('/balances/addTransaction', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const pointEvent: PointEvent = req.body
                const result = await new PointService().addPointsTransaction(pointEvent)
                res.send(result)
            } catch (error) {
                next(error)
            }
        });
        this.router.post('/balances/addTransactions', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const pointEvents: PointEvent[] = req.body
                const result = await new PointService().handlePointsTransactions(pointEvents)
                res.send(result)
            } catch (error) {
                next(error)
            }
        });
        this.router.post('/balances/test', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const treeset: TreeSet<PointBalance> = new TreeSet<PointBalance>((a, b) => a.lastUpdated.getTime() != b.lastUpdated.getTime() ? a.lastUpdated < b.lastUpdated : a.payer < b.payer)

                treeset.insert(new PointBalance("test2", 100, new Date("2022-10-28T10:00:00Z")))
                treeset.insert(new PointBalance("test1", 120, new Date("2022-10-28T10:00:00Z")))
                treeset.insert(new PointBalance("test3", 90, new Date("2022-11-28T10:00:00Z")))
                treeset.insert(new PointBalance("test3", 90, new Date("2022-11-03T10:00:00Z")))
                treeset.insert(new PointBalance("test1", 100, new Date("2022-11-04T10:00:00Z")))
                treeset.erase(new PointBalance("test2", 100, new Date("2022-10-28T10:00:00Z")))
                console.log(treeset.begin().value)
                res.send(treeset)
            } catch (error) {
                next(error)
            }

        });
    }
}

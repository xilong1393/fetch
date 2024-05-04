import express, {
  Application,
  NextFunction,
  Router,
  Request,
  Response,
} from "express";
import PointService from "../service/point-service";
import PointToConsume from "../model/point-to-consume";
import PointEvent from "../model/point-event";
import * as _ from "lodash";
import { SystemError, TreeMap, TreeSet } from "tstl";
import PointBalance from "../model/point-balance";
import { UserService } from "../service/user-service";
import { logger } from "../helper/winston-logger";
import IUser from "../model/schema/IUser";
import { Utility } from "../helper/utility";
import multer from "multer";
// const upload = multer({ dest: "./uploads/" });
const storage = multer.diskStorage({
  destination: (req: any, file: any, cb: any) => {
    cb(null, "./uploads");
  },
  filename: (req: any, file: any, cb: any) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

export class Routes {
  private app: Application;
  private router: Router;

  constructor(app: Application) {
    this.app = app;
    this.router = express.Router();
    this.setup();
  }
  private setup() {
    this.app.use("/v1", this.router);

    this.router.post(
      "/upload",
      upload.single("files"),
      function (req: Request, res: Response, next: NextFunction) {
        // req.file is the `avatar` file
        // req.body will hold the text fields, if there were any
        console.log(req.file);
        console.log(req.body.name);
        res.status(200).json("ok");
      }
    );

    // get all balances summary
    this.router.get(
      "/balances/all",
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          logger.info("balance all api called!");
          for (let i = 0; i < 1000; i++) {
            await new Utility().sleep(1000);
            logger.info("i ==== " + i);
          }
          const mymap = await new PointService().getAll();
          res.send(mymap.serialize());
        } catch (error: any) {
          res.send(error.message);
          // next(error);
        }
      }
    );

    this.router.get(
      "/balances/test",
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          // const treeset: TreeSet<PointBalance> = new TreeSet<PointBalance>(
          //   (a, b) =>
          //     a.lastUpdated.getTime() != b.lastUpdated.getTime()
          //       ? a.lastUpdated < b.lastUpdated
          //       : a.payer < b.payer
          // );
          const treeMap: TreeMap<PointBalance, PointBalance> = new TreeMap<
            PointBalance,
            PointBalance
          >((a, b) =>
            a.lastUpdated.getTime() != b.lastUpdated.getTime()
              ? a.lastUpdated < b.lastUpdated
              : a.payer < b.payer
          );

          treeMap.set(
            new PointBalance("test2", 100, new Date("2022-10-28T10:00:00Z")),
            new PointBalance("test2", 100, new Date("2022-10-28T10:00:00Z"))
          );
          treeMap.set(
            new PointBalance("test1", 120, new Date("2022-10-28T10:00:00Z")),
            new PointBalance("test1", 120, new Date("2022-10-28T10:00:00Z"))
          );
          treeMap.set(
            new PointBalance("test3", 90, new Date("2022-11-28T10:00:00Z")),
            new PointBalance("test1", 120, new Date("2022-10-28T10:00:00Z"))
          );
          treeMap.emplace(
            new PointBalance("test3", 90, new Date("2022-11-03T10:00:00Z")),
            new PointBalance("test1", 120, new Date("2022-10-28T10:00:00Z"))
          );
          treeMap.set(
            new PointBalance("test1", 100, new Date("2022-11-04T10:00:00Z")),
            new PointBalance("test1", 120, new Date("2022-10-28T10:00:00Z"))
          );
          // treeset.erase(new PointBalance("test2", 100, new Date("2022-10-28T10:00:00Z")))
          const result = treeMap.has(
            new PointBalance("test2", 200, new Date("2022-10-28T10:00:00Z"))
          );

          // treeset.insert(
          //   new PointBalance("test2", 100, new Date("2022-10-28T10:00:00Z"))
          // );
          // treeset.insert(
          //   new PointBalance("test1", 120, new Date("2022-10-28T10:00:00Z"))
          // );
          // treeset.insert(
          //   new PointBalance("test3", 90, new Date("2022-11-28T10:00:00Z"))
          // );
          // treeset.insert(
          //   new PointBalance("test3", 90, new Date("2022-11-03T10:00:00Z"))
          // );
          // treeset.insert(
          //   new PointBalance("test1", 100, new Date("2022-11-04T10:00:00Z"))
          // );
          // // treeset.erase(new PointBalance("test2", 100, new Date("2022-10-28T10:00:00Z")))
          // const result = treeset.has(
          //   new PointBalance("test2", 200, new Date("2022-10-28T10:00:00Z"))
          // );
          res.send(result);
        } catch (error) {
          next(error);
        }
      }
    );

    // consume points
    this.router.post(
      "/balances/consume",
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const pointToConsume: PointToConsume = req.body;
          const result = await new PointService().consume(
            pointToConsume.points
          );
          res.send(result);
        } catch (error) {
          next(error);
        }
      }
    );

    // add one transaction
    this.router.post(
      "/balances/addTransaction",
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const pointEvent: PointEvent = req.body;
          const result = await new PointService().addPointsTransaction(
            pointEvent
          );
          res.json(result);
        } catch (error) {
          next(error);
        }
      }
    );

    /*
            Add a list of transactions. 
            If there's an exception/error during each transaction, that transaction will fail, other transactions will continue
        */
    this.router.post(
      "/balances/addTransactions",
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const pointEvents: PointEvent[] = req.body;
          const result = await new PointService().handlePointsTransactions(
            pointEvents
          );
          res.send(result);
        } catch (error) {
          next(error);
        }
      }
    );

    this.router.post(
      "/user/addUser",
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const user: IUser = req.body;
          const result = await new UserService().addUser(user);
          logger.info(`added user: ${result.name}`);
          res.send(result);
        } catch (error) {
          next(error);
        }
      }
    );

    this.router.get(
      "/user/getAllUsers",
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const result = await new UserService().getAllUsers();
          logger.info(result);
          logger.info(`get all users size: ${result.length}`);
          res.send(result);
        } catch (error) {
          next(error);
        }
      }
    );

    this.router.get(
      "/health/liveness",
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          logger.info("liveness check called");
          res.send({ liveness: "ok" });
        } catch (error: any) {
          res.send(error.message);
          // next(error);
        }
      }
    );

    this.router.get(
      "/health/readyness",
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          logger.info("readyness check called");
          res.send({ readyness: "ok" });
        } catch (error: any) {
          res.send(error.message);
          // next(error);
        }
      }
    );
  }
}

import { logger } from "../helper/winston-logger";

export default class Database {

    setup = () => {
        logger.info("set up db")
        // this.handleEvent(new PointEvent("DANNON", 300, new Date()))
        // this.handleEvent(new PointEvent("UNILEVER", 200, new Date()))
        // this.handleEvent(new PointEvent("DANNON", -200, new Date()))
        // this.handleEvent(new PointEvent("MILLER COORS", 10000, new Date()))
        // this.handleEvent(new PointEvent("DANNON", 1000, new Date()))
    }
}
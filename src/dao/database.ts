import { logger } from "../helper/winston-logger";
import mongoose from "mongoose";

// Database is not used in this exercise. I'm using a map and set to simulate a database.
export default class Database {
    connect = () => {
        mongoose.connect(process.env.mongoConnectionUrl!)
            .then(() => {
                logger.info("successfully connected to database")
            })
            .catch((error) => {
                logger.error(error)
            })
    }

    // we can do some data setup here
    setup = () => {
        // this.handleEvent(new PointEvent("DANNON", 300, new Date()))
        // this.handleEvent(new PointEvent("UNILEVER", 200, new Date()))
        // this.handleEvent(new PointEvent("DANNON", -200, new Date()))
        // this.handleEvent(new PointEvent("MILLER COORS", 10000, new Date()))
        // this.handleEvent(new PointEvent("DANNON", 1000, new Date()))
    }

}
// mongoose.connection.on("disconneceted", connect)



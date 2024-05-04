import "./helper/config";
import "./helper/tracer";

import { FetchAwardsServer } from "./server";
import Database from "./dao/database";

const database = new Database();
database.connect();
const server = new FetchAwardsServer();
server.start();
process
  .on("unhandledRejection", (reason, p) => {
    console.error(reason, "Unhandled Rejection at Promise", p);
  })
  .on("uncaughtException", (err) => {
    console.error(err, "Uncaught Exception thrown");
    // process.exit(1);
  });

import "./helper/config";
import "./helper/tracer";

import { FetchAwardsServer } from "./server";
import Database from "./dao/database";

const database = new Database();
database.connect();
const server = new FetchAwardsServer();
server.start();

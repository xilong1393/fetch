import { FetchAwardsServer } from './server';
import Database from './dao/database';

const database = new Database();
database.setup();
const server = new FetchAwardsServer();
server.start();

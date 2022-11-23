import tracer from "dd-trace";
tracer.init({ logInjection: true }); // initialized in a different file to avoid hoisting.
import dotenv from 'dotenv'
dotenv.config()

import { FetchAwardsServer } from './server';
import Database from './dao/database';

const database = new Database();
database.connect();
const server = new FetchAwardsServer();
server.start();

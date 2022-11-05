import express, { Application } from 'express'
import { Server } from 'http'
import { logger } from './helper/winston-logger';
import { Config } from './middleware/config-middleware';
import { GlobalErrorHandler } from './middleware/error-handler-middleware';
import { Routes } from './middleware/routes-middleware';

export class FetchAwardsServer {
    
    private app: Application;
    constructor() {
        this.app = express();
    }

    configMiddleware(app: express.Application) {
        const config: Config = new Config(app);
        config.setup()
    }

    private securityMiddleware(app: Application): void { }

    private routeMiddleware(app: Application): void {
        const routes: Routes = new Routes(app);
    }

    private globalErrorHandler(app: Application): void {
        const errorHandler: GlobalErrorHandler=new GlobalErrorHandler(app);
    }

    public start() {
        this.configMiddleware(this.app)
        this.securityMiddleware(this.app)
        this.routeMiddleware(this.app)
        this.globalErrorHandler(this.app)
        const server: Server = this.app.listen(3000, () => logger.info('server is up'))
    }

}


import express, { Application, Request, Response } from 'express';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import morgan from 'morgan';
// import http from 'http';

class App {
    public app: Application;
    public port: string

    constructor(appInt: { port: string, middleWares: any, controllers: any }) {
        this.app = express();
        this.port = appInt.port;

        admin.initializeApp(functions.config().firebase);
        this.logger();
        this.middleware(appInt.middleWares);
        this.routes(appInt.controllers);
    }

    private middleware(middlewares: { forEach: (arg0: (middleware: any) => void) => void; }): void {
        middlewares.forEach(middleware => {
            this.app.use(middleware);
        });
    }

    private routes(controllers: { forEach: (arg0: (controller: any) => void) => void; }) {
        controllers.forEach(controller => {
            this.app.use('/', controller.router)
        })
    }
    private logger(): void {
        this.app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
    }
    public listen() {
        this.app.use(function (req: Request, res: Response, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });
        return functions.https.onRequest(this.app);
    }
}

export default App;
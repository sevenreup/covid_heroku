import express, { Application } from 'express';

class App {
    public app: Application;
    public port: string

    constructor(appInt: { port: string, middleWares: any, controllers: any }) {
        this.app = express();
        this.port = appInt.port;

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

    public listen() {
        const jsonErrorHandler = async (err: any, req: any, res: any, next: any) => {
            res.status(500).send({ error: err });
        };
        this.app.use(jsonErrorHandler);
        this.app.listen(this.port, () => {
            console.log(`App listening on the http://localhost:${this.port}`)
        })
    }
}

export default App;
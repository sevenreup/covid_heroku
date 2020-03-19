"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
class App {
    constructor(appInt) {
        this.app = express_1.default();
        this.port = appInt.port;
        this.middleware(appInt.middleWares);
        this.routes(appInt.controllers);
    }
    middleware(middlewares) {
        middlewares.forEach(middleware => {
            this.app.use(middleware);
        });
    }
    routes(controllers) {
        controllers.forEach(controller => {
            this.app.use('/', controller.router);
        });
    }
    listen() {
        const jsonErrorHandler = async (err, req, res, next) => {
            res.status(500).send({ error: err });
        };
        this.app.use(jsonErrorHandler);
        this.app.listen(this.port, () => {
            console.log(`App listening on the http://localhost:${this.port}`);
        });
    }
}
exports.default = App;
//# sourceMappingURL=app.js.map
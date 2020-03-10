"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const morgan_1 = __importDefault(require("morgan"));
// import http from 'http';
class App {
    constructor(appInt) {
        this.app = express_1.default();
        this.port = appInt.port;
        admin.initializeApp(functions.config().firebase);
        this.logger();
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
    logger() {
        this.app.use(morgan_1.default(':method :url :status :res[content-length] - :response-time ms'));
    }
    listen() {
        this.app.use(function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });
        return functions.https.onRequest(this.app);
    }
}
exports.default = App;
//# sourceMappingURL=app.js.map
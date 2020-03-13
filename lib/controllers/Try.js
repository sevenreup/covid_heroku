"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Downloader_1 = __importDefault(require("../api/Downloader"));
class TryController {
    constructor() {
        this.path = '/all';
        this.router = express_1.default.Router();
        this.try = new Downloader_1.default();
        this.index = async (req, res) => {
            res.send(await this.try.fetchData());
        };
        this.initRoutes();
    }
    initRoutes() {
        this.router.get(this.path + '/', this.index);
    }
}
exports.TryController = TryController;
//# sourceMappingURL=Try.js.map
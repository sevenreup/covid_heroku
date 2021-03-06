"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cacher_1 = __importDefault(require("../util/cacher"));
const util_1 = require("../util/util");
const processer_1 = require("../api/processer");
const jhu_1 = require("../api/jhu");
class Covid19 {
    constructor() {
        this.router = express_1.default.Router();
        this.generateAll = async (req, res) => {
            let source = req.query.source;
            console.log(source);
            if (source === 'test') {
                const data = await jhu_1.jhu.getGeoJson();
                res.send(data);
            }
            else {
                console.log('here');
                try {
                    const data = await processer_1.processor.initData(util_1.jsontypes.geoGson);
                    res.send(data);
                }
                catch (error) {
                    console.log(error);
                    res.status(500).send("server issues");
                }
            }
        };
        this.getLayers = async (req, res) => {
            const response = await cacher_1.default.getLayers();
            res.send(response);
        };
        this.getScatter = async (req, res) => {
            try {
                const data = await processer_1.processor.initData(util_1.jsontypes.scatter);
                res.send(data);
            }
            catch (error) {
                res.status(500).send("server issues");
            }
        };
        this.initRoutes();
    }
    initRoutes() {
        this.router.get('/all', this.generateAll);
        this.router.get('/layers', this.getLayers);
        this.router.get('/scatterplot', this.getScatter);
    }
}
exports.Covid19 = Covid19;
//# sourceMappingURL=covidap.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const GitProvider_1 = require("../api/GitProvider");
const csvtojson_1 = __importDefault(require("csvtojson"));
const rxjs_1 = require("rxjs");
class GitController {
    constructor() {
        this.path = '/';
        this.router = express_1.default.Router();
        this.cat = { conf: 'Confirmed', dd: 'Deaths', rec: 'Recovered' };
        this.all = async (req, res) => {
            let data = { Confirmed: null, Deaths: null, Recovered: null };
            await this.getCategory(this.cat.conf).toPromise().then(async (value) => {
                data.Confirmed = value;
                await this.getCategory(this.cat.rec).toPromise().then(async (value) => {
                    data.Recovered = value;
                    await this.getCategory(this.cat.dd).toPromise().then((value) => {
                        data.Deaths = value;
                    });
                });
            });
            res.send(data);
        };
        this.category = async (req, res) => {
            const category = req.query.name;
            this.getCategory(category).subscribe((data) => {
                res.send(data);
            });
            return;
        };
        this.getCategory = (category) => {
            return new rxjs_1.Observable((obj) => {
                GitProvider_1.getCategories(category, (err, file) => {
                    if (err) {
                        rxjs_1.throwError(err);
                        return;
                    }
                    console.log(file);
                    csvtojson_1.default().fromString(file.contents.toString())
                        .then((line) => {
                        obj.next(line);
                        obj.complete();
                        return line;
                    });
                });
            });
        };
        this.initRoutes();
    }
    initRoutes() {
        this.router.get('/category', this.category);
        this.router.get('/all', this.all);
    }
}
exports.GitController = GitController;
//# sourceMappingURL=GitController.js.map
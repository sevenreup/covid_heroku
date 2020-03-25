"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jhu_end_1 = require("./enpoints/jhu.end");
const cacher_1 = __importDefault(require("../util/cacher"));
class JHU {
    constructor() {
        this.getall = async () => {
            const { status, data } = await jhu_end_1.getAllData();
            if (status === 200 && data) {
                return data;
            }
        };
        this.getGeoJson = async () => {
            const countries = await cacher_1.default.createCountryIndexes();
            const { status, data } = await jhu_end_1.getAllData();
            if (status === 200 && data) {
                const { locations } = data;
                const dataRaw = locations.map((item) => {
                    // const hashKey = keys.map(key => item[key] || '').join('_');
                    return {};
                });
                return dataRaw;
            }
        };
    }
}
exports.jhu = new JHU();
//# sourceMappingURL=jhu.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const axios_1 = __importDefault(require("axios"));
const d3_dsv_1 = require("d3-dsv");
class Cacher {
    static writedata(file, jsonOBJ) {
        fs_extra_1.default.outputFile(path_1.default.resolve(__dirname, '../cache/data', file), JSON.stringify(jsonOBJ, null, 2))
            .catch(error => console.log(error));
    }
    static async createCountryIndexes() {
        return await this.initCCode();
    }
    static async initCCode() {
        const filename = path_1.default.resolve(__dirname, '../cache/data', 'countries_code.json');
        let codes = null;
        try {
            codes = await fs_extra_1.default.readJson(filename);
        }
        catch (error) {
            console.log('here');
            console.log(error);
            const data = await this.getCCode();
            console.log(data);
            fs_extra_1.default.outputFile(filename, JSON.stringify(data));
            codes = data;
        }
        console.log(codes);
        return codes;
    }
    static async getCCode() {
        const response = await axios_1.default.get('https://raw.githubusercontent.com/datasets/country-codes/master/data/country-codes.csv');
        let data = d3_dsv_1.csvParse(response.data);
        const all = data.map((item) => {
            return {
                name: item['CLDR display name'],
                alpha_2: item["ISO3166-1-Alpha-2"],
                alpha_3: item["ISO3166-1-Alpha-3"],
                country_code: item["ISO3166-1-numeric"],
                region: item["Region Code"],
                region_code: item["Region Code"],
                sub_region: item["Sub-region Code"],
                sub_region_code: item['Sub-region Code'],
                intermediate_region_code: item["Intermediate Region Code"]
            };
        });
        console.log('here');
        console.log(all);
        return all;
    }
}
exports.default = Cacher;
//# sourceMappingURL=cacher.js.map
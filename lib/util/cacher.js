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
        let countries_index;
        try {
            countries_index = await fs_extra_1.default.readJson(this.IndexedCountPath);
        }
        catch (error) {
            console.log(error);
            countries_index = await this.getCountryIndex();
        }
        return countries_index;
    }
    static async getCountryIndex() {
        const countryCodes = await this.initCCode();
        const countries = await this.getCountries();
        const indexesCode = countryCodes.reduce((result, item) => {
            return Object.assign(result, {
                [item["alpha_3"]]: {
                    alpha2: item["alpha_2"]
                }
            });
        }, {});
        console.log(indexesCode);
        const indexesCount = countries.features.reduce((result, item) => {
            // console.log(item);
            if (indexesCode[item.id]) {
                let index = indexesCode[item.id].alpha2;
                return Object.assign(result, {
                    [index]: Object.assign({}, item)
                });
            }
            else {
                console.log('ass');
                return result;
            }
        }, {});
        await fs_extra_1.default.outputFile(this.IndexedCountPath, JSON.stringify(indexesCount, null, 2));
        return indexesCount;
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
            fs_extra_1.default.outputFile(filename, JSON.stringify(data, null, 2));
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
    static async getCountries() {
        const file = await fs_extra_1.default.readFileSync(path_1.default.resolve(__dirname, '../cache/data', 'countries.geo.json')).toString();
        return JSON.parse(file);
    }
    static async writeLayers(filename, data) {
        fs_extra_1.default.outputFile(path_1.default.resolve(__dirname, '../cache/layers', filename), JSON.stringify(data, null, 2));
    }
}
exports.default = Cacher;
Cacher.IndexedCountPath = path_1.default.resolve(__dirname, '../cache/data', 'indexed_countries.json');
//# sourceMappingURL=cacher.js.map
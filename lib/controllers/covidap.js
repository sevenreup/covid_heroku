"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const enpoints_1 = require("../api/enpoints");
const cacher_1 = __importDefault(require("../util/cacher"));
const layer_1 = __importDefault(require("../models/layer"));
const crypto_1 = __importDefault(require("crypto"));
class Covid19 {
    constructor() {
        this.router = express_1.default.Router();
        this.countries = async (req, res) => {
            res.send(await cacher_1.default.createCountryIndexes());
        };
        this.generateAll = async (req, res) => {
            const countries = cacher_1.default.createCountryIndexes();
            const { status, data } = await enpoints_1.getAllData();
            if (status === 200 && data) {
                const { confirmed, deaths, latest, recovered } = data;
                // this.generateLayer(latest);
                const conf_indexed = await this.convertArrayToObject(confirmed.locations, ["country_code", "countryregion"]);
                const dea_indexed = await this.convertArrayToObject(deaths.locations, ["country_code", "countryregion"]);
                const rec_indexed = await this.convertArrayToObject(recovered.locations, ["country_code", "countryregion"]);
                const all = Object.keys(conf_indexed).map(key => {
                    const confirm = conf_indexed[key];
                    return {
                        id: key,
                        location: [confirm.coordinates.long, confirm.coordinates.lat],
                        country: confirm.country,
                        country_code: confirm.country_code,
                        province: confirm.province,
                        data: {
                            confirmed: confirm.latest,
                            deaths: dea_indexed[key] ? dea_indexed[key].latest : 0,
                            recovered: rec_indexed[key] ? rec_indexed[key].latest : 0
                        }
                    };
                });
                // Cacher.writedata('layers/mapdata.json', all);
                // @ts-ignore
                const countryData = all.reduce((acc, item) => {
                    if (acc[item.country_code]) {
                        acc[item.country_code].confirmed += item.data.confirmed;
                        acc[item.country_code].deaths += item.data.deaths;
                        acc[item.country_code].recovered += item.data.recovered;
                    }
                    else {
                        acc[item.country_code] = item.data;
                    }
                }, {});
                // const mapped = Object.keys(countries).map(country_code => {
                //     return {
                //         ...countries[country_code],
                //         properties: {
                //             ...countries[country_code].properties,
                //             data: countryData[country_code] || { confirmed, 0, deaths: 0, recovered: 0 }
                //         }
                //     }
                // });
                res.send(all);
            }
            console.log(status);
        };
        this.initRoutes();
    }
    initRoutes() {
        this.router.get('/dev/all', this.generateAll);
        this.router.get('/dev/cr', this.countries);
    }
    generateLayer(layers) {
        const data = Object.keys(layers).map((id) => {
            console.log(id);
            // @ts-ignore
            return new layer_1.default(id, layers[id], id);
        });
        cacher_1.default.writedata('layers/layers.json', data);
    }
    async convertArrayToObject(data, keys) {
        return data.reduce((obj, item) => {
            const hashKey = keys.map(key => item[key] || '').join('_');
            const hash = crypto_1.default.createHash('md5').update(hashKey).digest("hex").toString();
            return Object.assign(obj, {
                [hash]: Object.assign({ id: hash }, item)
            });
            return obj;
        }, {});
    }
}
exports.Covid19 = Covid19;
//# sourceMappingURL=covidap.js.map
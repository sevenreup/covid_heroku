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
            try {
                const data = await this.initData();
                res.send(data);
            }
            catch (error) {
                res.status(500).send("server issues");
            }
        };
        this.getLayers = async (req, res) => {
            const response = await cacher_1.default.getLayers();
            res.send(response);
        };
        this.initData = async () => {
            const countries = await cacher_1.default.createCountryIndexes();
            console.log('here');
            const { status, data } = await enpoints_1.getAllData();
            if (status === 200 && data) {
                console.log('loadeed');
                const { confirmed, deaths, latest, recovered } = data;
                this.generateLayer(latest);
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
                cacher_1.default.writeLayers('mapdata.json', all);
                console.log('before');
                // @ts-ignore
                const countryData = all.reduce((result, item) => {
                    if (result[item.country_code]) {
                        result[item.country_code].confirmed += item.data.confirmed;
                        result[item.country_code].deaths += item.data.deaths;
                        result[item.country_code].recovered += item.data.recovered;
                    }
                    else {
                        result[item.country_code] = item.data;
                    }
                    ;
                    return result;
                }, {});
                console.log(countryData);
                const mapped = Object.keys(countries).map(country_code => {
                    return Object.assign(Object.assign({}, countries[country_code]), { alpha2: country_code, properties: Object.assign(Object.assign({}, countries[country_code].properties), { data: countryData[country_code] || { confirmed: 0, deaths: 0, recovered: 0 } }) });
                });
                cacher_1.default.writeLayers('geo.json', mapped);
                return mapped;
            }
            else {
                console.log(status);
                return { status, error: 'cant contact data' };
            }
        };
        this.initRoutes();
    }
    initRoutes() {
        this.router.get('/all', this.generateAll);
        this.router.get('/cr', this.countries);
        this.router.get('/layers', this.getLayers);
    }
    generateLayer(layers) {
        const data = Object.keys(layers).map((id) => {
            console.log(id);
            // @ts-ignore
            return new layer_1.default(id, layers[id], id);
        });
        cacher_1.default.writeLayers('layers.json', data);
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
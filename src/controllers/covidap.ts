import IControllerBase from "../interfaces/IControllerBase.interface";
import express, { Request, Response } from 'express';
import { getAllData } from '../api/enpoints';
import Cacher from '../util/cacher';
import Layers from '../models/layer';
import crypto from 'crypto';

export class Covid19 implements IControllerBase {

    public router = express.Router();
    constructor() {
        this.initRoutes();
    }
    initRoutes() {
        this.router.get('/dev/all', this.generateAll);
        this.router.get('/dev/cr', this.countries)
    }
    private countries = async (req: Request, res: Response) => {
        res.send(await Cacher.createCountryIndexes());
    }
    private generateAll = async (req: Request, res: Response) => {
        try {
            const data = await this.initData();
            res.send(data);
        } catch (error) {
            res.status(500).send("server issues");
        }
    }
    private  initData = async () => {
        const countries = await Cacher.createCountryIndexes();
        console.log('here');
        
        const { status, data } = await getAllData();
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
                }
            });
            // Cacher.writedata('layers/mapdata.json', all);
            console.log('before');

            // @ts-ignore
            const countryData = all.reduce((result: any, item: any) => {
                if (result[item.country_code]) {
                    result[item.country_code].confirmed += item.data.confirmed;
                    result[item.country_code].deaths += item.data.deaths;
                    result[item.country_code].recovered += item.data.recovered;
                } else {
                    result[item.country_code] = item.data;
                };
                return result;
            }, {})
            console.log(countryData);

            const mapped = Object.keys(countries).map(country_code => {
                return {
                    ...countries[country_code],
                    alpha2: country_code,
                    properties: {
                        ...countries[country_code].properties,
                        data: countryData[country_code] || { confirmed: 0, deaths: 0, recovered: 0 }
                    }
                }
            });

            Cacher.writeLayers('geo.json', mapped);
            return mapped;
        } else {
            console.log(status);
            return { status, error: 'cant contact data'}
        }

    }

    private generateLayer(layers: object) {
        const data = Object.keys(layers).map((id: string) => {
            console.log(id);
            // @ts-ignore
            return new Layers(id, layers[id], id);
        });

        Cacher.writedata('layers/layers.json', data);
    }

    private async convertArrayToObject(data: any, keys: any[]) {
        return data.reduce((obj: any, item: any) => {
            const hashKey = keys.map(key => item[key] || '').join('_');
            const hash = crypto.createHash('md5').update(hashKey).digest("hex").toString();
            return Object.assign(obj, {
                [hash]: {
                    id: hash,
                    ...item
                }
            });
            return obj;
        }, {});
    }
}
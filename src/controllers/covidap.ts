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
    }

    private generateAll = async (req: Request, res: Response) => {
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
            Cacher.writedata('layers/mapdata.json', all);
            res.send(all);
        }
        console.log(status);

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
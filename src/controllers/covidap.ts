import IControllerBase from "../interfaces/IControllerBase.interface";
import express, { Request, Response } from 'express';
import Cacher from '../util/cacher';
import { jsontypes } from '../util/util';
import { processor } from '../api/processer';
import { jhu } from '../api/jhu';

export class Covid19 implements IControllerBase {

    public router = express.Router();
    constructor() {
        this.initRoutes();
    }
    initRoutes() {
        this.router.get('/all', this.generateAll);
        this.router.get('/layers', this.getLayers);
        this.router.get('/scatterplot', this.getScatter);
    }
    private generateAll = async (req: Request, res: Response) => {
        let source = req.query.source;
        console.log(source);

        if (source === 'test') {
            const data = await jhu.getGeoJson()
            res.send(data);
        } else {
            console.log('here');

            try {
                const data = await processor.initData(jsontypes.geoGson);
                res.send(data);
            } catch (error) {
                console.log(error);
                
                res.status(500).send("server issues");
            }
        }

    }
    private getLayers = async (req: Request, res: Response) => {
        const response = await Cacher.getLayers();
        res.send(response);
    }
    private getScatter = async (req: Request, res: Response) => {
        try {
            const data = await processor.initData(jsontypes.scatter);
            res.send(data);
        } catch (error) {
            res.status(500).send("server issues");
        }
    }
}
import IControllerBase from "../interfaces/IControllerBase.interface";
import express, { Request, Response } from 'express';
import Cacher from '../util/cacher';
import { jsontypes } from '../util/util';
import { processor } from '../api/processer';

export class Covid19 implements IControllerBase {

    public router = express.Router();
    constructor() {
        this.initRoutes();
    }
    initRoutes() {
        this.router.get('/all', this.generateAll);
        this.router.get('/cr', this.countries)
        this.router.get('/layers', this.getLayers);
        this.router.get('/scatterplot', this.getScatter);
    }
    private countries = async (req: Request, res: Response) => {
        res.send(await Cacher.createCountryIndexes());
    }
    private generateAll = async (req: Request, res: Response) => {
        try {
            const data = await processor.initData(jsontypes.geoGson);
            res.send(data);
        } catch (error) {
            res.status(500).send("server issues");
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
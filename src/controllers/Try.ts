import IControllerBase from '../interfaces/IControllerBase.interface';
import express, { Request, Response } from 'express';
import Try from '../api/Downloader';

export class TryController implements IControllerBase {

    public path = '/all';
    public router = express.Router();
    private try = new Try();

    constructor() {
        this.initRoutes();
    }
    initRoutes() {
        this.router.get(this.path + '/', this.index);
    }

    public index = async (req: Request, res: Response) => {
        res.send(await this.try.fetchData());
    }

}
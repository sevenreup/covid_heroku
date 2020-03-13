import IControllerBase from '../interfaces/IControllerBase.interface';
import express, { Request, Response } from 'express';
import { getCategories } from '../api/GitProvider';
import csvtojson from 'csvtojson';
import { Observable, throwError } from 'rxjs';
interface alldta { Confirmed: any, Deaths: any, Recovered: any }
export class GitController implements IControllerBase {

    public path = '/dep';
    public router = express.Router();
    private cat = { conf: 'Confirmed', dd: 'Deaths', rec: 'Recovered' }

    constructor() {
        this.initRoutes();
    }
    initRoutes() {
        this.router.get('/', this.info);
        this.router.get(this.path + '/category', this.category);
        this.router.get(this.path + '/all', this.all);
    }
    private info = (req: Request, res: Response) => {
        res.send("Routes have been changed<br> <b>all: </b> returns the geojson data <br>" + 
        "<h3>old routes</h3> these have been moved to the <b>/dep</b> route <br> /dep/all <br> /dep/category");
    }

    private all = async (req: Request, res: Response) => {
        let data: alldta = { Confirmed: null, Deaths: null, Recovered: null };
        await this.getCategory(this.cat.conf).toPromise().then(async (value) => {
            data.Confirmed = value;
            await this.getCategory(this.cat.rec).toPromise().then(async (value) => {
                data.Recovered = value;
                await this.getCategory(this.cat.dd).toPromise().then((value) => {
                    data.Deaths = value;
                });
            });
        });
        res.send(data);
    }

    private category = async (req: Request, res: Response) => {
        const category = req.query.name;
        this.getCategory(category).subscribe((data) => {
            res.send(data);
        });
        return;
    }
    private getCategory = (category: string) => {
        return new Observable((obj: any) => {
            getCategories(category, (err: any, file: any) => {
                if (err) {
                    throwError(err);
                    return;
                }
                console.log(file);
                csvtojson().fromString(file.contents.toString())
                    .then((line) => {
                        obj.next(line);
                        obj.complete();
                        return line;
                    });
            });
        });
    }

}
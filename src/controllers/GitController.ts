import IControllerBase from '../interfaces/IControllerBase.interface';
import express, { Request, Response } from 'express';
import { getCategories } from '../api/GitProvider';
import csvtojson from 'csvtojson';
import { Observable, throwError } from 'rxjs';
interface alldta { Confirmed: any, Deaths: any, Recovered: any }
export class GitController implements IControllerBase {

    public path = '/';
    public router = express.Router();
    private cat = { conf: 'Confirmed', dd: 'Deaths', rec: 'Recovered' }

    constructor() {
        this.initRoutes();
    }
    initRoutes() {
        this.router.get('/', this.index);
        this.router.get('/category', this.category);
        this.router.get('/all', this.all);
    }

    private index = async (req: Request, res: Response) => {
        res.send("worked");
    }

    private all = async (req: Request, res: Response) => {
        const data: alldta = { Confirmed: null, Deaths: null, Recovered: null };
        await this.getCategory(this.cat.conf).toPromise().then(async (value1: any) => {
            data.Confirmed = value1;
            await this.getCategory(this.cat.rec).toPromise().then(async (value2: any) => {
                data.Recovered = value2;
                await this.getCategory(this.cat.dd).toPromise().then((value3: any) => {
                    data.Deaths = value3;
                });
            });
        });
        res.send(data);
    }

    private category = async (req: Request, res: Response) => {
        const category = req.query.name;
        this.getCategory(category).subscribe((data: any) => {
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
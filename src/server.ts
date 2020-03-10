import App from './app'

import * as bodyParser from 'body-parser';
import cors from 'cors';

import { gitController } from './controllers';
import { PORT } from './config/constants';

const app = new App({
    port: PORT,
    controllers: [
        gitController
    ],
    middleWares: [
        bodyParser.json(),
        bodyParser.urlencoded({ extended: true }),
        cors({origin: true})
    ]
})

export const webApi = app.listen();


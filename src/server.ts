import App from './app'

import * as bodyParser from 'body-parser';
import { gitController, tryCon } from './controllers';
import { PORT } from './config/constants';
import cors from 'cors';

const app = new App({
    port: PORT,
    controllers: [
        gitController,
        tryCon
    ],
    middleWares: [
        bodyParser.json(),
        bodyParser.urlencoded({ extended: true }),
        cors()
    ]
})

app.listen()


import App from './app'

import * as bodyParser from 'body-parser';
import { gitController, tryCon } from './controllers';
import { PORT } from './config/constants';

const app = new App({
    port: PORT,
    controllers: [
        gitController,
        tryCon
    ],
    middleWares: [
        bodyParser.json(),
        bodyParser.urlencoded({ extended: true }),
    ]
})

app.listen()


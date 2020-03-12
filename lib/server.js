"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const bodyParser = __importStar(require("body-parser"));
const controllers_1 = require("./controllers");
const constants_1 = require("./config/constants");
const cors_1 = __importDefault(require("cors"));
const app = new app_1.default({
    port: constants_1.PORT,
    controllers: [
        controllers_1.gitController,
        controllers_1.tryCon
    ],
    middleWares: [
        bodyParser.json(),
        bodyParser.urlencoded({ extended: true }),
        cors_1.default()
    ]
});
app.listen();
//# sourceMappingURL=server.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const request = axios_1.default.create({ baseURL: `https://coronavirus-tracker-api.herokuapp.com/v2` });
exports.getAllData = () => {
    return request.get(`/locations`);
};
exports.getConfirmed = () => {
    return request.get(`/confirmed`);
};
exports.getDeaths = () => {
    return request.get(`/deaths`);
};
exports.getRecovered = () => {
    return request.get(`/recovered`);
};
exports.getLatest = () => {
    return request.get('/v2/latest');
};
exports.getAllNovel = () => {
    return axios_1.default.get(`https://corona.lmao.ninja/jhucsse`);
};
//# sourceMappingURL=jhu.end.js.map
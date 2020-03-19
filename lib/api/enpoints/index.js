"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const request = axios_1.default.create({ baseURL: `https://coronavirus-tracker-api.herokuapp.com` });
exports.getAllData = () => {
    return request.get(`/all`);
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
//# sourceMappingURL=index.js.map
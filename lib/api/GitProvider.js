"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
const github_content_1 = __importDefault(require("github-content"));
const options = {
    owner: 'CSSEGISandData',
    repo: 'COVID-19',
    branch: 'master'
};
const GC = new github_content_1.default(options);
function getFile(path, callback) {
    return GC.file(path, callback);
}
function getCategories(category, callback) {
    const path = 'csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-' + category + '.csv';
    return getFile(path, callback);
}
exports.getCategories = getCategories;
//# sourceMappingURL=GitProvider.js.map
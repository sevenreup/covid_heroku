"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
const github_content_1 = __importDefault(require("github-content"));
const https_1 = __importDefault(require("https"));
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
    console.log(path);
    download(path);
    return getFile(path, callback);
}
exports.getCategories = getCategories;
function download(url) {
    return https_1.default.get('https://raw.githubusercontent.com/CSSEGISandData/2019-nCoV/master/' + url, (res) => {
        console.log(res);
    });
}
//# sourceMappingURL=GitProvider.js.map
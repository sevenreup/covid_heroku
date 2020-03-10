"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
const github_base_1 = __importDefault(require("github-base"));
const options = {
    owner: 'CSSEGISandData',
    repo: 'COVID-19',
    branch: 'master'
};
const gitHub = new github_base_1.default(options);
function file(path) {
    return gitHub.get(path);
}
exports.file = file;
//# sourceMappingURL=downloader.js.map
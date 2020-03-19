"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
class Cacher {
    static writedata(file, jsonOBJ) {
        fs_extra_1.default.outputFile(path_1.default.resolve(__dirname, '../cache/data', file), JSON.stringify(jsonOBJ, null, 2))
            .catch(error => console.log(error));
    }
    static createCountryIndexes() {
    }
}
exports.default = Cacher;
//# sourceMappingURL=cacher.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertArrayToObject = (array, key) => {
    const initialValue = {};
    return array.reduce((obj, item) => {
        return Object.assign(Object.assign({}, obj), { [item[key]]: item });
    }, initialValue);
};
//# sourceMappingURL=util.js.map
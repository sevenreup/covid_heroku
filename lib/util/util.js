"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertArrayToObject = (array, key) => {
    const initialValue = {};
    return array.reduce((obj, item) => {
        return Object.assign(Object.assign({}, obj), { [item[key]]: item });
    }, initialValue);
};
var jsontypes;
(function (jsontypes) {
    jsontypes[jsontypes["geoGson"] = 0] = "geoGson";
    jsontypes[jsontypes["scatter"] = 1] = "scatter";
})(jsontypes = exports.jsontypes || (exports.jsontypes = {}));
//# sourceMappingURL=util.js.map
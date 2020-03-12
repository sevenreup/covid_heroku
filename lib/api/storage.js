"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const localstorage_ponyfill_1 = require("localstorage-ponyfill");
class Storage {
    constructor() {
        this.local = localstorage_ponyfill_1.createLocalStorage();
    }
    set(key, value) {
        this.local.setItem(key, value);
    }
    get(key) {
        return this.local.getItem(key);
    }
    check(key) {
        if (this.get(key) === 'true')
            return true;
        return false;
    }
}
exports.default = Storage;
//# sourceMappingURL=storage.js.map
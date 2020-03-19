"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GitController_1 = require("./GitController");
const Try_1 = require("./Try");
const covidap_1 = require("./covidap");
const gitController = new GitController_1.GitController();
exports.gitController = gitController;
const tryCon = new Try_1.TryController();
exports.tryCon = tryCon;
const covidap = new covidap_1.Covid19();
exports.covidap = covidap;
//# sourceMappingURL=index.js.map
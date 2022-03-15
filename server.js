"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const web_json_1 = __importDefault(require("./web.json"));
app_1.app.listen(web_json_1.default.port, () => {
    console.log(`We're live at localhost:${web_json_1.default.port}!`);
});

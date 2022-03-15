"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const web_json_1 = __importDefault(require("./web.json"));
const origin = `http://localhost:${web_json_1.default.port}`;
const app = (0, express_1.default)();
exports.app = app;
app.use(express_1.default.static('../')) // allow serving of content (everything within public folder)
    .use((0, cookie_parser_1.default)()) // and use of cookieParser tool
    .use((0, cors_1.default)({ origin: origin }));

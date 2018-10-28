'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var nconf_1 = __importDefault(require("nconf"));
nconf_1.default.argv()
    .env()
    .file({
    file: 'conf/conf.json',
});
exports.default = nconf_1.default;

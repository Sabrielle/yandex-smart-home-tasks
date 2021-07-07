'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var apiController_1 = __importDefault(require("./apiController"));
exports.default = (function (app) {
    app.get('/', function (req, res) {
        res.render('mainPage');
    });
    app.get('/broadcast', function (req, res) {
        res.render('video');
    });
    app.get('/status', apiController_1.default.getUptime);
    app.get('/api/events', apiController_1.default.eventsGetRequest);
    app.post('/api/events', apiController_1.default.eventsPostRequest);
    app.use(function (req, res) {
        res.status(404).send('<h1>Page not found</h1>');
    });
});

'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var conf_1 = __importDefault(require("./conf"));
var body_parser_1 = __importDefault(require("body-parser"));
var express_1 = __importDefault(require("express"));
var router_1 = __importDefault(require("./router"));
var app = express_1.default();
app.use('/public', express_1.default.static(__dirname + '/public'));
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.set('views', './../views');
app.set('view engine', 'pug');
router_1.default(app);
app.listen(conf_1.default.get('server:port'), function () {
    console.log('Server listening on port ' + conf_1.default.get('server:port'));
});

'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var conf_1 = __importDefault(require("./conf"));
var statuses = conf_1.default.get('statuses');
exports.default = {
    getUptime: function (req, res) {
        var uptime = Math.round(process.uptime());
        res.send(beautifyUptime(uptime));
    },
    eventsGetRequest: function (req, res) {
        handleRequest(req, res, req.query);
    },
    eventsPostRequest: function (req, res) {
        handleRequest(req, res, req.body);
    },
};
function handleRequest(req, res, paramSource) {
    if (!Object.keys(paramSource).length) {
        return fs_1.default.readFile('./data/events.json', function (err, content) {
            if (err) {
                throw err;
            }
            return res.send(JSON.parse(content.toString()).events);
        });
    }
    var type = (typeof (paramSource.type) !== 'undefined') ? paramSource.type : '';
    var limit = (typeof (paramSource.limit) !== 'undefined') ? paramSource.limit : '';
    var currentPage = (typeof (paramSource.page) !== 'undefined') ? paramSource.page : '';
    fs_1.default.readFile('./data/events.json', function (err, content) {
        if (err) {
            throw err;
        }
        if (type.length && !validateType(type)) {
            return res.status(400).send('incorrect type');
        }
        var filtered = (type !== '') ? parseParams(type, content.toString()) : JSON.parse(content.toString()).events;
        if (limit.length && currentPage.length) {
            if (Number(limit) <= 0 || Number(currentPage) <= 0) {
                return res.status(400).send('incorrect number of page or limit');
            }
            var total = filtered.length;
            var totalPages = Math.ceil(total / Number(limit));
            if (Number(currentPage) > totalPages) {
                return res.status(400).send('page number is too big');
            }
            filtered = filtered.slice((Number(currentPage) - 1) * Number(limit), Number(currentPage) * Number(limit));
        }
        return res.send(filtered);
    });
}
function validateType(param) {
    var paramArray = param.split(':');
    return paramArray.every(function (item, i, array) {
        return statuses.indexOf(item) > -1;
    });
}
function parseParams(param, content) {
    var object = JSON.parse(content);
    var result = new Array();
    var paramArray = param.split(':');
    var _loop_1 = function (key) {
        if (object.events.hasOwnProperty(key)) {
            paramArray.forEach(function (item, i, array) {
                if (object.events[key].type === item) {
                    result.push(object.events[key]);
                }
            });
        }
    };
    for (var key in object.events) {
        _loop_1(key);
    }
    return result;
}
function beautifyUptime(sec) {
    var hh = Math.floor(sec / 3600);
    var mm = Math.floor((sec - (hh * 3600)) / 60);
    var ss = sec - (hh * 3600) - (mm * 60);
    ss = Math.round(ss * 100) / 100;
    var result = (hh < 10 ? '0' + hh : hh);
    result += ':' + (mm < 10 ? '0' + mm : mm);
    result += ':' + (ss < 10 ? '0' + ss : ss);
    return result;
}

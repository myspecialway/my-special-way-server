#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var winston = require("winston");
var fs = require("fs");
var path = require("path");
var mongodb_1 = require("mongodb");
var argparse_1 = require("argparse");
var logger = winston.createLogger({
    format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    transports: [
        new winston.transports.Console(),
    ]
});
logger.info('dbseed:: init');
var parser = new argparse_1.ArgumentParser({
    version: '0.0.1',
    addHelp: true,
    description: 'cross-env executer'
});
parser.addArgument(['connectionString'], {
    help: 'connection string to place seed in'
});
parser.addArgument(['-n', '--name'], {
    help: 'db name',
    required: true
});
parser.addArgument(['-c', '--clean'], {
    help: 'clean the db first',
    nargs: 0,
    required: false
});
var args = parser.parseArgs();
init();
function init() {
    return __awaiter(this, void 0, void 0, function () {
        var client, db, collectionContents, _i, collectionContents_1, collectionContent, collection;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger.info("dbseed:: connecting to db on " + args.connectionString);
                    return [4 /*yield*/, mongodb_1.MongoClient.connect(args.connectionString)];
                case 1:
                    client = _a.sent();
                    db = client.db(args.name);
                    logger.info("dbseed:: connection success");
                    if (!args.clean) return [3 /*break*/, 3];
                    logger.info("dbseed:: cleaning db");
                    return [4 /*yield*/, db.dropDatabase()];
                case 2:
                    _a.sent();
                    db = client.db(args.name);
                    _a.label = 3;
                case 3:
                    collectionContents = getFilesJSONContent('./data');
                    logger.info("dbseed:: filling collections");
                    _i = 0, collectionContents_1 = collectionContents;
                    _a.label = 4;
                case 4:
                    if (!(_i < collectionContents_1.length)) return [3 /*break*/, 7];
                    collectionContent = collectionContents_1[_i];
                    logger.info("dbseed:: filling collection " + collectionContent.collection + " with " + collectionContent.data.length + " rows");
                    collection = db.collection(collectionContent.collection);
                    return [4 /*yield*/, collection.insertMany(collectionContent.data)];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 4];
                case 7:
                    logger.info("dbseed:: seed complete, closing db connection");
                    return [4 /*yield*/, client.close()];
                case 8:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function getFilesJSONContent(relativeFolderPath) {
    var folderPath = path.resolve(__dirname, relativeFolderPath);
    logger.info("dbseed:: reading files from " + folderPath);
    var filesPaths = fs.readdirSync(folderPath)
        .filter(function (filename) { return filename.endsWith('.json'); })
        .map(function (filename) { return path.resolve(__dirname, relativeFolderPath, filename); });
    logger.info("dbseed:: reading files complete for " + JSON.stringify(filesPaths, null, 2));
    var jsonContent = [];
    for (var _i = 0, filesPaths_1 = filesPaths; _i < filesPaths_1.length; _i++) {
        var filePath = filesPaths_1[_i];
        var fileContent = fs.readFileSync(filePath, { encoding: 'utf8' });
        jsonContent.push(JSON.parse(fileContent));
    }
    return jsonContent;
}

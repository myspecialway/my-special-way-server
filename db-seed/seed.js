#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston = require("winston");
const fs = require("fs");
const path = require("path");
const mongodb_1 = require("mongodb");
const argparse_1 = require("argparse");
const logger = winston.createLogger({
    format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    transports: [
        new winston.transports.Console(),
    ],
});
logger.info('dbseed:: init');
const parser = new argparse_1.ArgumentParser({
    version: '0.0.1',
    addHelp: true,
    description: 'cross-env executer',
});
parser.addArgument(['connectionString'], {
    help: 'connection string to place seed in',
});
parser.addArgument(['-n', '--name'], {
    help: 'db name',
    required: true,
});
parser.addArgument(['-c', '--clean'], {
    help: 'clean the db first',
    nargs: 0,
    required: false,
});
const args = parser.parseArgs();
init();
const relationsToAdd = [];
async function init() {
    logger.info(`dbseed:: connecting to db on ${args.connectionString}`);
    const client = await mongodb_1.MongoClient.connect(args.connectionString);
    let db = client.db(args.name);
    logger.info(`dbseed:: connection success`);
    if (args.clean) {
        logger.info(`dbseed:: cleaning db`);
        await db.dropDatabase();
        db = client.db(args.name);
    }
    const collectionContents = getFilesJSONContent('./data');
    logger.info(`dbseed:: filling collections`);
    for (const collectionContent of collectionContents) {
        logger.info(`dbseed:: filling collection ${collectionContent.collection} with ${collectionContent.data.length} rows`);
        const collection = db.collection(collectionContent.collection);
        await collection.insertMany(collectionContent.data);
        if (collectionContent.add_relations) {
            relationsToAdd.push({ collection, collectionContent });
        }
    }
    for (const relation of relationsToAdd) {
        const destinationDocuments = await relation.collection.find({}).toArray();
        for (const collectionRelation of relation.collectionContent.add_relations) {
            const sourceDocuments = await db.collection(collectionRelation.from_collection).find({}).toArray();
            for (const destinationDocument of destinationDocuments) {
                const randomIndex = Math.floor(Math.random() * sourceDocuments.length);
                destinationDocument[collectionRelation.to_field] = sourceDocuments[randomIndex]._id;
                await relation.collection.update({ _id: new mongodb_1.ObjectID(destinationDocument._id) }, destinationDocument);
            }
        }
    }
    logger.info(`dbseed:: seed complete, closing db connection`);
    await client.close();
}
function getFilesJSONContent(relativeFolderPath) {
    const folderPath = path.resolve(__dirname, relativeFolderPath);
    logger.info(`dbseed:: reading files from ${folderPath}`);
    const filesPaths = fs.readdirSync(folderPath)
        .filter((filename) => filename.endsWith('.json'))
        .map((filename) => path.resolve(__dirname, relativeFolderPath, filename));
    logger.info(`dbseed:: reading files complete for ${JSON.stringify(filesPaths, null, 2)}`);
    const jsonContent = [];
    for (const filePath of filesPaths) {
        const fileContent = fs.readFileSync(filePath, { encoding: 'utf8' });
        jsonContent.push(JSON.parse(fileContent));
    }
    return jsonContent;
}
//# sourceMappingURL=seed.js.map
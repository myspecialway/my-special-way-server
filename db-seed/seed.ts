#!/usr/bin/env node

import * as winston from 'winston';
import * as fs from 'fs';
import * as path from 'path';
import { MongoClient } from 'mongodb';
import { ArgumentParser } from 'argparse';

const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
    ),
    transports: [
        new winston.transports.Console(),
    ],
});

logger.info('dbseed:: init');
const parser = new ArgumentParser({
    version: '0.0.1',
    addHelp: true,
    description: 'cross-env executer',
});

parser.addArgument(
    ['connectionString'],
    {
        help: 'connection string to place seed in',
    },
);

parser.addArgument(
    ['-n', '--name'],
    {
        help: 'db name',
        required: true,
    },
);

parser.addArgument(
    ['-c', '--clean'],
    {
        help: 'clean the db first',
        nargs: 0,
        required: false,
    },
);

const args = parser.parseArgs();
init();

async function init() {
    logger.info(`dbseed:: connecting to db on ${args.connectionString}`);
    const client = await MongoClient.connect(args.connectionString);
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
    }
    logger.info(`dbseed:: seed complete, closing db connection`);
    await client.close();
}

function getFilesJSONContent(relativeFolderPath: string): FileCollectionContent[] {
    const folderPath = path.resolve(__dirname, relativeFolderPath);
    logger.info(`dbseed:: reading files from ${folderPath}`);
    const filesPaths = fs.readdirSync(folderPath)
        .filter((filename) => filename.endsWith('.json'))
        .map((filename) => path.resolve(__dirname, relativeFolderPath, filename));

    logger.info(`dbseed:: reading files complete for ${JSON.stringify(filesPaths, null, 2)}`);
    const jsonContent: FileCollectionContent[] = [];
    for (const filePath of filesPaths) {
        const fileContent = fs.readFileSync(filePath, { encoding: 'utf8' });
        jsonContent.push(JSON.parse(fileContent));
    }

    return jsonContent;
}

interface FileCollectionContent {
    collection: string;
    data: object[];
}

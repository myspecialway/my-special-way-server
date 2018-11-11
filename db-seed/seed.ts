#!/usr/bin/env node

import * as winston from 'winston';
import * as fs from 'fs';
import * as path from 'path';
import { MongoClient, Collection, ObjectID } from 'mongodb';
import { ArgumentParser } from 'argparse';

const logger = winston.createLogger({
  format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
  transports: [new winston.transports.Console()],
});

logger.info('dbseed:: init');
const parser = new ArgumentParser({
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

const relationsToAdd: Array<{ collection: Collection; collectionContent: FileCollectionContent }> = [];

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
  logger.info(`dbseed:: collections to insert: `);
  collectionContents.forEach((col) => {
    logger.info('' + col.loadOrder + '. ' + col.collection);
  });
  logger.info(`dbseed:: filling collections`);
  for (const collectionContent of collectionContents) {
    logger.info(
      `dbseed:: filling collection ${collectionContent.collection} with ${collectionContent.data.length} rows`,
    );
    const collection = db.collection(collectionContent.collection);
    if (collectionContent.collection === 'classes') {
      logger.info(`dbseed:: fixing lesson id's in class schedule`);
      // since collection list is sorted, we know that the database
      // contains lessons with generated ids, so we can use these id's in the class schedule
      for (const cls of collectionContent.data) {
        // get all schedule items which has lesson and udate the lesson object from,
        // lesson collection in the database.
        const scheduleItems: Array<{ lesson: { title: string; icon: string } }> = (cls as any).schedule.filter(
          (item) => item.lesson,
        );
        for (const scheduleItem of scheduleItems) {
          // find the lesson by title
          const cor = await db.collection('lessons').findOne({ title: scheduleItem.lesson.title });
          scheduleItem.lesson = cor;
        }
      }
    }
    await collection.insertMany(collectionContent.data);
    if (collectionContent.add_relations) {
      relationsToAdd.push({ collection, collectionContent });
    }
  }

  for (const relation of relationsToAdd) {
    const destinationDocuments = await relation.collection.find({}).toArray();

    for (const collectionRelation of relation.collectionContent.add_relations) {
      const sourceDocuments = await db
        .collection(collectionRelation.from_collection)
        .find({})
        .toArray();

      for (const destinationDocument of destinationDocuments) {
        const randomIndex = Math.floor(Math.random() * sourceDocuments.length);
        destinationDocument[collectionRelation.to_field] = sourceDocuments[randomIndex]._id;
        await relation.collection.update({ _id: new ObjectID(destinationDocument._id) }, destinationDocument);
      }
    }
  }
  logger.info(`dbseed:: seed complete, closing db connection`);
  await client.close();
}

function getFilesJSONContent(relativeFolderPath: string): FileCollectionContent[] {
  const folderPath = path.resolve(__dirname, relativeFolderPath);
  logger.info(`dbseed:: reading files from ${folderPath}`);
  const filesPaths = fs
    .readdirSync(folderPath)
    .filter((filename) => filename.endsWith('.json'))
    .map((filename) => path.resolve(__dirname, relativeFolderPath, filename));

  logger.info(`dbseed:: reading files complete for ${JSON.stringify(filesPaths, null, 2)}`);

  // currently we have 4 collections, we need to insert them by the given order,
  // so we can use the lessons created ids when inserting class with schedule
  const jsonContent: FileCollectionContent[] = [];
  for (const filePath of filesPaths) {
    const fileContent = fs.readFileSync(filePath, { encoding: 'utf8' });
    const collection = JSON.parse(fileContent);
    jsonContent.push(collection);
  }

  return jsonContent.sort((a, b) => {
    return a.loadOrder - b.loadOrder;
  });
}

interface FileCollectionContent {
  collection: string;
  data: object[];
  loadOrder: number;
  add_relations: [
    {
      from_collection: string;
      to_field: string;
      by: 'random';
    }
  ];
}

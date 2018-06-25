import MongodbMemoryServer from 'mongodb-memory-server';
import { UserDbModel } from '../../src/models/user.db.model';
import { ClassDbModel } from '../../src/models/class.db.model';
import { MongoClient } from 'mongodb';

let mongod;
export async function startMockMongodb() {
    mongod = new MongodbMemoryServer({
        instance: {
            port: 27018, // by default choose any free port
            dbName: 'msw-test', // by default generate random dbName
        },
        binary: {
            downloadDir: './.mongodb-binaries', // by default %HOME/.mongodb-binaries
        },
        autoStart: false,
    });
    return mongod.start();
}

export function stopMockMongodb() {
    mongod.stop();
}

export async function addMockClass(cl: ClassDbModel) {
    const connectionString = await mongod.getConnectionString();
    const connection = await MongoClient.connect(connectionString);
    const classesCollection = connection.db().collection('classes');
    await classesCollection.insertOne(cl);
}

export async function addMockUser(user: UserDbModel) {
    const connectionString = await mongod.getConnectionString();
    const connection = await MongoClient.connect(connectionString);
    const usersCollection = connection.db().collection('users');
    await usersCollection.insertOne(user);
}
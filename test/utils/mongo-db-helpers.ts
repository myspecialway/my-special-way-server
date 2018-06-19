import MongodbMemoryServer from 'mongodb-memory-server';
import { UserDbModel } from '../../src/models/user.db.model';
import { MongoClient } from 'mongodb';
let mongod;
let connectionString: string;
export async function startMockMongodb() {
    mongod = new MongodbMemoryServer({
        instance: {
            port: 27018, // by default choose any free port
            dbName: 'msw-test', // by default generate random dbName
        },
        binary: {
            downloadDir: './.mongo-binary', // by default %HOME/.mongodb-binaries
        },
    });

    connectionString = await mongod.getConnectionString();
    return connectionString;
}

export function stopMockMongodb() {
    mongod.stop();
}

export async function addMockUser(user: UserDbModel) {
    const connection = await MongoClient.connect(connectionString);
    const usersCollection = connection.db().collection('users');
    await usersCollection.insertOne(user);
}
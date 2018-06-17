import { MongoClient } from 'mongodb';
import { UserDbModel } from '../../src/models/user.db.model';
import { DbService } from '../../src/modules/persistence/db.service';
import { AuthService } from '../../src/modules/auth/auth-service/auth.service';
import { UsersPersistenceService } from '../../src/modules/persistence/users.persistence.service';

async function getDb() {
    const connection = await MongoClient.connect('mongodb://localhost:27018/msw-e2e-test');
    return connection.db();
}

export async function addUser(user: Partial<UserDbModel>) {
    const db = await getDb();

    const result = await db.collection('users').insertOne(user);
}

export async function generateToken() {
    await addUser({
        username: 'token-user',
        password: 'somePassword',
    });

    const dbService = new DbService();
    await dbService.initConnection('mongodb://localhost:27018/msw-e2e-test', 'msw-e2e-test');
    const authService = new AuthService(new UsersPersistenceService(dbService));
    const [error, token] = await authService.createTokenFromCridentials({
        username: 'token-user',
        password: 'somePassword',
    });

    return token;
}

export async function truncateDb() {
    const db = await getDb();
    const collections = await db.collections();

    const promises = [];
    for (const collection of collections) {
        promises.push(collection.drop());
    }

    return Promise.all(promises);
}
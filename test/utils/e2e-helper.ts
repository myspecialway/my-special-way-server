import axios, { AxiosError } from 'axios';
import { UserDbModel } from '../../src/models/user.db.model';
import { MongoClient } from 'mongodb';
import { ClassDbModel } from '../../src/models/class.db.model';

export async function getToken(username: string, password: string) {
    try {
        const response = await axios.post<{ accessToken: string }>('http://localhost:3000/login', {
            username,
            password,
        });
        return response.data.accessToken;
    } catch (error) {
        const typedErr = error as AxiosError;
        console.error(`e2e-helper:: getToken:: failed with status message ${typedErr.message}`);
        throw error;
    }
}

export async function addUser(user: Partial<UserDbModel>) {
    const client = await MongoClient.connect('mongodb://localhost:27018');
    const db = client.db('msw-test');
    const collection = db.collection('users');

    await collection.insertOne(user);
    return client.close();
}

export async function addClass(cl: Partial<ClassDbModel>) {
    const client = await MongoClient.connect('mongodb://localhost:27018');
    const db = client.db('msw-test');
    const collection = db.collection('classes');

    await collection.insertOne(cl);
    return client.close();
}


export async function resetDB() {
    const client = await MongoClient.connect('mongodb://localhost:27018');
    const db = client.db('msw-test');
    await db.dropDatabase();
    return client.close();
}
jest.mock('mongodb');
import { MongoClient, Db } from 'mongodb';

export function init() {
    (MongoClient.connect as jest.Mock).mockReturnValue(Promise.resolve({
        db: jest.fn().mockReturnValue({} as Partial<Db>),
    } as Partial<MongoClient>));
}
jest.mock('mongodb');
import { MongoClient, Db, Collection } from 'mongodb';

const find = jest.fn();
export function setupMongoMock() {
    (MongoClient.connect as jest.Mock).mockReturnValue(Promise.resolve({
        db: jest.fn().mockReturnValue({
            collection: jest.fn().mockReturnValue({
                find,
            } as Partial<Collection>),
        } as Partial<Db>),
    } as Partial<MongoClient>));
}

export function setFindREturnValue<T>(value: T) {
    find.mockReturnValueOnce(value);
}
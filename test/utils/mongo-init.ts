// tslint:disable-next-line:no-var-requires
const MongodbMemoryServer = require('mongodb-memory-server').default;

let mongod;

exports.setup = async () => {
    mongod = new MongodbMemoryServer({
        instance: {
            port: 27018,
            dbName: 'msw-e2e-test',
        },
        binary: {
            downloadDir: './.mongo-binary',
        },
    });

    const uri = await mongod.getConnectionString();
    const port = await mongod.getPort();
    const dbPath = await mongod.getDbPath();
    const dbName = await mongod.getDbName();
};

exports.teardown = async () => {
    mongod.stop();
};

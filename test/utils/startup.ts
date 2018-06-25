const MongodbMemoryServer = require('mongodb-memory-server').default;

module.exports = async () => {
    const mongod = new MongodbMemoryServer({
        binary: {
            downloadDir: './.mongodb-binaries', // by default %HOME/.mongodb-binaries
        },
        autoStart: false,
    });
    await mongod.start();
    mongod.stop();
}

module.exports = async () => {
    const mongoMock = require('./mongo-init.ts');
    return mongoMock.setup();
};
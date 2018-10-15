"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const common_1 = require("@nestjs/common");
const MONGO_CONNECTION_ERROR_MESSAGE = 'no connection available please connect using db.initConnection function';
let DbService = class DbService {
    constructor() {
        this.logger = new common_1.Logger('DbService', true);
    }
    async initConnection(connectionString, dbName) {
        this.logger.log(`initConnection:: initiating connection to ${connectionString}`);
        if (this.db) {
            this.logger.warn('initConnection:: connection already established');
            return;
        }
        try {
            const connection = await mongodb_1.MongoClient.connect(connectionString, { useNewUrlParser: true });
            this.db = connection.db(dbName);
            this.logger.log('initConnection:: connection initiated');
        }
        catch (error) {
            this.logger.error('initConnection:: error connecting to db', error.stack);
            throw error;
        }
    }
    getConnection() {
        if (!this.db) {
            const connectionError = new Error(MONGO_CONNECTION_ERROR_MESSAGE);
            this.logger.error(`initConnection:: ${MONGO_CONNECTION_ERROR_MESSAGE}`, connectionError.stack);
            throw connectionError;
        }
        return this.db;
    }
};
DbService = __decorate([
    common_1.Injectable()
], DbService);
exports.DbService = DbService;
function getDbServiceProvider(connectionString, dbName) {
    return {
        provide: DbService,
        useFactory: async () => {
            const dbService = new DbService();
            await dbService.initConnection(connectionString, dbName);
            return dbService;
        },
    };
}
exports.getDbServiceProvider = getDbServiceProvider;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL2R2ZXJub3Zza3kvcHJvZ3JhbW1pbmcvbXktc3BlY2lhbC13YXkvbXktc3BlY2lhbC13YXktc2VydmVyL3NyYy9tb2R1bGVzL3BlcnNpc3RlbmNlL2RiLnNlcnZpY2UudHMiLCJzb3VyY2VzIjpbIi9Vc2Vycy9kdmVybm92c2t5L3Byb2dyYW1taW5nL215LXNwZWNpYWwtd2F5L215LXNwZWNpYWwtd2F5LXNlcnZlci9zcmMvbW9kdWxlcy9wZXJzaXN0ZW5jZS9kYi5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEscUNBQTBDO0FBQzFDLDJDQUFvRDtBQUdwRCxNQUFNLDhCQUE4QixHQUFHLHlFQUF5RSxDQUFDO0FBR2pILElBQWEsU0FBUyxHQUF0QjtJQURBO1FBR1ksV0FBTSxHQUFHLElBQUksZUFBTSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsQ0FBQztJQTJCbkQsQ0FBQztJQXpCRyxLQUFLLENBQUMsY0FBYyxDQUFDLGdCQUF3QixFQUFFLE1BQWM7UUFDekQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsNkNBQTZDLGdCQUFnQixFQUFFLENBQUMsQ0FBQztRQUNqRixJQUFJLElBQUksQ0FBQyxFQUFFLEVBQUU7WUFDVCxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxpREFBaUQsQ0FBQyxDQUFDO1lBQ3BFLE9BQU87U0FDVjtRQUNELElBQUk7WUFDQSxNQUFNLFVBQVUsR0FBRyxNQUFNLHFCQUFXLENBQUMsT0FBTyxDQUFDLGdCQUFnQixFQUFFLEVBQUUsZUFBZSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7WUFDMUYsSUFBSSxDQUFDLEVBQUUsR0FBRyxVQUFVLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ2hDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHVDQUF1QyxDQUFDLENBQUM7U0FDNUQ7UUFBQyxPQUFPLEtBQUssRUFBRTtZQUNaLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLHlDQUF5QyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMxRSxNQUFNLEtBQUssQ0FBQztTQUNmO0lBQ0wsQ0FBQztJQUVELGFBQWE7UUFDVCxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRTtZQUNWLE1BQU0sZUFBZSxHQUFHLElBQUksS0FBSyxDQUFDLDhCQUE4QixDQUFDLENBQUM7WUFDbEUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsb0JBQW9CLDhCQUE4QixFQUFFLEVBQUUsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQy9GLE1BQU0sZUFBZSxDQUFDO1NBQ3pCO1FBRUQsT0FBTyxJQUFJLENBQUMsRUFBRSxDQUFDO0lBQ25CLENBQUM7Q0FDSixDQUFBO0FBN0JZLFNBQVM7SUFEckIsbUJBQVUsRUFBRTtHQUNBLFNBQVMsQ0E2QnJCO0FBN0JZLDhCQUFTO0FBK0J0Qiw4QkFBcUMsZ0JBQXdCLEVBQUUsTUFBYztJQUN6RSxPQUFPO1FBQ0gsT0FBTyxFQUFFLFNBQVM7UUFDbEIsVUFBVSxFQUFFLEtBQUssSUFBSSxFQUFFO1lBQ25CLE1BQU0sU0FBUyxHQUFHLElBQUksU0FBUyxFQUFFLENBQUM7WUFDbEMsTUFBTSxTQUFTLENBQUMsY0FBYyxDQUFDLGdCQUFnQixFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBRXpELE9BQU8sU0FBUyxDQUFDO1FBQ3JCLENBQUM7S0FDSixDQUFDO0FBQ04sQ0FBQztBQVZELG9EQVVDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTW9uZ29DbGllbnQsIERiIH0gZnJvbSAnbW9uZ29kYic7XG5pbXBvcnQgeyBJbmplY3RhYmxlLCBMb2dnZXIgfSBmcm9tICdAbmVzdGpzL2NvbW1vbic7XG5pbXBvcnQgeyBGYWN0b3J5UHJvdmlkZXIgfSBmcm9tICdAbmVzdGpzL2NvbW1vbi9pbnRlcmZhY2VzJztcblxuY29uc3QgTU9OR09fQ09OTkVDVElPTl9FUlJPUl9NRVNTQUdFID0gJ25vIGNvbm5lY3Rpb24gYXZhaWxhYmxlIHBsZWFzZSBjb25uZWN0IHVzaW5nIGRiLmluaXRDb25uZWN0aW9uIGZ1bmN0aW9uJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIERiU2VydmljZSB7XG4gICAgcHJpdmF0ZSBkYjogRGI7XG4gICAgcHJpdmF0ZSBsb2dnZXIgPSBuZXcgTG9nZ2VyKCdEYlNlcnZpY2UnLCB0cnVlKTtcblxuICAgIGFzeW5jIGluaXRDb25uZWN0aW9uKGNvbm5lY3Rpb25TdHJpbmc6IHN0cmluZywgZGJOYW1lOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5sb2dnZXIubG9nKGBpbml0Q29ubmVjdGlvbjo6IGluaXRpYXRpbmcgY29ubmVjdGlvbiB0byAke2Nvbm5lY3Rpb25TdHJpbmd9YCk7XG4gICAgICAgIGlmICh0aGlzLmRiKSB7XG4gICAgICAgICAgICB0aGlzLmxvZ2dlci53YXJuKCdpbml0Q29ubmVjdGlvbjo6IGNvbm5lY3Rpb24gYWxyZWFkeSBlc3RhYmxpc2hlZCcpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBjb25uZWN0aW9uID0gYXdhaXQgTW9uZ29DbGllbnQuY29ubmVjdChjb25uZWN0aW9uU3RyaW5nLCB7IHVzZU5ld1VybFBhcnNlcjogdHJ1ZSB9KTtcbiAgICAgICAgICAgIHRoaXMuZGIgPSBjb25uZWN0aW9uLmRiKGRiTmFtZSk7XG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5sb2coJ2luaXRDb25uZWN0aW9uOjogY29ubmVjdGlvbiBpbml0aWF0ZWQnKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmVycm9yKCdpbml0Q29ubmVjdGlvbjo6IGVycm9yIGNvbm5lY3RpbmcgdG8gZGInLCBlcnJvci5zdGFjayk7XG4gICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldENvbm5lY3Rpb24oKTogRGIge1xuICAgICAgICBpZiAoIXRoaXMuZGIpIHtcbiAgICAgICAgICAgIGNvbnN0IGNvbm5lY3Rpb25FcnJvciA9IG5ldyBFcnJvcihNT05HT19DT05ORUNUSU9OX0VSUk9SX01FU1NBR0UpO1xuICAgICAgICAgICAgdGhpcy5sb2dnZXIuZXJyb3IoYGluaXRDb25uZWN0aW9uOjogJHtNT05HT19DT05ORUNUSU9OX0VSUk9SX01FU1NBR0V9YCwgY29ubmVjdGlvbkVycm9yLnN0YWNrKTtcbiAgICAgICAgICAgIHRocm93IGNvbm5lY3Rpb25FcnJvcjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLmRiO1xuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldERiU2VydmljZVByb3ZpZGVyKGNvbm5lY3Rpb25TdHJpbmc6IHN0cmluZywgZGJOYW1lOiBzdHJpbmcpOiBGYWN0b3J5UHJvdmlkZXIge1xuICAgIHJldHVybiB7XG4gICAgICAgIHByb3ZpZGU6IERiU2VydmljZSxcbiAgICAgICAgdXNlRmFjdG9yeTogYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZGJTZXJ2aWNlID0gbmV3IERiU2VydmljZSgpO1xuICAgICAgICAgICAgYXdhaXQgZGJTZXJ2aWNlLmluaXRDb25uZWN0aW9uKGNvbm5lY3Rpb25TdHJpbmcsIGRiTmFtZSk7XG5cbiAgICAgICAgICAgIHJldHVybiBkYlNlcnZpY2U7XG4gICAgICAgIH0sXG4gICAgfTtcbn1cbiJdfQ==
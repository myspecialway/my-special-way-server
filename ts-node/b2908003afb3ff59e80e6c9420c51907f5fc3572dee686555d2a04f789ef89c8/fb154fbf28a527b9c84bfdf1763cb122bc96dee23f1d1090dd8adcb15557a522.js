"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const db_service_1 = require("./db.service");
const mongodb_1 = require("mongodb");
const class_persistence_service_1 = require("./class.persistence.service");
const schedule_persistence_service_1 = require("./schedule.persistence.service");
let UsersPersistenceService = class UsersPersistenceService {
    constructor(dbService, classPersistenceService, schedulePersistenceService) {
        this.dbService = dbService;
        this.classPersistenceService = classPersistenceService;
        this.schedulePersistenceService = schedulePersistenceService;
        this.logger = new common_1.Logger('UsersPersistenceService');
        const db = this.dbService.getConnection();
        this.collection = db.collection('users');
    }
    buildMongoFilterFromQuery(query, id) {
        if (id) {
            const mongoId = new mongodb_1.ObjectID(id);
            query._id = mongoId;
        }
        return query;
    }
    async getAll() {
        try {
            this.logger.log('getAll:: fetching users');
            return await this.collection.find({}).toArray();
        }
        catch (error) {
            this.logger.error('getAll:: error fetching users', error.stack);
            throw error;
        }
    }
    async getUsersByFilters(queyParams) {
        try {
            const mongoQuery = this.buildMongoFilterFromQuery(queyParams);
            this.logger.log(`getUsersByFilters:: fetching users by parameters `);
            return await this.collection.find(mongoQuery).toArray();
        }
        catch (error) {
            this.logger.error(`getUsersByFilters:: error fetching user by parameters`, error.stack);
            throw error;
        }
    }
    async getUserByFilters(queyParams, id) {
        try {
            const mongoQuery = this.buildMongoFilterFromQuery(queyParams, id);
            this.logger.log(`getUsersByFilters:: fetching users by parameters `);
            return await this.collection.findOne(mongoQuery);
        }
        catch (error) {
            this.logger.error(`getUsersByFilters:: error fetching user by parameters`, error.stack);
            throw error;
        }
    }
    // CRUD on users
    async getById(id) {
        try {
            const mongoId = new mongodb_1.ObjectID(id);
            this.logger.log(`getAll:: fetching user by id ${id}`);
            return await this.collection.findOne({ _id: mongoId });
        }
        catch (error) {
            this.logger.error(`getAll:: error fetching user by id ${id}`, error.stack);
            throw error;
        }
    }
    async createUser(user, userRole) {
        try {
            this.logger.log(`createUser:: creates user with username ${user.username}`);
            if (userRole) {
                user.role = userRole;
            }
            const insertResponse = await this.collection.insertOne(user);
            const newDocument = await this.getById(insertResponse.insertedId.toString());
            this.logger.log(`createUser:: inserted user to DB with id: ${newDocument._id}`);
            return [null, newDocument];
        }
        catch (error) {
            this.logger.error(`createUser:: error adding user `, error.stack);
            return [error, null];
        }
    }
    async updateUser(id, user, userRole) {
        if (userRole) {
            user.role = userRole;
        }
        const mongoId = new mongodb_1.ObjectID(id);
        try {
            this.logger.log(`updateUser:: updating user ${mongoId}`);
            const currentDoc = await this.getById(id);
            const updatedDocument = await this.collection.findOneAndUpdate({ _id: mongoId }, { ...currentDoc, ...user }, { returnOriginal: false });
            this.logger.log(`updateUser:: updated DB :${JSON.stringify(updatedDocument.value)}`);
            return [null, updatedDocument.value];
        }
        catch (error) {
            this.logger.error(`updateUser:: error updating user ${mongoId}`, error.stack);
            return [error, null];
        }
    }
    async deleteUser(id) {
        try {
            const mongoId = new mongodb_1.ObjectID(id);
            this.logger.log(`deleteUser:: deleting user by id ${id}`);
            const deleteResponse = await this.collection.deleteOne({ _id: mongoId });
            this.logger.log(`deleteUser:: removed ${deleteResponse.deletedCount} documents`);
            return [null, deleteResponse.deletedCount];
        }
        catch (error) {
            this.logger.error(`deleteUser:: error deleting user by id ${id}`, error.stack);
            return [error, null];
        }
    }
    // Authentication
    // TODO move into a specific service
    async authenticateUser({ username, password }) {
        try {
            this.logger.log(`authenticateUser:: authenticating user ${username}`);
            const user = await this.collection.findOne({ username, password });
            if (!user) {
                this.logger.warn(`authenticateUser:: user ${username} not found in db`);
                throw new Error(`authenticateUser:: user ${username} not found in db`);
            }
            return [null, user];
        }
        catch (error) {
            this.logger.error(`authenticateUser:: error authenticating user ${username}`, error.stack);
            return [error, null];
        }
    }
    async getByUsername(username) {
        try {
            this.logger.log(`getByUsername:: fetching user by username ${username}`);
            return [null, await this.collection.findOne({ username })];
        }
        catch (error) {
            this.logger.error(`getAll:: error fetching user by username ${username}`, error.stack);
            return [error, null];
        }
    }
    // Class
    // TODO move into class service
    async getStudentsByClassId(classId) {
        try {
            this.logger.log(`getStudentsByClassId:: fetching students by class id ${classId}`);
            const res = await this.collection.find({ class_id: new mongodb_1.ObjectID(classId), role: 'STUDENT' }).toArray();
            return [null, res];
        }
        catch (error) {
            this.logger.error(`getStudentsByClassId:: error fetching students by class id ${classId}`, error.stack);
            throw [error, null];
        }
    }
    async getStudentSchedule(student) {
        try {
            if (!student.schedule) {
                student.schedule = [];
            }
            if (!student.class_id) {
                return [null, student.schedule];
            }
            this.logger.log(`getStudentSchedule:: fetching student-${student.schedule} class schedule`);
            const studentClass = await this.classPersistenceService.getById(student.class_id);
            if (!studentClass || !studentClass.schedule) {
                return [null, student.schedule];
            }
            return [null, this.schedulePersistenceService.mergeSchedule(studentClass.schedule, student.schedule, 'index')];
        }
        catch (error) {
            this.logger.error(`getStudentSchedule:: error fetching student schedule`, error.stack);
            throw [error, null];
        }
    }
};
UsersPersistenceService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [db_service_1.DbService,
        class_persistence_service_1.ClassPersistenceService,
        schedule_persistence_service_1.SchedulePersistenceService])
], UsersPersistenceService);
exports.UsersPersistenceService = UsersPersistenceService;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL2R2ZXJub3Zza3kvcHJvZ3JhbW1pbmcvbXktc3BlY2lhbC13YXkvbXktc3BlY2lhbC13YXktc2VydmVyL3NyYy9tb2R1bGVzL3BlcnNpc3RlbmNlL3VzZXJzLnBlcnNpc3RlbmNlLnNlcnZpY2UudHMiLCJzb3VyY2VzIjpbIi9Vc2Vycy9kdmVybm92c2t5L3Byb2dyYW1taW5nL215LXNwZWNpYWwtd2F5L215LXNwZWNpYWwtd2F5LXNlcnZlci9zcmMvbW9kdWxlcy9wZXJzaXN0ZW5jZS91c2Vycy5wZXJzaXN0ZW5jZS5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsMkNBQW9EO0FBQ3BELDZDQUF5QztBQUN6QyxxQ0FBK0M7QUFHL0MsMkVBQXNFO0FBQ3RFLGlGQUE0RTtBQUs1RSxJQUFhLHVCQUF1QixHQUFwQztJQUlJLFlBQ1ksU0FBb0IsRUFDcEIsdUJBQWdELEVBQ2hELDBCQUFzRDtRQUZ0RCxjQUFTLEdBQVQsU0FBUyxDQUFXO1FBQ3BCLDRCQUF1QixHQUF2Qix1QkFBdUIsQ0FBeUI7UUFDaEQsK0JBQTBCLEdBQTFCLDBCQUEwQixDQUE0QjtRQUwxRCxXQUFNLEdBQUcsSUFBSSxlQUFNLENBQUMseUJBQXlCLENBQUMsQ0FBQztRQU9uRCxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQzFDLElBQUksQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDLFVBQVUsQ0FBYyxPQUFPLENBQUMsQ0FBQztJQUMxRCxDQUFDO0lBRU8seUJBQXlCLENBQUMsS0FBNEIsRUFBRSxFQUFXO1FBQ3ZFLElBQUksRUFBRSxFQUFFO1lBQ0osTUFBTSxPQUFPLEdBQUcsSUFBSSxrQkFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ2pDLEtBQUssQ0FBQyxHQUFHLEdBQUcsT0FBTyxDQUFDO1NBQ3ZCO1FBQ0QsT0FBTyxLQUFLLENBQUM7SUFDakIsQ0FBQztJQUVELEtBQUssQ0FBQyxN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SSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsc0RBQXNELEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3ZGLE1BQU0sQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDdkI7SUFDTCxDQUFDO0NBQ0osQ0FBQTtBQS9LWSx1QkFBdUI7SUFEbkMsbUJBQVUsRUFBRTtxQ0FNYyxzQkFBUztRQUNLLG1EQUF1QjtRQUNwQix5REFBMEI7R0FQekQsdUJBQXVCLENBK0tuQztBQS9LWSwwREFBdUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlLCBMb2dnZXIgfSBmcm9tICdAbmVzdGpzL2NvbW1vbic7XG5pbXBvcnQgeyBEYlNlcnZpY2UgfSBmcm9tICcuL2RiLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ29sbGVjdGlvbiwgT2JqZWN0SUQgfSBmcm9tICdtb25nb2RiJztcbmltcG9ydCB7IFVzZXJEYk1vZGVsLCBVc2VyUm9sZSB9IGZyb20gJ21vZGVscy91c2VyLmRiLm1vZGVsJztcbmltcG9ydCB7IFVzZXJMb2dpblJlcXVlc3QgfSBmcm9tICdtb2RlbHMvdXNlci1sb2dpbi1yZXF1ZXN0Lm1vZGVsJztcbmltcG9ydCB7IENsYXNzUGVyc2lzdGVuY2VTZXJ2aWNlIH0gZnJvbSAnLi9jbGFzcy5wZXJzaXN0ZW5jZS5zZXJ2aWNlJztcbmltcG9ydCB7IFNjaGVkdWxlUGVyc2lzdGVuY2VTZXJ2aWNlIH0gZnJvbSAnLi9zY2hlZHVsZS5wZXJzaXN0ZW5jZS5zZXJ2aWNlJztcbmltcG9ydCB7IElVc2Vyc1BlcnNpc3RlbmNlU2VydmljZSB9IGZyb20gJy4vaW50ZXJmYWNlcy91c2Vycy5wZXJzaXN0ZW5jZS5zZXJ2aWNlLmludGVyZmFjZSc7XG5pbXBvcnQgeyBUaW1lU2xvdERiTW9kZWwgfSBmcm9tICdtb2RlbHMvdGltZXNsb3QuZGIubW9kZWwnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgVXNlcnNQZXJzaXN0ZW5jZVNlcnZpY2UgaW1wbGVtZW50cyBJVXNlcnNQZXJzaXN0ZW5jZVNlcnZpY2Uge1xuICAgIHByaXZhdGUgY29sbGVjdGlvbjogQ29sbGVjdGlvbjxVc2VyRGJNb2RlbD47XG4gICAgcHJpdmF0ZSBsb2dnZXIgPSBuZXcgTG9nZ2VyKCdVc2Vyc1BlcnNpc3RlbmNlU2VydmljZScpO1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByaXZhdGUgZGJTZXJ2aWNlOiBEYlNlcnZpY2UsXG4gICAgICAgIHByaXZhdGUgY2xhc3NQZXJzaXN0ZW5jZVNlcnZpY2U6IENsYXNzUGVyc2lzdGVuY2VTZXJ2aWNlLFxuICAgICAgICBwcml2YXRlIHNjaGVkdWxlUGVyc2lzdGVuY2VTZXJ2aWNlOiBTY2hlZHVsZVBlcnNpc3RlbmNlU2VydmljZSxcbiAgICApIHtcbiAgICAgICAgY29uc3QgZGIgPSB0aGlzLmRiU2VydmljZS5nZXRDb25uZWN0aW9uKCk7XG4gICAgICAgIHRoaXMuY29sbGVjdGlvbiA9IGRiLmNvbGxlY3Rpb248VXNlckRiTW9kZWw+KCd1c2VycycpO1xuICAgIH1cblxuICAgIHByaXZhdGUgYnVpbGRNb25nb0ZpbHRlckZyb21RdWVyeShxdWVyeTogeyBbaWQ6IHN0cmluZ106IGFueSB9LCBpZD86IHN0cmluZyk6IHsgW2lkOiBzdHJpbmddOiBzdHJpbmcgfSB7XG4gICAgICAgIGlmIChpZCkge1xuICAgICAgICAgICAgY29uc3QgbW9uZ29JZCA9IG5ldyBPYmplY3RJRChpZCk7XG4gICAgICAgICAgICBxdWVyeS5faWQgPSBtb25nb0lkO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBxdWVyeTtcbiAgICB9XG5cbiAgICBhc3luYyBnZXRBbGwoKTogUHJvbWlzZTxVc2VyRGJNb2RlbFtdPiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5sb2coJ2dldEFsbDo6IGZldGNoaW5nIHVzZXJzJyk7XG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5jb2xsZWN0aW9uLmZpbmQoe30pLnRvQXJyYXkoKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmVycm9yKCdnZXRBbGw6OiBlcnJvciBmZXRjaGluZyB1c2VycycsIGVycm9yLnN0YWNrKTtcbiAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXN5bmMgZ2V0VXNlcnNCeUZpbHRlcnMocXVleVBhcmFtczogeyBbaWQ6IHN0cmluZ106IHN0cmluZyB9KTogUHJvbWlzZTxVc2VyRGJNb2RlbFtdPiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBtb25nb1F1ZXJ5ID0gdGhpcy5idWlsZE1vbmdvRmlsdGVyRnJvbVF1ZXJ5KHF1ZXlQYXJhbXMpO1xuXG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5sb2coYGdldFVzZXJzQnlGaWx0ZXJzOjogZmV0Y2hpbmcgdXNlcnMgYnkgcGFyYW1ldGVycyBgKTtcbiAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLmNvbGxlY3Rpb24uZmluZChtb25nb1F1ZXJ5KS50b0FycmF5KCk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5lcnJvcihgZ2V0VXNlcnNCeUZpbHRlcnM6OiBlcnJvciBmZXRjaGluZyB1c2VyIGJ5IHBhcmFtZXRlcnNgLCBlcnJvci5zdGFjayk7XG4gICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFzeW5jIGdldFVzZXJCeUZpbHRlcnMocXVleVBhcmFtczogeyBbaWQ6IHN0cmluZ106IHN0cmluZyB9LCBpZD86IHN0cmluZyk6IFByb21pc2U8VXNlckRiTW9kZWw+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IG1vbmdvUXVlcnkgPSB0aGlzLmJ1aWxkTW9uZ29GaWx0ZXJGcm9tUXVlcnkocXVleVBhcmFtcywgaWQpO1xuXG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5sb2coYGdldFVzZXJzQnlGaWx0ZXJzOjogZmV0Y2hpbmcgdXNlcnMgYnkgcGFyYW1ldGVycyBgKTtcbiAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLmNvbGxlY3Rpb24uZmluZE9uZShtb25nb1F1ZXJ5KTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmVycm9yKGBnZXRVc2Vyc0J5RmlsdGVyczo6IGVycm9yIGZldGNoaW5nIHVzZXIgYnkgcGFyYW1ldGVyc2AsIGVycm9yLnN0YWNrKTtcbiAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gQ1JVRCBvbiB1c2Vyc1xuICAgIGFzeW5jIGdldEJ5SWQoaWQ6IHN0cmluZyk6IFByb21pc2U8VXNlckRiTW9kZWw+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IG1vbmdvSWQgPSBuZXcgT2JqZWN0SUQoaWQpO1xuICAgICAgICAgICAgdGhpcy5sb2dnZXIubG9nKGBnZXRBbGw6OiBmZXRjaGluZyB1c2VyIGJ5IGlkICR7aWR9YCk7XG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5jb2xsZWN0aW9uLmZpbmRPbmUoeyBfaWQ6IG1vbmdvSWQgfSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5lcnJvcihgZ2V0QWxsOjogZXJyb3IgZmV0Y2hpbmcgdXNlciBieSBpZCAke2lkfWAsIGVycm9yLnN0YWNrKTtcbiAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXN5bmMgY3JlYXRlVXNlcih1c2VyOiBVc2VyRGJNb2RlbCwgdXNlclJvbGU/OiBVc2VyUm9sZSk6IFByb21pc2U8W0Vycm9yLCBVc2VyRGJNb2RlbF0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmxvZyhgY3JlYXRlVXNlcjo6IGNyZWF0ZXMgdXNlciB3aXRoIHVzZXJuYW1lICR7dXNlci51c2VybmFtZX1gKTtcbiAgICAgICAgICAgIGlmICh1c2VyUm9sZSkge1xuICAgICAgICAgICAgICAgIHVzZXIucm9sZSA9IHVzZXJSb2xlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBpbnNlcnRSZXNwb25zZSA9IGF3YWl0IHRoaXMuY29sbGVjdGlvbi5pbnNlcnRPbmUodXNlcik7XG4gICAgICAgICAgICBjb25zdCBuZXdEb2N1bWVudCA9IGF3YWl0IHRoaXMuZ2V0QnlJZChpbnNlcnRSZXNwb25zZS5pbnNlcnRlZElkLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgdGhpcy5sb2dnZXIubG9nKGBjcmVhdGVVc2VyOjogaW5zZXJ0ZWQgdXNlciB0byBEQiB3aXRoIGlkOiAke25ld0RvY3VtZW50Ll9pZH1gKTtcblxuICAgICAgICAgICAgcmV0dXJuIFtudWxsLCBuZXdEb2N1bWVudF07XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5lcnJvcihgY3JlYXRlVXNlcjo6IGVycm9yIGFkZGluZyB1c2VyIGAsIGVycm9yLnN0YWNrKTtcbiAgICAgICAgICAgIHJldHVybiBbZXJyb3IsIG51bGxdO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXN5bmMgdXBkYXRlVXNlcihpZDogc3RyaW5nLCB1c2VyOiBVc2VyRGJNb2RlbCwgdXNlclJvbGU/OiBVc2VyUm9sZSk6IFByb21pc2U8W0Vycm9yLCBVc2VyRGJNb2RlbF0+IHtcbiAgICAgICAgaWYgKHVzZXJSb2xlKSB7XG4gICAgICAgICAgICB1c2VyLnJvbGUgPSB1c2VyUm9sZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBtb25nb0lkID0gbmV3IE9iamVjdElEKGlkKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmxvZyhgdXBkYXRlVXNlcjo6IHVwZGF0aW5nIHVzZXIgJHttb25nb0lkfWApO1xuICAgICAgICAgICAgY29uc3QgY3VycmVudERvYyA9IGF3YWl0IHRoaXMuZ2V0QnlJZChpZCk7XG4gICAgICAgICAgICBjb25zdCB1cGRhdGVkRG9jdW1lbnQgPSBhd2FpdCB0aGlzLmNvbGxlY3Rpb24uZmluZE9uZUFuZFVwZGF0ZSh7IF9pZDogbW9uZ29JZCB9LCB7IC4uLmN1cnJlbnREb2MsIC4uLnVzZXIgfSwgeyByZXR1cm5PcmlnaW5hbDogZmFsc2UgfSk7XG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5sb2coYHVwZGF0ZVVzZXI6OiB1cGRhdGVkIERCIDoke0pTT04uc3RyaW5naWZ5KHVwZGF0ZWREb2N1bWVudC52YWx1ZSl9YCk7XG4gICAgICAgICAgICByZXR1cm4gW251bGwsIHVwZGF0ZWREb2N1bWVudC52YWx1ZV07XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5lcnJvcihgdXBkYXRlVXNlcjo6IGVycm9yIHVwZGF0aW5nIHVzZXIgJHttb25nb0lkfWAsIGVycm9yLnN0YWNrKTtcbiAgICAgICAgICAgIHJldHVybiBbZXJyb3IsIG51bGxdO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXN5bmMgZGVsZXRlVXNlcihpZDogc3RyaW5nKTogUHJvbWlzZTxbRXJyb3IsIG51bWJlcl0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IG1vbmdvSWQgPSBuZXcgT2JqZWN0SUQoaWQpO1xuICAgICAgICAgICAgdGhpcy5sb2dnZXIubG9nKGBkZWxldGVVc2VyOjogZGVsZXRpbmcgdXNlciBieSBpZCAke2lkfWApO1xuICAgICAgICAgICAgY29uc3QgZGVsZXRlUmVzcG9uc2UgPSBhd2FpdCB0aGlzLmNvbGxlY3Rpb24uZGVsZXRlT25lKHsgX2lkOiBtb25nb0lkIH0pO1xuICAgICAgICAgICAgdGhpcy5sb2dnZXIubG9nKGBkZWxldGVVc2VyOjogcmVtb3ZlZCAke2RlbGV0ZVJlc3BvbnNlLmRlbGV0ZWRDb3VudH0gZG9jdW1lbnRzYCk7XG4gICAgICAgICAgICByZXR1cm4gW251bGwsIGRlbGV0ZVJlc3BvbnNlLmRlbGV0ZWRDb3VudF07XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5lcnJvcihgZGVsZXRlVXNlcjo6IGVycm9yIGRlbGV0aW5nIHVzZXIgYnkgaWQgJHtpZH1gLCBlcnJvci5zdGFjayk7XG4gICAgICAgICAgICByZXR1cm4gW2Vycm9yLCBudWxsXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIEF1dGhlbnRpY2F0aW9uXG4gICAgLy8gVE9ETyBtb3ZlIGludG8gYSBzcGVjaWZpYyBzZXJ2aWNlXG4gICAgYXN5bmMgYXV0aGVudGljYXRlVXNlcih7IHVzZXJuYW1lLCBwYXNzd29yZCB9OiBVc2VyTG9naW5SZXF1ZXN0KTogUHJvbWlzZTxbRXJyb3IsIFVzZXJEYk1vZGVsXT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGhpcy5sb2dnZXIubG9nKGBhdXRoZW50aWNhdGVVc2VyOjogYXV0aGVudGljYXRpbmcgdXNlciAke3VzZXJuYW1lfWApO1xuICAgICAgICAgICAgY29uc3QgdXNlciA9IGF3YWl0IHRoaXMuY29sbGVjdGlvbi5maW5kT25lKHsgdXNlcm5hbWUsIHBhc3N3b3JkIH0pO1xuICAgICAgICAgICAgaWYgKCF1c2VyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2dnZXIud2FybihgYXV0aGVudGljYXRlVXNlcjo6IHVzZXIgJHt1c2VybmFtZX0gbm90IGZvdW5kIGluIGRiYCk7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBhdXRoZW50aWNhdGVVc2VyOjogdXNlciAke3VzZXJuYW1lfSBub3QgZm91bmQgaW4gZGJgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIFtudWxsLCB1c2VyXTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmVycm9yKGBhdXRoZW50aWNhdGVVc2VyOjogZXJyb3IgYXV0aGVudGljYXRpbmcgdXNlciAke3VzZXJuYW1lfWAsIGVycm9yLnN0YWNrKTtcbiAgICAgICAgICAgIHJldHVybiBbZXJyb3IsIG51bGxdO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXN5bmMgZ2V0QnlVc2VybmFtZSh1c2VybmFtZTogc3RyaW5nKTogUHJvbWlzZTxbRXJyb3IsIFVzZXJEYk1vZGVsXT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGhpcy5sb2dnZXIubG9nKGBnZXRCeVVzZXJuYW1lOjogZmV0Y2hpbmcgdXNlciBieSB1c2VybmFtZSAke3VzZXJuYW1lfWApO1xuICAgICAgICAgICAgcmV0dXJuIFtudWxsLCBhd2FpdCB0aGlzLmNvbGxlY3Rpb24uZmluZE9uZSh7IHVzZXJuYW1lIH0pXTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmVycm9yKGBnZXRBbGw6OiBlcnJvciBmZXRjaGluZyB1c2VyIGJ5IHVzZXJuYW1lICR7dXNlcm5hbWV9YCwgZXJyb3Iuc3RhY2spO1xuICAgICAgICAgICAgcmV0dXJuIFtlcnJvciwgbnVsbF07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBDbGFzc1xuICAgIC8vIFRPRE8gbW92ZSBpbnRvIGNsYXNzIHNlcnZpY2VcbiAgICBhc3luYyBnZXRTdHVkZW50c0J5Q2xhc3NJZChjbGFzc0lkOiBzdHJpbmcpOiBQcm9taXNlPFtFcnJvciwgVXNlckRiTW9kZWxbXV0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmxvZyhgZ2V0U3R1ZGVudHNCeUNsYXNzSWQ6OiBmZXRjaGluZyBzdHVkZW50cyBieSBjbGFzcyBpZCAke2NsYXNzSWR9YCk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCB0aGlzLmNvbGxlY3Rpb24uZmluZCh7IGNsYXNzX2lkOiBuZXcgT2JqZWN0SUQoY2xhc3NJZCksIHJvbGU6ICdTVFVERU5UJyB9KS50b0FycmF5KCk7XG4gICAgICAgICAgICByZXR1cm4gW251bGwsIHJlc107XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5lcnJvcihgZ2V0U3R1ZGVudHNCeUNsYXNzSWQ6OiBlcnJvciBmZXRjaGluZyBzdHVkZW50cyBieSBjbGFzcyBpZCAke2NsYXNzSWR9YCwgZXJyb3Iuc3RhY2spO1xuICAgICAgICAgICAgdGhyb3cgW2Vycm9yLCBudWxsXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFzeW5jIGdldFN0dWRlbnRTY2hlZHVsZShzdHVkZW50OiBVc2VyRGJNb2RlbCk6IFByb21pc2U8W0Vycm9yLCBUaW1lU2xvdERiTW9kZWxbXV0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmICghc3R1ZGVudC5zY2hlZHVsZSkge1xuICAgICAgICAgICAgICAgIHN0dWRlbnQuc2NoZWR1bGUgPSBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghc3R1ZGVudC5jbGFzc19pZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBbbnVsbCwgc3R1ZGVudC5zY2hlZHVsZV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5sb2coYGdldFN0dWRlbnRTY2hlZHVsZTo6IGZldGNoaW5nIHN0dWRlbnQtJHtzdHVkZW50LnNjaGVkdWxlfSBjbGFzcyBzY2hlZHVsZWApO1xuICAgICAgICAgICAgY29uc3Qgc3R1ZGVudENsYXNzID0gYXdhaXQgdGhpcy5jbGFzc1BlcnNpc3RlbmNlU2VydmljZS5nZXRCeUlkKHN0dWRlbnQuY2xhc3NfaWQpO1xuICAgICAgICAgICAgaWYgKCFzdHVkZW50Q2xhc3MgfHwgIXN0dWRlbnRDbGFzcy5zY2hlZHVsZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBbbnVsbCwgc3R1ZGVudC5zY2hlZHVsZV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gW251bGwsIHRoaXMuc2NoZWR1bGVQZXJzaXN0ZW5jZVNlcnZpY2UubWVyZ2VTY2hlZHVsZShzdHVkZW50Q2xhc3Muc2NoZWR1bGUsIHN0dWRlbnQuc2NoZWR1bGUsICdpbmRleCcpXTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmVycm9yKGBnZXRTdHVkZW50U2NoZWR1bGU6OiBlcnJvciBmZXRjaGluZyBzdHVkZW50IHNjaGVkdWxlYCwgZXJyb3Iuc3RhY2spO1xuICAgICAgICAgICAgdGhyb3cgW2Vycm9yLCBudWxsXTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==
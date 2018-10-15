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
const schedule_persistence_service_1 = require("./schedule.persistence.service");
const mongodb_1 = require("mongodb");
const crud_persistance_service_1 = require("./crud-persistance.service");
let ClassPersistenceService = class ClassPersistenceService extends crud_persistance_service_1.CRUDPersistance {
    constructor(dbService, schedulePersistenceService) {
        super('classes', dbService);
        this.schedulePersistenceService = schedulePersistenceService;
    }
    async getByName(name) {
        const msg = `getByName:: fetching class by name ${name}`;
        try {
            this.logger.log(msg);
            return await this.collection.findOne({ name });
        }
        catch (error) {
            this.logger.error(msg, error.stack);
            throw error;
        }
    }
    async updateClass(id, classObj) {
        const mongoId = new mongodb_1.ObjectID(id);
        try {
            this.logger.log(`ClassPersistence::updateClass:: updating class ${mongoId}`);
            const currentClass = await this.getById(id);
            classObj.schedule = this.schedulePersistenceService.mergeSchedule(currentClass.schedule || [], classObj.schedule, 'index');
            const updatedDocument = await this.collection.findOneAndUpdate({ _id: mongoId }, { ...currentClass, ...classObj }, { returnOriginal: false });
            this.logger.log(`ClassPersistence::updateClass:: updated DB :${JSON.stringify(updatedDocument.value)}`);
            return updatedDocument.value;
        }
        catch (error) {
            this.logger.error(`ClassPersistence::updateClass:: error updating class ${mongoId}`, error.stack);
            throw error;
        }
    }
};
ClassPersistenceService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [db_service_1.DbService, schedule_persistence_service_1.SchedulePersistenceService])
], ClassPersistenceService);
exports.ClassPersistenceService = ClassPersistenceService;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL2R2ZXJub3Zza3kvcHJvZ3JhbW1pbmcvbXktc3BlY2lhbC13YXkvbXktc3BlY2lhbC13YXktc2VydmVyL3NyYy9tb2R1bGVzL3BlcnNpc3RlbmNlL2NsYXNzLnBlcnNpc3RlbmNlLnNlcnZpY2UudHMiLCJzb3VyY2VzIjpbIi9Vc2Vycy9kdmVybm92c2t5L3Byb2dyYW1taW5nL215LXNwZWNpYWwtd2F5L215LXNwZWNpYWwtd2F5LXNlcnZlci9zcmMvbW9kdWxlcy9wZXJzaXN0ZW5jZS9jbGFzcy5wZXJzaXN0ZW5jZS5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsMkNBQW9EO0FBQ3BELDZDQUF5QztBQUN6QyxpRkFBNEU7QUFDNUUscUNBQStDO0FBRS9DLHlFQUE2RDtBQUc3RCxJQUFhLHVCQUF1QixHQUFwQyw2QkFBcUMsU0FBUSwwQ0FBNkI7SUFDdEUsWUFBWSxTQUFvQixFQUFVLDBCQUFzRDtRQUM1RixLQUFLLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBRFUsK0JBQTBCLEdBQTFCLDBCQUEwQixDQUE0QjtJQUVoRyxDQUFDO0lBRUQsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFZO1FBQ3hCLE1BQU0sR0FBRyxHQUFHLHNDQUFzQyxJQUFJLEVBQUUsQ0FBQztRQUN6RCxJQUFJO1lBQ0EsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDckIsT0FBTyxNQUFNLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztTQUNsRDtRQUFDLE9BQU8sS0FBSyxFQUFFO1lBQ1osSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNwQyxNQUFNLEtBQUssQ0FBQztTQUNmO0lBQ0wsQ0FBQztJQUVELEtBQUssQ0FBQyxXQUFXLENBQUMsRUFBVSxFQUFFLFFBQXNCO1FBQ2hELE1BQU0sT0FBTyxHQUFHLElBQUksa0JBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNqQyxJQUFJO1lBQ0EsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsa0RBQWtELE9BQU8sRUFBRSxDQUFDLENBQUM7WUFDN0UsTUFBTSxZQUFZLEdBQUcsTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQzVDLFFBQVEsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLDBCQUEwQixDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsUUFBUSxJQUFJLEVBQUUsRUFBRSxRQUFRLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQzNILE1BQU0sZUFBZSxHQUFHLE1BQU0sSUFBSSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUUsRUFDM0UsRUFBRSxHQUFHLFlBQVksRUFBRSxHQUFHLFFBQVEsRUFBRSxFQUFFLEVBQUUsY0FBYyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7WUFDakUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsK0NBQStDLElBQUksQ0FBQyxTQUFTLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUN4RyxPQUFPLGVBQWUsQ0FBQyxLQUFLLENBQUM7U0FDaEM7UUFBQyxPQUFPLEtBQUssRUFBRTtZQUNaLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLHdEQUF3RCxPQUFPLEVBQUUsRUFBRSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDbEcsTUFBTSxLQUFLLENBQUM7U0FDZjtJQUNMLENBQUM7Q0FDSixDQUFBO0FBL0JZLHVCQUF1QjtJQURuQyxtQkFBVSxFQUFFO3FDQUVjLHNCQUFTLEVBQXNDLHlEQUEwQjtHQUR2Rix1QkFBdUIsQ0ErQm5DO0FBL0JZLDBEQUF1QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUsIExvZ2dlciB9IGZyb20gJ0BuZXN0anMvY29tbW9uJztcbmltcG9ydCB7IERiU2VydmljZSB9IGZyb20gJy4vZGIuc2VydmljZSc7XG5pbXBvcnQgeyBTY2hlZHVsZVBlcnNpc3RlbmNlU2VydmljZSB9IGZyb20gJy4vc2NoZWR1bGUucGVyc2lzdGVuY2Uuc2VydmljZSc7XG5pbXBvcnQgeyBDb2xsZWN0aW9uLCBPYmplY3RJRCB9IGZyb20gJ21vbmdvZGInO1xuaW1wb3J0IHsgQ2xhc3NEYk1vZGVsIH0gZnJvbSAnbW9kZWxzL2NsYXNzLmRiLm1vZGVsJztcbmltcG9ydCB7IENSVURQZXJzaXN0YW5jZSB9IGZyb20gJy4vY3J1ZC1wZXJzaXN0YW5jZS5zZXJ2aWNlJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIENsYXNzUGVyc2lzdGVuY2VTZXJ2aWNlIGV4dGVuZHMgQ1JVRFBlcnNpc3RhbmNlPENsYXNzRGJNb2RlbD4ge1xuICAgIGNvbnN0cnVjdG9yKGRiU2VydmljZTogRGJTZXJ2aWNlLCBwcml2YXRlIHNjaGVkdWxlUGVyc2lzdGVuY2VTZXJ2aWNlOiBTY2hlZHVsZVBlcnNpc3RlbmNlU2VydmljZSkge1xuICAgICAgICBzdXBlcignY2xhc3NlcycsIGRiU2VydmljZSk7XG4gICAgfVxuXG4gICAgYXN5bmMgZ2V0QnlOYW1lKG5hbWU6IHN0cmluZykge1xuICAgICAgICBjb25zdCBtc2cgPSBgZ2V0QnlOYW1lOjogZmV0Y2hpbmcgY2xhc3MgYnkgbmFtZSAke25hbWV9YDtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmxvZyhtc2cpO1xuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuY29sbGVjdGlvbi5maW5kT25lKHsgbmFtZSB9KTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmVycm9yKG1zZywgZXJyb3Iuc3RhY2spO1xuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhc3luYyB1cGRhdGVDbGFzcyhpZDogc3RyaW5nLCBjbGFzc09iajogQ2xhc3NEYk1vZGVsKTogUHJvbWlzZTxDbGFzc0RiTW9kZWw+IHtcbiAgICAgICAgY29uc3QgbW9uZ29JZCA9IG5ldyBPYmplY3RJRChpZCk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5sb2coYENsYXNzUGVyc2lzdGVuY2U6OnVwZGF0ZUNsYXNzOjogdXBkYXRpbmcgY2xhc3MgJHttb25nb0lkfWApO1xuICAgICAgICAgICAgY29uc3QgY3VycmVudENsYXNzID0gYXdhaXQgdGhpcy5nZXRCeUlkKGlkKTtcbiAgICAgICAgICAgIGNsYXNzT2JqLnNjaGVkdWxlID0gdGhpcy5zY2hlZHVsZVBlcnNpc3RlbmNlU2VydmljZS5tZXJnZVNjaGVkdWxlKGN1cnJlbnRDbGFzcy5zY2hlZHVsZSB8fCBbXSwgY2xhc3NPYmouc2NoZWR1bGUsICdpbmRleCcpO1xuICAgICAgICAgICAgY29uc3QgdXBkYXRlZERvY3VtZW50ID0gYXdhaXQgdGhpcy5jb2xsZWN0aW9uLmZpbmRPbmVBbmRVcGRhdGUoeyBfaWQ6IG1vbmdvSWQgfSxcbiAgICAgICAgICAgICAgICB7IC4uLmN1cnJlbnRDbGFzcywgLi4uY2xhc3NPYmogfSwgeyByZXR1cm5PcmlnaW5hbDogZmFsc2UgfSk7XG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5sb2coYENsYXNzUGVyc2lzdGVuY2U6OnVwZGF0ZUNsYXNzOjogdXBkYXRlZCBEQiA6JHtKU09OLnN0cmluZ2lmeSh1cGRhdGVkRG9jdW1lbnQudmFsdWUpfWApO1xuICAgICAgICAgICAgcmV0dXJuIHVwZGF0ZWREb2N1bWVudC52YWx1ZTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmVycm9yKGBDbGFzc1BlcnNpc3RlbmNlOjp1cGRhdGVDbGFzczo6IGVycm9yIHVwZGF0aW5nIGNsYXNzICR7bW9uZ29JZH1gLCBlcnJvci5zdGFjayk7XG4gICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==
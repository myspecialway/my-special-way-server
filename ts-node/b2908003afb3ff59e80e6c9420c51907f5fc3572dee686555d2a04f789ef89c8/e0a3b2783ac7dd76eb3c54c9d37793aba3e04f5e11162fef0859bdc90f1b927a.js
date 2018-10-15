"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const lodash_1 = require("lodash");
let SchedulePersistenceService = class SchedulePersistenceService {
    mergeSchedule(current, newCells, key) {
        return lodash_1.uniqBy([...newCells, ...current], key);
    }
};
SchedulePersistenceService = __decorate([
    common_1.Injectable()
], SchedulePersistenceService);
exports.SchedulePersistenceService = SchedulePersistenceService;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL2R2ZXJub3Zza3kvcHJvZ3JhbW1pbmcvbXktc3BlY2lhbC13YXkvbXktc3BlY2lhbC13YXktc2VydmVyL3NyYy9tb2R1bGVzL3BlcnNpc3RlbmNlL3NjaGVkdWxlLnBlcnNpc3RlbmNlLnNlcnZpY2UudHMiLCJzb3VyY2VzIjpbIi9Vc2Vycy9kdmVybm92c2t5L3Byb2dyYW1taW5nL215LXNwZWNpYWwtd2F5L215LXNwZWNpYWwtd2F5LXNlcnZlci9zcmMvbW9kdWxlcy9wZXJzaXN0ZW5jZS9zY2hlZHVsZS5wZXJzaXN0ZW5jZS5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsMkNBQTRDO0FBQzVDLG1DQUFnQztBQUloQyxJQUFhLDBCQUEwQixHQUF2QztJQUVJLGFBQWEsQ0FBQyxPQUEwQixFQUFFLFFBQTJCLEVBQUUsR0FBVztRQUM5RSxPQUFPLGVBQU0sQ0FBQyxDQUFDLEdBQUcsUUFBUSxFQUFFLEdBQUcsT0FBTyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDbEQsQ0FBQztDQUNKLENBQUE7QUFMWSwwQkFBMEI7SUFEdEMsbUJBQVUsRUFBRTtHQUNBLDBCQUEwQixDQUt0QztBQUxZLGdFQUEwQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAbmVzdGpzL2NvbW1vbic7XG5pbXBvcnQgeyB1bmlxQnkgfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHsgVGltZVNsb3REYk1vZGVsIH0gZnJvbSAnLi4vLi4vbW9kZWxzL3RpbWVzbG90LmRiLm1vZGVsJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFNjaGVkdWxlUGVyc2lzdGVuY2VTZXJ2aWNlIHtcblxuICAgIG1lcmdlU2NoZWR1bGUoY3VycmVudDogVGltZVNsb3REYk1vZGVsW10sIG5ld0NlbGxzOiBUaW1lU2xvdERiTW9kZWxbXSwga2V5OiBzdHJpbmcpOiBUaW1lU2xvdERiTW9kZWxbXSB7XG4gICAgICAgIHJldHVybiB1bmlxQnkoWy4uLm5ld0NlbGxzLCAuLi5jdXJyZW50XSwga2V5KTtcbiAgICB9XG59XG4iXX0=
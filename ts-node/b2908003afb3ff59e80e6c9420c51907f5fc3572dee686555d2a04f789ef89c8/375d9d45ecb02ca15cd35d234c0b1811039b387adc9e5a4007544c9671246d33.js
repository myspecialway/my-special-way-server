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
const graphql_1 = require("@nestjs/graphql");
const users_persistence_service_1 = require("../../persistence/users.persistence.service");
const permission_interface_1 = require("../../permissions/permission.interface");
const get_1 = require("../../../utils/get");
let UsersResolver = class UsersResolver {
    constructor(usersPersistence) {
        this.usersPersistence = usersPersistence;
    }
    async getUsers(_, {}, context) {
        permission_interface_1.checkAndGetBasePermission(get_1.Get.getObject(context, 'user'), permission_interface_1.DBOperation.READ, permission_interface_1.Asset.USER);
        return this.usersPersistence.getAll();
    }
    async getUserById(obj, args, context, info) {
        permission_interface_1.checkAndGetBasePermission(get_1.Get.getObject(context, 'user'), permission_interface_1.DBOperation.READ, permission_interface_1.Asset.USER);
        return this.usersPersistence.getById(args.id);
    }
    async createUser(_, { user }, context) {
        permission_interface_1.checkAndGetBasePermission(get_1.Get.getObject(context, 'user'), permission_interface_1.DBOperation.CREATE, permission_interface_1.Asset.USER);
        // TODO: Handle errors!!!!
        const [, response] = await this.usersPersistence.createUser(user);
        return response;
    }
    async updateUser(_, { id, user }, context) {
        permission_interface_1.checkAndGetBasePermission(get_1.Get.getObject(context, 'user'), permission_interface_1.DBOperation.UPDATE, permission_interface_1.Asset.USER);
        // TODO: Handle errors!!!!
        const [, response] = await this.usersPersistence.updateUser(id, user);
        return response;
    }
    async deleteUser(_, { id }, context) {
        permission_interface_1.checkAndGetBasePermission(get_1.Get.getObject(context, 'user'), permission_interface_1.DBOperation.DELETE, permission_interface_1.Asset.USER);
        // TODO: Handle errors!!!!
        const [, response] = await this.usersPersistence.deleteUser(id);
        return response;
    }
};
__decorate([
    graphql_1.Query('users'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], UsersResolver.prototype, "getUsers", null);
__decorate([
    graphql_1.Query('user'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], UsersResolver.prototype, "getUserById", null);
__decorate([
    graphql_1.Mutation('createUser'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], UsersResolver.prototype, "createUser", null);
__decorate([
    graphql_1.Mutation('updateUser'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], UsersResolver.prototype, "updateUser", null);
__decorate([
    graphql_1.Mutation('deleteUser'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], UsersResolver.prototype, "deleteUser", null);
UsersResolver = __decorate([
    graphql_1.Resolver('User'),
    __metadata("design:paramtypes", [users_persistence_service_1.UsersPersistenceService])
], UsersResolver);
exports.UsersResolver = UsersResolver;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL2R2ZXJub3Zza3kvcHJvZ3JhbW1pbmcvbXktc3BlY2lhbC13YXkvbXktc3BlY2lhbC13YXktc2VydmVyL3NyYy9tb2R1bGVzL2dyYXBocWwvcmVzb2x2ZXJzL3VzZXJzLnJlc29sdmVyLnRzIiwic291cmNlcyI6WyIvVXNlcnMvZHZlcm5vdnNreS9wcm9ncmFtbWluZy9teS1zcGVjaWFsLXdheS9teS1zcGVjaWFsLXdheS1zZXJ2ZXIvc3JjL21vZHVsZXMvZ3JhcGhxbC9yZXNvbHZlcnMvdXNlcnMucmVzb2x2ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSw2Q0FBNEQ7QUFDNUQsMkZBQXNGO0FBQ3RGLGlGQUFxRztBQUNyRyw0Q0FBdUM7QUFHdkMsSUFBYSxhQUFhLEdBQTFCO0lBQ0ksWUFBb0IsZ0JBQXlDO1FBQXpDLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBeUI7SUFBSSxDQUFDO0lBR2xFLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLEVBQUksRUFBRSxPQUFPO1FBQzNCLGdEQUF5QixDQUFDLFNBQUcsQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxFQUFFLGtDQUFXLENBQUMsSUFBSSxFQUFFLDRCQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDeEYsT0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDMUMsQ0FBQztJQUdELEtBQUssQ0FBQyxXQUFXLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSTtRQUN0QyxnREFBeUIsQ0FBQyxTQUFHLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsRUFBRSxrQ0FBVyxDQUFDLElBQUksRUFBRSw0QkFBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3hGLE9BQU8sSUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDbEQsQ0FBQztJQUdELEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsT0FBTztRQUNqQyxnREFBeUIsQ0FBQyxTQUFHLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsRUFBRSxrQ0FBVyxDQUFDLE1BQU0sRUFBRSw0QkFBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzFGLDBCQUEwQjtRQUMxQixNQUFNLENBQUMsRUFBRSxRQUFRLENBQUMsR0FBRyxNQUFNLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbEUsT0FBTyxRQUFRLENBQUM7SUFDcEIsQ0FBQztJQUdELEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLE9BQU87UUFDckMsZ0RBQXlCLENBQUMsU0FBRyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLEVBQUUsa0NBQVcsQ0FBQyxNQUFNLEVBQUUsNEJBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMxRiwwQkFBMEI7UUFDMUIsTUFBTSxDQUFDLEVBQUUsUUFBUSxDQUFDLEdBQUcsTUFBTSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN0RSxPQUFPLFFBQVEsQ0FBQztJQUNwQixDQUFDO0lBR0QsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxPQUFPO1FBQy9CLGdEQUF5QixDQUFDLFNBQUcsQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxFQUFFLGtDQUFXLENBQUMsTUFBTSxFQUFFLDRCQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDMUYsMEJBQTBCO1FBQzFCLE1BQU0sQ0FBQyxFQUFFLFFBQVEsQ0FBQyxHQUFHLE1BQU0sSUFBSSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNoRSxPQUFPLFFBQVEsQ0FBQztJQUNwQixDQUFDO0NBQ0osQ0FBQTtBQWxDRztJQURDLGVBQUssQ0FBQyxPQUFPLENBQUM7Ozs7NkNBSWQ7QUFHRDtJQURDLGVBQUssQ0FBQyxNQUFNLENBQUM7Ozs7Z0RBSWI7QUFHRDtJQURDLGtCQUFRLENBQUMsWUFBWSxDQUFDOzs7OytDQU10QjtBQUdEO0lBREMsa0JBQVEsQ0FBQyxZQUFZLENBQUM7Ozs7K0NBTXRCO0FBR0Q7SUFEQyxrQkFBUSxDQUFDLFlBQVksQ0FBQzs7OzsrQ0FNdEI7QUFyQ1EsYUFBYTtJQUR6QixrQkFBUSxDQUFDLE1BQU0sQ0FBQztxQ0FFeUIsbURBQXVCO0dBRHBELGFBQWEsQ0FzQ3pCO0FBdENZLHNDQUFhIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUmVzb2x2ZXIsIFF1ZXJ5LCBNdXRhdGlvbiB9IGZyb20gJ0BuZXN0anMvZ3JhcGhxbCc7XG5pbXBvcnQgeyBVc2Vyc1BlcnNpc3RlbmNlU2VydmljZSB9IGZyb20gJy4uLy4uL3BlcnNpc3RlbmNlL3VzZXJzLnBlcnNpc3RlbmNlLnNlcnZpY2UnO1xuaW1wb3J0IHtBc3NldCwgY2hlY2tBbmRHZXRCYXNlUGVybWlzc2lvbiwgREJPcGVyYXRpb259IGZyb20gJy4uLy4uL3Blcm1pc3Npb25zL3Blcm1pc3Npb24uaW50ZXJmYWNlJztcbmltcG9ydCB7R2V0fSBmcm9tICcuLi8uLi8uLi91dGlscy9nZXQnO1xuXG5AUmVzb2x2ZXIoJ1VzZXInKVxuZXhwb3J0IGNsYXNzIFVzZXJzUmVzb2x2ZXIge1xuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgdXNlcnNQZXJzaXN0ZW5jZTogVXNlcnNQZXJzaXN0ZW5jZVNlcnZpY2UpIHsgfVxuXG4gICAgQFF1ZXJ5KCd1c2VycycpXG4gICAgYXN5bmMgZ2V0VXNlcnMoXywgeyAgfSwgY29udGV4dCkge1xuICAgICAgICBjaGVja0FuZEdldEJhc2VQZXJtaXNzaW9uKEdldC5nZXRPYmplY3QoY29udGV4dCwgJ3VzZXInKSwgREJPcGVyYXRpb24uUkVBRCwgQXNzZXQuVVNFUik7XG4gICAgICAgIHJldHVybiB0aGlzLnVzZXJzUGVyc2lzdGVuY2UuZ2V0QWxsKCk7XG4gICAgfVxuXG4gICAgQFF1ZXJ5KCd1c2VyJylcbiAgICBhc3luYyBnZXRVc2VyQnlJZChvYmosIGFyZ3MsIGNvbnRleHQsIGluZm8pIHtcbiAgICAgICAgY2hlY2tBbmRHZXRCYXNlUGVybWlzc2lvbihHZXQuZ2V0T2JqZWN0KGNvbnRleHQsICd1c2VyJyksIERCT3BlcmF0aW9uLlJFQUQsIEFzc2V0LlVTRVIpO1xuICAgICAgICByZXR1cm4gdGhpcy51c2Vyc1BlcnNpc3RlbmNlLmdldEJ5SWQoYXJncy5pZCk7XG4gICAgfVxuXG4gICAgQE11dGF0aW9uKCdjcmVhdGVVc2VyJylcbiAgICBhc3luYyBjcmVhdGVVc2VyKF8sIHsgdXNlciB9LCBjb250ZXh0KSB7XG4gICAgICAgIGNoZWNrQW5kR2V0QmFzZVBlcm1pc3Npb24oR2V0LmdldE9iamVjdChjb250ZXh0LCAndXNlcicpLCBEQk9wZXJhdGlvbi5DUkVBVEUsIEFzc2V0LlVTRVIpO1xuICAgICAgICAvLyBUT0RPOiBIYW5kbGUgZXJyb3JzISEhIVxuICAgICAgICBjb25zdCBbLCByZXNwb25zZV0gPSBhd2FpdCB0aGlzLnVzZXJzUGVyc2lzdGVuY2UuY3JlYXRlVXNlcih1c2VyKTtcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgIH1cblxuICAgIEBNdXRhdGlvbigndXBkYXRlVXNlcicpXG4gICAgYXN5bmMgdXBkYXRlVXNlcihfLCB7IGlkLCB1c2VyIH0sIGNvbnRleHQpIHtcbiAgICAgICAgY2hlY2tBbmRHZXRCYXNlUGVybWlzc2lvbihHZXQuZ2V0T2JqZWN0KGNvbnRleHQsICd1c2VyJyksIERCT3BlcmF0aW9uLlVQREFURSwgQXNzZXQuVVNFUik7XG4gICAgICAgIC8vIFRPRE86IEhhbmRsZSBlcnJvcnMhISEhXG4gICAgICAgIGNvbnN0IFssIHJlc3BvbnNlXSA9IGF3YWl0IHRoaXMudXNlcnNQZXJzaXN0ZW5jZS51cGRhdGVVc2VyKGlkLCB1c2VyKTtcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgIH1cblxuICAgIEBNdXRhdGlvbignZGVsZXRlVXNlcicpXG4gICAgYXN5bmMgZGVsZXRlVXNlcihfLCB7IGlkIH0sIGNvbnRleHQpIHtcbiAgICAgICAgY2hlY2tBbmRHZXRCYXNlUGVybWlzc2lvbihHZXQuZ2V0T2JqZWN0KGNvbnRleHQsICd1c2VyJyksIERCT3BlcmF0aW9uLkRFTEVURSwgQXNzZXQuVVNFUik7XG4gICAgICAgIC8vIFRPRE86IEhhbmRsZSBlcnJvcnMhISEhXG4gICAgICAgIGNvbnN0IFssIHJlc3BvbnNlXSA9IGF3YWl0IHRoaXMudXNlcnNQZXJzaXN0ZW5jZS5kZWxldGVVc2VyKGlkKTtcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgIH1cbn1cbiJdfQ==
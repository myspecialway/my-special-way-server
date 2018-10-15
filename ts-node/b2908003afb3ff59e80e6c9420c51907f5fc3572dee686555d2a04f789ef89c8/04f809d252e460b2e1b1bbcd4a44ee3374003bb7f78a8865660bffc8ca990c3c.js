"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const graphql_module_1 = require("./modules/graphql/graphql.module");
const auth_module_1 = require("./modules/auth/auth.module");
const persistence_module_1 = require("./modules/persistence/persistence.module");
const connectivity_module_1 = require("./modules/connectivity/connectivity.module");
let AppModule = class AppModule {
};
AppModule = __decorate([
    common_1.Module({
        imports: [graphql_module_1.GraphqlModule, auth_module_1.AuthModule, persistence_module_1.PersistenceModule, connectivity_module_1.ConnectivityModule],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL2R2ZXJub3Zza3kvcHJvZ3JhbW1pbmcvbXktc3BlY2lhbC13YXkvbXktc3BlY2lhbC13YXktc2VydmVyL3NyYy9hcHAubW9kdWxlLnRzIiwic291cmNlcyI6WyIvVXNlcnMvZHZlcm5vdnNreS9wcm9ncmFtbWluZy9teS1zcGVjaWFsLXdheS9teS1zcGVjaWFsLXdheS1zZXJ2ZXIvc3JjL2FwcC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSwyQ0FBd0M7QUFDeEMscUVBQWlFO0FBQ2pFLDREQUF3RDtBQUN4RCxpRkFBNkU7QUFDN0Usb0ZBQWdGO0FBS2hGLElBQWEsU0FBUyxHQUF0QjtDQUF5QixDQUFBO0FBQVosU0FBUztJQUhyQixlQUFNLENBQUM7UUFDTixPQUFPLEVBQUUsQ0FBQyw4QkFBYSxFQUFFLHdCQUFVLEVBQUUsc0NBQWlCLEVBQUUsd0NBQWtCLENBQUM7S0FDNUUsQ0FBQztHQUNXLFNBQVMsQ0FBRztBQUFaLDhCQUFTIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTW9kdWxlIH0gZnJvbSAnQG5lc3Rqcy9jb21tb24nO1xuaW1wb3J0IHsgR3JhcGhxbE1vZHVsZSB9IGZyb20gJy4vbW9kdWxlcy9ncmFwaHFsL2dyYXBocWwubW9kdWxlJztcbmltcG9ydCB7IEF1dGhNb2R1bGUgfSBmcm9tICcuL21vZHVsZXMvYXV0aC9hdXRoLm1vZHVsZSc7XG5pbXBvcnQgeyBQZXJzaXN0ZW5jZU1vZHVsZSB9IGZyb20gJy4vbW9kdWxlcy9wZXJzaXN0ZW5jZS9wZXJzaXN0ZW5jZS5tb2R1bGUnO1xuaW1wb3J0IHsgQ29ubmVjdGl2aXR5TW9kdWxlIH0gZnJvbSAnLi9tb2R1bGVzL2Nvbm5lY3Rpdml0eS9jb25uZWN0aXZpdHkubW9kdWxlJztcblxuQE1vZHVsZSh7XG4gIGltcG9ydHM6IFtHcmFwaHFsTW9kdWxlLCBBdXRoTW9kdWxlLCBQZXJzaXN0ZW5jZU1vZHVsZSwgQ29ubmVjdGl2aXR5TW9kdWxlXSxcbn0pXG5leHBvcnQgY2xhc3MgQXBwTW9kdWxlIHt9XG4iXX0=
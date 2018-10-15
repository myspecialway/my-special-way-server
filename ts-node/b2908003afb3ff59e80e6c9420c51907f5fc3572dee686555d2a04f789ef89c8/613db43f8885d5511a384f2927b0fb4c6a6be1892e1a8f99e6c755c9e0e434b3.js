"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport = require("passport");
const common_1 = require("@nestjs/common");
const graphql_1 = require("@nestjs/graphql");
const graphql_service_1 = require("./schemas/graphql.service");
const graphql_controller_temp_1 = require("./graphql-controller/graphql.controller.temp");
const users_resolver_1 = require("./resolvers/users.resolver");
const class_resolver_1 = require("./resolvers/class/class.resolver");
const lesson_resolver_1 = require("./resolvers/lesson.resolver");
const student_resolver_1 = require("./resolvers/student.resolver");
const locations_resolver_1 = require("./resolvers/locations.resolver");
const persistence_module_1 = require("../persistence/persistence.module");
const graphql_playground_middleware_express_1 = require("graphql-playground-middleware-express");
const config_loader_1 = require("../../config/config-loader");
const class_logic_service_1 = require("./resolvers/class/services/class-logic.service");
let GraphqlModule = class GraphqlModule {
    configure(consumer) {
        if (!config_loader_1.getConfig().isDev) {
            consumer
                .apply(passport.initialize())
                .forRoutes('/graphql')
                .apply(passport.authenticate('jwt', { session: false }))
                .forRoutes('/graphql');
        }
        consumer
            .apply(graphql_playground_middleware_express_1.default({ endpoint: '/graphql' }))
            .forRoutes('/play');
    }
};
GraphqlModule = __decorate([
    common_1.Module({
        imports: [
            graphql_1.GraphQLModule,
            persistence_module_1.PersistenceModule,
        ],
        providers: [
            graphql_service_1.GraphQlService,
            users_resolver_1.UsersResolver,
            class_resolver_1.ClassResolver,
            student_resolver_1.StudentResolver,
            lesson_resolver_1.LessonResolver,
            locations_resolver_1.LocationsResolver,
            class_logic_service_1.ClassLogic,
        ],
        controllers: [graphql_controller_temp_1.GraphqlController],
    })
], GraphqlModule);
exports.GraphqlModule = GraphqlModule;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL2R2ZXJub3Zza3kvcHJvZ3JhbW1pbmcvbXktc3BlY2lhbC13YXkvbXktc3BlY2lhbC13YXktc2VydmVyL3NyYy9tb2R1bGVzL2dyYXBocWwvZ3JhcGhxbC5tb2R1bGUudHMiLCJzb3VyY2VzIjpbIi9Vc2Vycy9kdmVybm92c2t5L3Byb2dyYW1taW5nL215LXNwZWNpYWwtd2F5L215LXNwZWNpYWwtd2F5LXNlcnZlci9zcmMvbW9kdWxlcy9ncmFwaHFsL2dyYXBocWwubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEscUNBQXFDO0FBQ3JDLDJDQUF3RTtBQUN4RSw2Q0FBZ0Q7QUFDaEQsK0RBQTJEO0FBQzNELDBGQUFpRjtBQUNqRiwrREFBMkQ7QUFDM0QscUVBQWlFO0FBQ2pFLGlFQUE2RDtBQUM3RCxtRUFBK0Q7QUFDL0QsdUVBQW1FO0FBQ25FLDBFQUFzRTtBQUN0RSxpR0FBc0U7QUFDdEUsOERBQXVEO0FBQ3ZELHdGQUE0RTtBQWtCNUUsSUFBYSxhQUFhLEdBQTFCO0lBQ0ksU0FBUyxDQUFDLFFBQTRCO1FBQ2xDLElBQUksQ0FBQyx5QkFBUyxFQUFFLENBQUMsS0FBSyxFQUFFO1lBQ3BCLFFBQVE7aUJBQ0gsS0FBSyxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsQ0FBQztpQkFDNUIsU0FBUyxDQUFDLFVBQVUsQ0FBQztpQkFDckIsS0FBSyxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7aUJBQ3ZELFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUM5QjtRQUNELFFBQVE7YUFDSCxLQUFLLENBQUMsK0NBQWlCLENBQUMsRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQzthQUNsRCxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDNUIsQ0FBQztDQUNKLENBQUE7QUFiWSxhQUFhO0lBaEJ6QixlQUFNLENBQUM7UUFDSixPQUFPLEVBQUU7WUFDTCx1QkFBYTtZQUNiLHNDQUFpQjtTQUNwQjtRQUNELFNBQVMsRUFBRTtZQUNQLGdDQUFjO1lBQ2QsOEJBQWE7WUFDYiw4QkFBYTtZQUNiLGtDQUFlO1lBQ2YsZ0NBQWM7WUFDZCxzQ0FBaUI7WUFDakIsZ0NBQVU7U0FDYjtRQUNELFdBQVcsRUFBRSxDQUFDLDJDQUFpQixDQUFDO0tBQ25DLENBQUM7R0FDVyxhQUFhLENBYXpCO0FBYlksc0NBQWEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBwYXNzcG9ydCBmcm9tICdwYXNzcG9ydCc7XG5pbXBvcnQgeyBNb2R1bGUsIE1pZGRsZXdhcmVDb25zdW1lciwgTmVzdE1vZHVsZSB9IGZyb20gJ0BuZXN0anMvY29tbW9uJztcbmltcG9ydCB7IEdyYXBoUUxNb2R1bGUgfSBmcm9tICdAbmVzdGpzL2dyYXBocWwnO1xuaW1wb3J0IHsgR3JhcGhRbFNlcnZpY2UgfSBmcm9tICcuL3NjaGVtYXMvZ3JhcGhxbC5zZXJ2aWNlJztcbmltcG9ydCB7IEdyYXBocWxDb250cm9sbGVyIH0gZnJvbSAnLi9ncmFwaHFsLWNvbnRyb2xsZXIvZ3JhcGhxbC5jb250cm9sbGVyLnRlbXAnO1xuaW1wb3J0IHsgVXNlcnNSZXNvbHZlciB9IGZyb20gJy4vcmVzb2x2ZXJzL3VzZXJzLnJlc29sdmVyJztcbmltcG9ydCB7IENsYXNzUmVzb2x2ZXIgfSBmcm9tICcuL3Jlc29sdmVycy9jbGFzcy9jbGFzcy5yZXNvbHZlcic7XG5pbXBvcnQgeyBMZXNzb25SZXNvbHZlciB9IGZyb20gJy4vcmVzb2x2ZXJzL2xlc3Nvbi5yZXNvbHZlcic7XG5pbXBvcnQgeyBTdHVkZW50UmVzb2x2ZXIgfSBmcm9tICcuL3Jlc29sdmVycy9zdHVkZW50LnJlc29sdmVyJztcbmltcG9ydCB7IExvY2F0aW9uc1Jlc29sdmVyIH0gZnJvbSAnLi9yZXNvbHZlcnMvbG9jYXRpb25zLnJlc29sdmVyJztcbmltcG9ydCB7IFBlcnNpc3RlbmNlTW9kdWxlIH0gZnJvbSAnLi4vcGVyc2lzdGVuY2UvcGVyc2lzdGVuY2UubW9kdWxlJztcbmltcG9ydCBncmFwaHFsUGxheWdyb3VuZCBmcm9tICdncmFwaHFsLXBsYXlncm91bmQtbWlkZGxld2FyZS1leHByZXNzJztcbmltcG9ydCB7IGdldENvbmZpZyB9IGZyb20gJy4uLy4uL2NvbmZpZy9jb25maWctbG9hZGVyJztcbmltcG9ydCB7IENsYXNzTG9naWMgfSBmcm9tICcuL3Jlc29sdmVycy9jbGFzcy9zZXJ2aWNlcy9jbGFzcy1sb2dpYy5zZXJ2aWNlJztcblxuQE1vZHVsZSh7XG4gICAgaW1wb3J0czogW1xuICAgICAgICBHcmFwaFFMTW9kdWxlLFxuICAgICAgICBQZXJzaXN0ZW5jZU1vZHVsZSxcbiAgICBdLFxuICAgIHByb3ZpZGVyczogW1xuICAgICAgICBHcmFwaFFsU2VydmljZSxcbiAgICAgICAgVXNlcnNSZXNvbHZlcixcbiAgICAgICAgQ2xhc3NSZXNvbHZlcixcbiAgICAgICAgU3R1ZGVudFJlc29sdmVyLFxuICAgICAgICBMZXNzb25SZXNvbHZlcixcbiAgICAgICAgTG9jYXRpb25zUmVzb2x2ZXIsXG4gICAgICAgIENsYXNzTG9naWMsXG4gICAgXSxcbiAgICBjb250cm9sbGVyczogW0dyYXBocWxDb250cm9sbGVyXSxcbn0pXG5leHBvcnQgY2xhc3MgR3JhcGhxbE1vZHVsZSBpbXBsZW1lbnRzIE5lc3RNb2R1bGUge1xuICAgIGNvbmZpZ3VyZShjb25zdW1lcjogTWlkZGxld2FyZUNvbnN1bWVyKSB7XG4gICAgICAgIGlmICghZ2V0Q29uZmlnKCkuaXNEZXYpIHtcbiAgICAgICAgICAgIGNvbnN1bWVyXG4gICAgICAgICAgICAgICAgLmFwcGx5KHBhc3Nwb3J0LmluaXRpYWxpemUoKSlcbiAgICAgICAgICAgICAgICAuZm9yUm91dGVzKCcvZ3JhcGhxbCcpXG4gICAgICAgICAgICAgICAgLmFwcGx5KHBhc3Nwb3J0LmF1dGhlbnRpY2F0ZSgnand0JywgeyBzZXNzaW9uOiBmYWxzZSB9KSlcbiAgICAgICAgICAgICAgICAuZm9yUm91dGVzKCcvZ3JhcGhxbCcpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN1bWVyXG4gICAgICAgICAgICAuYXBwbHkoZ3JhcGhxbFBsYXlncm91bmQoeyBlbmRwb2ludDogJy9ncmFwaHFsJyB9KSlcbiAgICAgICAgICAgIC5mb3JSb3V0ZXMoJy9wbGF5Jyk7XG4gICAgfVxufVxuIl19
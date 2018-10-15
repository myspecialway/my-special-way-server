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
const fs = require("fs");
const path = require("path");
const common_1 = require("@nestjs/common");
const graphql_1 = require("@nestjs/graphql");
let GraphQlService = class GraphQlService {
    constructor(graphQlFactory) {
        this.graphQlFactory = graphQlFactory;
        this.logger = new common_1.Logger('GraphQlService');
    }
    getSchema() {
        try {
            // TODO: need to make this recursive when refactoring to child folders
            this.logger.log('GraphQlService::getSchema:: starting schema creation');
            let typeDefs = 'directive @hasRole(role: String) on FIELD | FIELD_DEFINITION';
            const files = fs.readdirSync(__dirname).filter((file) => file.includes('.gql'));
            for (const file of files) {
                typeDefs += fs.readFileSync(path.join(__dirname, file)).toString('utf8');
            }
            const schema = this.graphQlFactory.createSchema({ typeDefs });
            this.logger.log('GraphQlService::getSchema:: graphQl schema creation completed');
            return schema;
        }
        catch (error) {
            this.logger.error('GraphQlService::getSchema:: error creating schema', error.stack);
            throw error;
        }
    }
};
GraphQlService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [graphql_1.GraphQLFactory])
], GraphQlService);
exports.GraphQlService = GraphQlService;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL2R2ZXJub3Zza3kvcHJvZ3JhbW1pbmcvbXktc3BlY2lhbC13YXkvbXktc3BlY2lhbC13YXktc2VydmVyL3NyYy9tb2R1bGVzL2dyYXBocWwvc2NoZW1hcy9ncmFwaHFsLnNlcnZpY2UudHMiLCJzb3VyY2VzIjpbIi9Vc2Vycy9kdmVybm92c2t5L3Byb2dyYW1taW5nL215LXNwZWNpYWwtd2F5L215LXNwZWNpYWwtd2F5LXNlcnZlci9zcmMvbW9kdWxlcy9ncmFwaHFsL3NjaGVtYXMvZ3JhcGhxbC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEseUJBQXlCO0FBQ3pCLDZCQUE2QjtBQUU3QiwyQ0FBb0Q7QUFDcEQsNkNBQWlEO0FBR2pELElBQWEsY0FBYyxHQUEzQjtJQUdJLFlBQW9CLGNBQThCO1FBQTlCLG1CQUFjLEdBQWQsY0FBYyxDQUFnQjtRQUM5QyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksZUFBTSxDQUFDLGdCQUFnQixDQUFDLENBQUM7SUFDL0MsQ0FBQztJQUVELFNBQVM7UUFDTCxJQUFJO1lBQ0Esc0VBQXNFO1lBQ3RFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHNEQUFzRCxDQUFDLENBQUM7WUFFeEUsSUFBSSxRQUFRLEdBQUcsOERBQThELENBQUM7WUFFOUUsTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUVoRixLQUFLLE1BQU0sSUFBSSxJQUFJLEtBQUssRUFBRTtnQkFDdEIsUUFBUSxJQUFJLEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7YUFDNUU7WUFFRCxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUM7WUFDOUQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsK0RBQStELENBQUMsQ0FBQztZQUNqRixPQUFPLE1BQU0sQ0FBQztTQUNqQjtRQUFDLE9BQU8sS0FBSyxFQUFFO1lBQ1osSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsbURBQW1ELEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3BGLE1BQU0sS0FBSyxDQUFDO1NBQ2Y7SUFDTCxDQUFDO0NBQ0osQ0FBQTtBQTVCWSxjQUFjO0lBRDFCLG1CQUFVLEVBQUU7cUNBSTJCLHdCQUFjO0dBSHpDLGNBQWMsQ0E0QjFCO0FBNUJZLHdDQUFjIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IEdyYXBoUUxTY2hlbWEgfSBmcm9tICdncmFwaHFsJztcbmltcG9ydCB7IEluamVjdGFibGUsIExvZ2dlciB9IGZyb20gJ0BuZXN0anMvY29tbW9uJztcbmltcG9ydCB7IEdyYXBoUUxGYWN0b3J5IH0gZnJvbSAnQG5lc3Rqcy9ncmFwaHFsJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEdyYXBoUWxTZXJ2aWNlIHtcbiAgICBsb2dnZXI6IExvZ2dlcjtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgZ3JhcGhRbEZhY3Rvcnk6IEdyYXBoUUxGYWN0b3J5KSB7XG4gICAgICAgIHRoaXMubG9nZ2VyID0gbmV3IExvZ2dlcignR3JhcGhRbFNlcnZpY2UnKTtcbiAgICB9XG5cbiAgICBnZXRTY2hlbWEoKTogR3JhcGhRTFNjaGVtYSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBUT0RPOiBuZWVkIHRvIG1ha2UgdGhpcyByZWN1cnNpdmUgd2hlbiByZWZhY3RvcmluZyB0byBjaGlsZCBmb2xkZXJzXG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5sb2coJ0dyYXBoUWxTZXJ2aWNlOjpnZXRTY2hlbWE6OiBzdGFydGluZyBzY2hlbWEgY3JlYXRpb24nKTtcblxuICAgICAgICAgICAgbGV0IHR5cGVEZWZzID0gJ2RpcmVjdGl2ZSBAaGFzUm9sZShyb2xlOiBTdHJpbmcpIG9uIEZJRUxEIHwgRklFTERfREVGSU5JVElPTic7XG5cbiAgICAgICAgICAgIGNvbnN0IGZpbGVzID0gZnMucmVhZGRpclN5bmMoX19kaXJuYW1lKS5maWx0ZXIoKGZpbGUpID0+IGZpbGUuaW5jbHVkZXMoJy5ncWwnKSk7XG5cbiAgICAgICAgICAgIGZvciAoY29uc3QgZmlsZSBvZiBmaWxlcykge1xuICAgICAgICAgICAgICAgIHR5cGVEZWZzICs9IGZzLnJlYWRGaWxlU3luYyhwYXRoLmpvaW4oX19kaXJuYW1lLCBmaWxlKSkudG9TdHJpbmcoJ3V0ZjgnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3Qgc2NoZW1hID0gdGhpcy5ncmFwaFFsRmFjdG9yeS5jcmVhdGVTY2hlbWEoeyB0eXBlRGVmcyB9KTtcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmxvZygnR3JhcGhRbFNlcnZpY2U6OmdldFNjaGVtYTo6IGdyYXBoUWwgc2NoZW1hIGNyZWF0aW9uIGNvbXBsZXRlZCcpO1xuICAgICAgICAgICAgcmV0dXJuIHNjaGVtYTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmVycm9yKCdHcmFwaFFsU2VydmljZTo6Z2V0U2NoZW1hOjogZXJyb3IgY3JlYXRpbmcgc2NoZW1hJywgZXJyb3Iuc3RhY2spO1xuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=
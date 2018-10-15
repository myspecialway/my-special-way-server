'use strict';
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const apollo_server_express_1 = require("apollo-server-express");
const graphql_service_1 = require("../schemas/graphql.service");
const path = require("path");
const auth_service_1 = require("../../auth/auth-service/auth.service");
let GraphqlController = class GraphqlController {
    constructor(graphqlService) {
        this.schema = graphqlService.getSchema();
    }
    root(res) {
        res.sendFile(path.join(__dirname, '../../../../dist/public/schema.html'));
    }
    async postGraphql(req, res, next) {
        // TODO: why do we need to return a new object ExpressHandler on each request?
        const userProfile = auth_service_1.AuthService.getUserProfileFromToken(req.headers.authorization);
        return apollo_server_express_1.graphqlExpress({ schema: this.schema, context: { user: userProfile } })(req, res, next);
    }
    async getGraphql(req, res, next) {
        const userProfile = auth_service_1.AuthService.getUserProfileFromToken(req.headers.authorization);
        return apollo_server_express_1.graphqlExpress({ schema: this.schema, context: { user: userProfile } })(req, res, next);
    }
};
__decorate([
    common_1.Get('schema'),
    __param(0, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], GraphqlController.prototype, "root", null);
__decorate([
    common_1.Post('graphql'),
    __param(0, common_1.Request()), __param(1, common_1.Response()), __param(2, common_1.Next()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], GraphqlController.prototype, "postGraphql", null);
__decorate([
    common_1.Get('graphql'),
    __param(0, common_1.Request()), __param(1, common_1.Response()), __param(2, common_1.Next()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], GraphqlController.prototype, "getGraphql", null);
GraphqlController = __decorate([
    common_1.Controller(),
    __metadata("design:paramtypes", [graphql_service_1.GraphQlService])
], GraphqlController);
exports.GraphqlController = GraphqlController;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL2R2ZXJub3Zza3kvcHJvZ3JhbW1pbmcvbXktc3BlY2lhbC13YXkvbXktc3BlY2lhbC13YXktc2VydmVyL3NyYy9tb2R1bGVzL2dyYXBocWwvZ3JhcGhxbC1jb250cm9sbGVyL2dyYXBocWwuY29udHJvbGxlci50ZW1wLnRzIiwic291cmNlcyI6WyIvVXNlcnMvZHZlcm5vdnNreS9wcm9ncmFtbWluZy9teS1zcGVjaWFsLXdheS9teS1zcGVjaWFsLXdheS1zZXJ2ZXIvc3JjL21vZHVsZXMvZ3JhcGhxbC9ncmFwaHFsLWNvbnRyb2xsZXIvZ3JhcGhxbC5jb250cm9sbGVyLnRlbXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDOzs7Ozs7Ozs7Ozs7OztBQUViLDJDQUFxRjtBQUVyRixpRUFBdUQ7QUFDdkQsZ0VBQTREO0FBQzVELDZCQUE2QjtBQUU3Qix1RUFBbUU7QUFHbkUsSUFBYSxpQkFBaUIsR0FBOUI7SUFHSSxZQUFZLGNBQThCO1FBQ3RDLElBQUksQ0FBQyxNQUFNLEdBQUcsY0FBYyxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQzdDLENBQUM7SUFHRCxJQUFJLENBQVEsR0FBRztRQUNYLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUscUNBQXFDLENBQUMsQ0FBQyxDQUFDO0lBQzlFLENBQUM7SUFHRCxLQUFLLENBQUMsV0FBVyxDQUFZLEdBQUcsRUFBYyxHQUFHLEVBQVUsSUFBSTtRQUMzRCw4RUFBOEU7UUFDOUUsTUFBTSxXQUFXLEdBQXFCLDBCQUFXLENBQUMsdUJBQXVCLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUNyRyxPQUFPLHNDQUFjLENBQUMsRUFBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsRUFBQyxJQUFJLEVBQUUsV0FBVyxFQUFDLEVBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDL0YsQ0FBQztJQUdELEtBQUssQ0FBQyxVQUFVLENBQVksR0FBRyxFQUFjLEdBQUcsRUFBVSxJQUFJO1FBQzFELE1BQU0sV0FBVyxHQUFxQiwwQkFBVyxDQUFDLHVCQUF1QixDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDckcsT0FBTyxzQ0FBYyxDQUFDLEVBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLEVBQUMsSUFBSSxFQUFFLFdBQVcsRUFBQyxFQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQy9GLENBQUM7Q0FDSixDQUFBO0FBaEJHO0lBREMsWUFBRyxDQUFDLFFBQVEsQ0FBQztJQUNSLFdBQUEsWUFBRyxFQUFFLENBQUE7Ozs7NkNBRVY7QUFHRDtJQURDLGFBQUksQ0FBQyxTQUFTLENBQUM7SUFDRyxXQUFBLGdCQUFPLEVBQUUsQ0FBQSxFQUFPLFdBQUEsaUJBQVEsRUFBRSxDQUFBLEVBQU8sV0FBQSxhQUFJLEVBQUUsQ0FBQTs7OztvREFJekQ7QUFHRDtJQURDLFlBQUcsQ0FBQyxTQUFTLENBQUM7SUFDRyxXQUFBLGdCQUFPLEVBQUUsQ0FBQSxFQUFPLFdBQUEsaUJBQVEsRUFBRSxDQUFBLEVBQU8sV0FBQSxhQUFJLEVBQUUsQ0FBQTs7OzttREFHeEQ7QUF2QlEsaUJBQWlCO0lBRDdCLG1CQUFVLEVBQUU7cUNBSW1CLGdDQUFjO0dBSGpDLGlCQUFpQixDQXdCN0I7QUF4QlksOENBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgeyBDb250cm9sbGVyLCBQb3N0LCBHZXQsIFJlcXVlc3QsIFJlc3BvbnNlLCBOZXh0LCBSZXMgfSBmcm9tICdAbmVzdGpzL2NvbW1vbic7XG5pbXBvcnQgeyBHcmFwaFFMU2NoZW1hIH0gZnJvbSAnZ3JhcGhxbCc7XG5pbXBvcnQgeyBncmFwaHFsRXhwcmVzcyB9IGZyb20gJ2Fwb2xsby1zZXJ2ZXItZXhwcmVzcyc7XG5pbXBvcnQgeyBHcmFwaFFsU2VydmljZSB9IGZyb20gJy4uL3NjaGVtYXMvZ3JhcGhxbC5zZXJ2aWNlJztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBVc2VyVG9rZW5Qcm9maWxlIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL3VzZXItdG9rZW4tcHJvZmlsZS5tb2RlbCc7XG5pbXBvcnQgeyBBdXRoU2VydmljZSB9IGZyb20gJy4uLy4uL2F1dGgvYXV0aC1zZXJ2aWNlL2F1dGguc2VydmljZSc7XG5cbkBDb250cm9sbGVyKClcbmV4cG9ydCBjbGFzcyBHcmFwaHFsQ29udHJvbGxlciB7XG4gICAgcHJpdmF0ZSBzY2hlbWE6IEdyYXBoUUxTY2hlbWE7XG5cbiAgICBjb25zdHJ1Y3RvcihncmFwaHFsU2VydmljZTogR3JhcGhRbFNlcnZpY2UpIHtcbiAgICAgICAgdGhpcy5zY2hlbWEgPSBncmFwaHFsU2VydmljZS5nZXRTY2hlbWEoKTtcbiAgICB9XG5cbiAgICBAR2V0KCdzY2hlbWEnKVxuICAgIHJvb3QoQFJlcygpIHJlcykge1xuICAgICAgICByZXMuc2VuZEZpbGUocGF0aC5qb2luKF9fZGlybmFtZSwgJy4uLy4uLy4uLy4uL2Rpc3QvcHVibGljL3NjaGVtYS5odG1sJykpO1xuICAgIH1cblxuICAgIEBQb3N0KCdncmFwaHFsJylcbiAgICBhc3luYyBwb3N0R3JhcGhxbChAUmVxdWVzdCgpIHJlcSwgQFJlc3BvbnNlKCkgcmVzLCBATmV4dCgpIG5leHQpIHtcbiAgICAgICAgLy8gVE9ETzogd2h5IGRvIHdlIG5lZWQgdG8gcmV0dXJuIGEgbmV3IG9iamVjdCBFeHByZXNzSGFuZGxlciBvbiBlYWNoIHJlcXVlc3Q/XG4gICAgICAgIGNvbnN0IHVzZXJQcm9maWxlOiBVc2VyVG9rZW5Qcm9maWxlID0gQXV0aFNlcnZpY2UuZ2V0VXNlclByb2ZpbGVGcm9tVG9rZW4ocmVxLmhlYWRlcnMuYXV0aG9yaXphdGlvbik7XG4gICAgICAgIHJldHVybiBncmFwaHFsRXhwcmVzcyh7c2NoZW1hOiB0aGlzLnNjaGVtYSwgY29udGV4dDoge3VzZXI6IHVzZXJQcm9maWxlfX0pKHJlcSwgcmVzLCBuZXh0KTtcbiAgICB9XG5cbiAgICBAR2V0KCdncmFwaHFsJylcbiAgICBhc3luYyBnZXRHcmFwaHFsKEBSZXF1ZXN0KCkgcmVxLCBAUmVzcG9uc2UoKSByZXMsIEBOZXh0KCkgbmV4dCkge1xuICAgICAgICBjb25zdCB1c2VyUHJvZmlsZTogVXNlclRva2VuUHJvZmlsZSA9IEF1dGhTZXJ2aWNlLmdldFVzZXJQcm9maWxlRnJvbVRva2VuKHJlcS5oZWFkZXJzLmF1dGhvcml6YXRpb24pO1xuICAgICAgICByZXR1cm4gZ3JhcGhxbEV4cHJlc3Moe3NjaGVtYTogdGhpcy5zY2hlbWEsIGNvbnRleHQ6IHt1c2VyOiB1c2VyUHJvZmlsZX19KShyZXEsIHJlcywgbmV4dCk7XG4gICAgfVxufVxuIl19
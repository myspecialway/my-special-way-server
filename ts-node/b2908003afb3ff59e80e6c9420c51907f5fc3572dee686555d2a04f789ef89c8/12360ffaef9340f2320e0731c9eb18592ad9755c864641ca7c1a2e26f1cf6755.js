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
const jwt = require("jsonwebtoken");
const common_1 = require("@nestjs/common");
const user_token_profile_model_1 = require("../../../models/user-token-profile.model");
const users_persistence_service_1 = require("../../persistence/users.persistence.service");
exports.JWT_SECRET = '3678ee53-5207-4124-bc58-fef9d48d12b1';
exports.JWT_PAYLOAD = 'payload';
let AuthService = class AuthService {
    constructor(userPersistanceService) {
        this.userPersistanceService = userPersistanceService;
        this.logger = new common_1.Logger('AuthService');
    }
    /* istanbul ignore next */
    async createTokenFromCridentials(userLogin) {
        this.logger.log(`createTokenFromCridentials:: validating cridentials for ${userLogin.username}`);
        const [error, user] = await this.validateUserByCridentials(userLogin);
        if (error) {
            this.logger.error(`createTokenFromCridentials:: error validating user ${userLogin.username}`, error.stack);
        }
        if (error || user === null) {
            this.logger.warn(`createTokenFromCridentials:: user ${userLogin.username} not found`);
            return [error, null];
        }
        const userCridentials = {
            id: user._id,
            username: user.username,
            role: user.role,
            firstname: user.firstname,
            lastname: user.lastname,
            class_id: user.class_id,
        };
        return [null, jwt.sign(userCridentials, exports.JWT_SECRET, {
                expiresIn: '2h',
            })];
    }
    /* istanbul ignore next */
    async validateUserByCridentials(userLogin) {
        return await this.userPersistanceService.authenticateUser(userLogin);
    }
    /* istanbul ignore next */
    static getUserProfileFromToken(token) {
        let user = new user_token_profile_model_1.UserTokenProfile();
        if (token) {
            const jwttoken = jwt.decode(token.replace('Bearer ', ''), { json: true, complete: true });
            user = jwttoken[exports.JWT_PAYLOAD];
        }
        return user;
    }
};
AuthService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [users_persistence_service_1.UsersPersistenceService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL2R2ZXJub3Zza3kvcHJvZ3JhbW1pbmcvbXktc3BlY2lhbC13YXkvbXktc3BlY2lhbC13YXktc2VydmVyL3NyYy9tb2R1bGVzL2F1dGgvYXV0aC1zZXJ2aWNlL2F1dGguc2VydmljZS50cyIsInNvdXJjZXMiOlsiL1VzZXJzL2R2ZXJub3Zza3kvcHJvZ3JhbW1pbmcvbXktc3BlY2lhbC13YXkvbXktc3BlY2lhbC13YXktc2VydmVyL3NyYy9tb2R1bGVzL2F1dGgvYXV0aC1zZXJ2aWNlL2F1dGguc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLG9DQUFvQztBQUNwQywyQ0FBb0Q7QUFDcEQsdUZBQTJFO0FBRTNFLDJGQUFzRjtBQUl6RSxRQUFBLFVBQVUsR0FBRyxzQ0FBc0MsQ0FBQztBQUNwRCxRQUFBLFdBQVcsR0FBRyxTQUFTLENBQUM7QUFHckMsSUFBYSxXQUFXLEdBQXhCO0lBRUksWUFBb0Isc0JBQStDO1FBQS9DLDJCQUFzQixHQUF0QixzQkFBc0IsQ0FBeUI7UUFEM0QsV0FBTSxHQUFHLElBQUksZUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQzRCLENBQUM7SUFFeEUsMEJBQTBCO0lBQzFCLEtBQUssQ0FBQywwQkFBMEIsQ0FBQyxTQUEyQjtRQUN4RCxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQywyREFBMkQsU0FBUyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7UUFDakcsTUFBTSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsR0FBRyxNQUFNLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUV0RSxJQUFJLEtBQUssRUFBRTtZQUNQLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLHNEQUFzRCxTQUFTLENBQUMsUUFBUSxFQUFFLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQzlHO1FBRUQsSUFBSSxLQUFLLElBQUksSUFBSSxLQUFLLElBQUksRUFBRTtZQUN4QixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxxQ0FBcUMsU0FBUyxDQUFDLFFBQVEsWUFBWSxDQUFDLENBQUM7WUFDdEYsT0FBTyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztTQUN4QjtRQUVELE1BQU0sZUFBZSxHQUFxQjtZQUN0QyxFQUFFLEVBQUUsSUFBSSxDQUFDLEdBQUc7WUFDWixRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVE7WUFDdkIsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO1lBQ2YsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTO1lBQ3pCLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUTtZQUN2QixRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVE7U0FDMUIsQ0FBQztRQUVGLE9BQU8sQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsa0JBQVUsRUFBRTtnQkFDaEQsU0FBUyxFQUFFLElBQUk7YUFDbEIsQ0FBQyxDQUFDLENBQUM7SUFDUixDQUFDO0lBRUQsMEJBQTBCO0lBQzFCLEtBQUssQ0FBQyx5QkFBeUIsQ0FBQyxTQUEyQjtRQUN2RCxPQUFPLE1BQU0sSUFBSSxDQUFDLHNCQUFzQixDQUFDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3pFLENBQUM7SUFFRCwwQkFBMEI7SUFDMUIsTUFBTSxDQUFDLHVCQUF1QixDQUFDLEtBQWE7UUFDeEMsSUFBSSxJQUFJLEdBQUcsSUFBSSwyQ0FBZ0IsRUFBRSxDQUFDO1FBQ2xDLElBQUksS0FBSyxFQUFFO1lBQ1AsTUFBTSxRQUFRLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUU7WUFDekYsSUFBSSxHQUFHLFFBQVEsQ0FBQyxtQkFBVyxDQUFxQixDQUFDO1NBQ3BEO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztDQUNKLENBQUE7QUE5Q1ksV0FBVztJQUR2QixtQkFBVSxFQUFFO3FDQUdtQyxtREFBdUI7R0FGMUQsV0FBVyxDQThDdkI7QUE5Q1ksa0NBQVciLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBqd3QgZnJvbSAnanNvbndlYnRva2VuJztcbmltcG9ydCB7IEluamVjdGFibGUsIExvZ2dlciB9IGZyb20gJ0BuZXN0anMvY29tbW9uJztcbmltcG9ydCB7IFVzZXJUb2tlblByb2ZpbGV9IGZyb20gJy4uLy4uLy4uL21vZGVscy91c2VyLXRva2VuLXByb2ZpbGUubW9kZWwnO1xuaW1wb3J0IHsgQXV0aFNlcnZpY2VJbnRlcmZhY2UgfSBmcm9tICcuL2F1dGguc2VydmljZS5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgVXNlcnNQZXJzaXN0ZW5jZVNlcnZpY2UgfSBmcm9tICcuLi8uLi9wZXJzaXN0ZW5jZS91c2Vycy5wZXJzaXN0ZW5jZS5zZXJ2aWNlJztcbmltcG9ydCB7IFVzZXJEYk1vZGVsIH0gZnJvbSAnbW9kZWxzL3VzZXIuZGIubW9kZWwnO1xuaW1wb3J0IHsgVXNlckxvZ2luUmVxdWVzdCB9IGZyb20gJ21vZGVscy91c2VyLWxvZ2luLXJlcXVlc3QubW9kZWwnO1xuXG5leHBvcnQgY29uc3QgSldUX1NFQ1JFVCA9ICczNjc4ZWU1My01MjA3LTQxMjQtYmM1OC1mZWY5ZDQ4ZDEyYjEnO1xuZXhwb3J0IGNvbnN0IEpXVF9QQVlMT0FEID0gJ3BheWxvYWQnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgQXV0aFNlcnZpY2UgaW1wbGVtZW50cyBBdXRoU2VydmljZUludGVyZmFjZSB7XG4gICAgcHJpdmF0ZSBsb2dnZXIgPSBuZXcgTG9nZ2VyKCdBdXRoU2VydmljZScpO1xuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgdXNlclBlcnNpc3RhbmNlU2VydmljZTogVXNlcnNQZXJzaXN0ZW5jZVNlcnZpY2UpIHsgfVxuXG4gICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICBhc3luYyBjcmVhdGVUb2tlbkZyb21DcmlkZW50aWFscyh1c2VyTG9naW46IFVzZXJMb2dpblJlcXVlc3QpOiBQcm9taXNlPFtFcnJvciwgc3RyaW5nXT4ge1xuICAgICAgICB0aGlzLmxvZ2dlci5sb2coYGNyZWF0ZVRva2VuRnJvbUNyaWRlbnRpYWxzOjogdmFsaWRhdGluZyBjcmlkZW50aWFscyBmb3IgJHt1c2VyTG9naW4udXNlcm5hbWV9YCk7XG4gICAgICAgIGNvbnN0IFtlcnJvciwgdXNlcl0gPSBhd2FpdCB0aGlzLnZhbGlkYXRlVXNlckJ5Q3JpZGVudGlhbHModXNlckxvZ2luKTtcblxuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmVycm9yKGBjcmVhdGVUb2tlbkZyb21DcmlkZW50aWFsczo6IGVycm9yIHZhbGlkYXRpbmcgdXNlciAke3VzZXJMb2dpbi51c2VybmFtZX1gLCBlcnJvci5zdGFjayk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZXJyb3IgfHwgdXNlciA9PT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5sb2dnZXIud2FybihgY3JlYXRlVG9rZW5Gcm9tQ3JpZGVudGlhbHM6OiB1c2VyICR7dXNlckxvZ2luLnVzZXJuYW1lfSBub3QgZm91bmRgKTtcbiAgICAgICAgICAgIHJldHVybiBbZXJyb3IsIG51bGxdO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdXNlckNyaWRlbnRpYWxzOiBVc2VyVG9rZW5Qcm9maWxlID0ge1xuICAgICAgICAgICAgaWQ6IHVzZXIuX2lkLFxuICAgICAgICAgICAgdXNlcm5hbWU6IHVzZXIudXNlcm5hbWUsXG4gICAgICAgICAgICByb2xlOiB1c2VyLnJvbGUsXG4gICAgICAgICAgICBmaXJzdG5hbWU6IHVzZXIuZmlyc3RuYW1lLFxuICAgICAgICAgICAgbGFzdG5hbWU6IHVzZXIubGFzdG5hbWUsXG4gICAgICAgICAgICBjbGFzc19pZDogdXNlci5jbGFzc19pZCxcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gW251bGwsIGp3dC5zaWduKHVzZXJDcmlkZW50aWFscywgSldUX1NFQ1JFVCwge1xuICAgICAgICAgICAgZXhwaXJlc0luOiAnMmgnLFxuICAgICAgICB9KV07XG4gICAgfVxuXG4gICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICBhc3luYyB2YWxpZGF0ZVVzZXJCeUNyaWRlbnRpYWxzKHVzZXJMb2dpbjogVXNlckxvZ2luUmVxdWVzdCk6IFByb21pc2U8W0Vycm9yLCBVc2VyRGJNb2RlbF0+IHtcbiAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMudXNlclBlcnNpc3RhbmNlU2VydmljZS5hdXRoZW50aWNhdGVVc2VyKHVzZXJMb2dpbik7XG4gICAgfVxuXG4gICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICBzdGF0aWMgZ2V0VXNlclByb2ZpbGVGcm9tVG9rZW4odG9rZW46IHN0cmluZyk6IFVzZXJUb2tlblByb2ZpbGUge1xuICAgICAgICBsZXQgdXNlciA9IG5ldyBVc2VyVG9rZW5Qcm9maWxlKCk7XG4gICAgICAgIGlmICh0b2tlbikge1xuICAgICAgICAgICAgY29uc3Qgand0dG9rZW4gPSBqd3QuZGVjb2RlKHRva2VuLnJlcGxhY2UoJ0JlYXJlciAnLCAnJyksIHtqc29uOiB0cnVlLCBjb21wbGV0ZTogdHJ1ZX0pIDtcbiAgICAgICAgICAgIHVzZXIgPSBqd3R0b2tlbltKV1RfUEFZTE9BRF0gYXMgVXNlclRva2VuUHJvZmlsZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdXNlcjtcbiAgICB9XG59XG4iXX0=
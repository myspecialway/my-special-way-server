'use strict';

import { Controller, Post, Get, Request, Response, Next, Res } from '@nestjs/common';
import { GraphQLSchema } from 'graphql';
import { graphqlExpress } from 'apollo-server-express';
import { GraphQlService } from '../schemas/graphql.service';
import * as path from 'path';
import { UserTokenProfile } from '../../../models/user-token-profile.model';
import { AuthService } from '../../auth/auth-service/auth.service';

@Controller()
export class GraphqlController {
    private schema: GraphQLSchema;
    // private authService: AuthService;
    // private logger = new Logger('GraphqlController');

    constructor(graphqlService: GraphQlService) {
        this.schema = graphqlService.getSchema();
    }

    @Get('schema')
    root(@Res() res) {
        res.sendFile(path.join(__dirname, '../../../../dist/public/schema.html'));
    }

    @Post('graphql')
    async postGraphql(@Request() req, @Response() res, @Next() next) {
        // TODO: why do we need to return a new object ExpressHandler on each request?
        const userProfile: UserTokenProfile = AuthService.getUserProfileFromToken(req.headers.authorization);
        return graphqlExpress({schema: this.schema, context: {user: userProfile}})(req, res, next);
    }

    @Get('graphql')
    async getGraphql(@Request() req, @Response() res, @Next() next) {
        const userProfile: UserTokenProfile = AuthService.getUserProfileFromToken(req.headers.authorization);
        return graphqlExpress({schema: this.schema, context: {user: userProfile}})(req, res, next);
    }
}

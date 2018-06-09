'use strict';

import { Controller, Post, Get, Request, Response, Next } from '@nestjs/common';
import { buildSchema, GraphQLSchema } from 'graphql';
import { graphqlExpress } from 'apollo-server-express';
import { GraphqlService } from '../graphql-service/graphql.service.temp';

@Controller()
export class GraphqlController {
    constructor(private readonly _graphqlService: GraphqlService) { }

    @Post('graphql')
    public async postGraphql(@Request() req, @Response() res, @Next() next) {
        // TODO: why do we need to return a new object ExpressHandler on each request?
        return graphqlExpress({ schema: this._graphqlService.schema, rootValue: this._graphqlService.root })(req, res, next);
    }

    @Get('graphql')
    public async getGraphql(@Request() req, @Response() res, @Next() next) {
        return graphqlExpress({ schema: this._graphqlService.schema, rootValue: this._graphqlService.root })(req, res, next);
    }
}

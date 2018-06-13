'use strict';

import { Controller, Post, Get, Request, Response, Next } from '@nestjs/common';
import { buildSchema, GraphQLSchema } from 'graphql';
import { graphqlExpress } from 'apollo-server-express';
import { GraphQlService } from '../schemas/graphql.service';

@Controller()
export class GraphqlController {
    private _schema: GraphQLSchema;

    constructor(private graphqlService: GraphQlService) {
        this._schema = graphqlService.getSchema();
     }
    @Post('graphql')
    public async postGraphql(@Request() req, @Response() res, @Next() next) {
        // TODO: why do we need to return a new object ExpressHandler on each request?
        return graphqlExpress({ schema: this._schema })(req, res, next);
    }

    @Get('graphql')
    public async getGraphql(@Request() req, @Response() res, @Next() next) {
        return graphqlExpress({ schema: this._schema })(req, res, next);
    }
}

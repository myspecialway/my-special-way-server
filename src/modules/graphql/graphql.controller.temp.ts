'use strict';

import { Controller, Post, Get, Request, Response, Next } from '@nestjs/common';
import { GraphQLSchema } from 'graphql';
import { graphqlExpress } from 'apollo-server-express';
import { GraphQlService } from './schemas';

/* istanbul ignore next */
@Controller()
export class GraphqlController {
    private schema: GraphQLSchema;
    constructor(private graphqlService: GraphQlService) {
        this.schema = graphqlService.getSchema();
     }

    @Post('graphql')
    public async postGraphql(@Request() req, @Response() res, @Next() next) {
        return graphqlExpress({ schema: this.schema })(req, res, next);
    }

    @Get('graphql')
    public async getGraphql(@Request() req, @Response() res, @Next() next) {
        return graphqlExpress({ schema: this.schema })(req, res, next);
    }
}

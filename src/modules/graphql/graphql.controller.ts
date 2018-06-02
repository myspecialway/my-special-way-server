'use strict';

import { Controller, Post, Request, Response, Next } from '@nestjs/common';
import { graphqlExpress } from 'apollo-server-express';
import { GraphqlService } from './graphql.service';
import { buildSchema } from 'graphql';

@Controller()
export class GraphqlController {
    constructor(private readonly graphqlService: GraphqlService) { }

    @Post('graphql')
    public async create(@Request() req, @Response() res, @Next() next) {

        const schema = buildSchema(`type Query {
                                        message: String
                                    }`);
        const root = {
            message: () => 'Welcome to My-Special-W@@y!',
        };

        //return graphqlExpress({ schema: this.graphqlService.schema })(req, res, next);
        return graphqlExpress(req => ({ schema, rootValue: root }));
    }
}

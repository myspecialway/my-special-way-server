'use strict';

import { Controller, Post, Request, Response, Next } from '@nestjs/common';
import { GraphQLSchema } from 'graphql';
import { graphqlExpress } from 'apollo-server-express';
import { GraphqlService } from './graphql.service';
import { buildSchema } from 'graphql';

@Controller()
export class GraphqlController {
    constructor() { }

    private _schema:GraphQLSchema = buildSchema(`type Query {
        message: String
    }`);

    private _root = {
        message: () => 'Welcome to My-Special-W@@y!222',
    };

    @Post('graphql')
    public async create(@Request() req, @Response() res, @Next() next) {
        let schema = null ? this._schema: this._schema;
        
        //return graphqlExpress({ schema: this.graphqlService.schema })(req, res, next);
        return graphqlExpress(req => ({ schema, rootValue: this._root }));
    }
}

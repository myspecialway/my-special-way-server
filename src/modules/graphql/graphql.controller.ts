'use strict';

import { Controller, Post, Request, Response, Next } from '@nestjs/common';
import { GraphQLSchema } from 'graphql';
import { graphqlExpress } from 'apollo-server-express';
import { buildSchema } from 'graphql';

@Controller()
export class GraphqlController {
    constructor() { }

    private _schema:GraphQLSchema = buildSchema(`type Query {
        message: String
    }`);

    private _root = {
        message: () => 'Welcome to My-Special-W@@y!',
    };

    @Post('graphql')
    public async create(@Request() req, @Response() res, @Next() next) {
        return graphqlExpress({ schema: this._schema, rootValue: this._root })(req, res, next);
    }
}

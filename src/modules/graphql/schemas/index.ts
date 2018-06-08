import * as fs from 'fs';
import * as path from 'path';
import { buildSchema, GraphQLSchema } from 'graphql';
import { makeExecutableSchema } from 'graphql-tools';
import { NotImplementedException, Injectable } from '@nestjs/common';
import { userResolvers } from '../resolvers/users.resolver';
import { GraphQLFactory } from '@nestjs/graphql';

@Injectable()
export class GraphQlService {
    constructor(private graphQlFactory: GraphQLFactory) { }
    getSchema(): GraphQLSchema {
        try {

            const typeDefs = this.graphQlFactory.mergeTypesByPaths('./**/*.gql');
            return this.graphQlFactory.createSchema({ typeDefs });
            // let schemas = '';
            // const files = fs.readdirSync(__dirname).filter(file => file.includes('.gql'));

            // for (const file of files) {
            //     schemas += fs.readFileSync(path.join(__dirname, file)).toString('utf8');
            // }

            // return makeExecutableSchema({
            //     typeDefs: [schemas],
            //     resolvers: {Query: {...userResolvers}},
            // });

        } catch (error) {
            console.log(error.message);
        }
    }
}

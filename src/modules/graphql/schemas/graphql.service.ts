import * as fs from 'fs';
import * as path from 'path';
import { GraphQLSchema } from 'graphql';
import { Injectable, Logger } from '@nestjs/common';
import { GraphQLFactory } from '@nestjs/graphql';

@Injectable()
export class GraphQlService extends Logger {
    constructor(private graphQlFactory: GraphQLFactory) {
        super('GraphQlService');
    }

    getSchema(): GraphQLSchema {
        try {
            this.log('getSchema:: starting schema creation');
            let typeDefs = '';
            const files = fs.readdirSync(__dirname).filter(file => file.includes('.gql'));

            for (const file of files) {
                typeDefs += fs.readFileSync(path.join(__dirname, file)).toString('utf8');
            }

            const schema = this.graphQlFactory.createSchema({ typeDefs });
            this.log('getSchema:: schema creation complete');
            return schema;
        } catch (error) {
            this.error('getSchema:: error creating schema', error.stack);
            throw error;
        }
    }
}

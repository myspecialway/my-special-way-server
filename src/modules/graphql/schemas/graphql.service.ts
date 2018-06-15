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

    public getSchema(): GraphQLSchema {
        try {
            this.log('GraphQlService::getSchema:: starting schema creation');
            let typeDefs = '';
            const files = fs.readdirSync(__dirname).filter(file => file.includes('.gql'));

            for (const file of files) {
                typeDefs += fs.readFileSync(path.join(__dirname, file)).toString('utf8');
            }

            const schema = this.graphQlFactory.createSchema({ typeDefs });
            this.log('GraphQlService::getSchema:: graphQl schema creation completed');
            return schema;
        } catch (error) {
            this.error('GraphQlService::getSchema:: error creating schema', error.stack);
            throw error;
        }
    }
}

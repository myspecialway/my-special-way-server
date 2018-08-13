import * as fs from 'fs';
import * as path from 'path';
import { GraphQLSchema } from 'graphql';
import { Injectable, Logger } from '@nestjs/common';
import { GraphQLFactory } from '@nestjs/graphql';
import { HasRoleDirective } from "./HasRoleDirective";


@Injectable()
export class GraphQlService {
    logger: Logger;

    constructor(private graphQlFactory: GraphQLFactory) {
        this.logger = new Logger('GraphQlService');
    }

    getSchema(): GraphQLSchema {
        try {
            // TODO: need to make this recursive when refactoring to child folders
            this.logger.log('GraphQlService::getSchema:: starting schema creation');

            let typeDefs = 'directive @hasRole(role: String) on FIELD | FIELD_DEFINITION';

            const files = fs.readdirSync(__dirname).filter((file) => file.includes('.gql'));

            for (const file of files) {
                typeDefs += fs.readFileSync(path.join(__dirname, file)).toString('utf8');
            }

            const schema = this.graphQlFactory.createSchema({ typeDefs, schemaDirectives: { hasRole: HasRoleDirective } });
            this.logger.log('GraphQlService::getSchema:: graphQl schema creation completed');
            return schema;
        } catch (error) {
            this.logger.error('GraphQlService::getSchema:: error creating schema', error.stack);
            throw error;
        }
    }
}

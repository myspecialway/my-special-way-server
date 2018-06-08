'use strict';

import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { AuthMiddleware } from '../common/index';
import { GraphQLModule, GraphQLFactory } from '@nestjs/graphql';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import * as passport from 'passport';
import { GraphQlService } from './schemas';
import { GraphqlController } from './graphql.controller.temp';

@Module({
    imports: [GraphQLModule],
    providers: [GraphQlService],
    controllers: [GraphqlController],
})
export class GraphqlModule implements NestModule {
    public configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(passport.initialize())
            .forRoutes('/graphql')
            .apply(passport.authenticate('jwt', { session: false }))
            .forRoutes('/graphql')
            .apply(graphiqlExpress({ endpointURL: '/graphql' }))
            .forRoutes('/graphiql');
    }
}
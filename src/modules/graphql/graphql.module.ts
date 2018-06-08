import * as passport from 'passport';
import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { graphiqlExpress } from 'apollo-server-express';
import { GraphQlService } from './schemas/graphql.service';
import { GraphqlController } from './graphql.controller.temp';
import { UsersResolver } from './resolvers/users.resolver';
import { PersistanceModule } from '../persistance/persistance.module';

@Module({
    imports: [
        GraphQLModule,
        PersistanceModule,
    ],
    providers: [
        GraphQlService,
        UsersResolver,
    ],
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
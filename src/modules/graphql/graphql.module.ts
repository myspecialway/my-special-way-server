import * as passport from 'passport';
import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { graphiqlExpress } from 'apollo-server-express';
import { GraphQlService } from './schemas/graphql.service';
import { GraphqlController } from './graphql-controller/graphql.controller.temp';
import { UsersResolver, ClassResolver} from './resolvers/';
import { PersistenceModule } from '../persistence/persistence.module';
import graphqlPlayground from 'graphql-playground-middleware-express';

@Module({
    imports: [
        GraphQLModule,
        PersistenceModule,
    ],
    providers: [
        GraphQlService,
        UsersResolver,
        ClassResolver,
    ],
    controllers: [GraphqlController],
})
export class GraphqlModule implements NestModule {
    public configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(passport.initialize())
            .forRoutes('/graphql')
            // .apply(passport.authenticate('jwt', { session: false }))
            .apply(null)
            .forRoutes('/graphql')
            .apply(graphqlPlayground({endpoint: '/graphql'}))
            // .apply(graphiqlExpress({ endpointURL: '/graphql' }))
            .forRoutes('/play');
    }
}
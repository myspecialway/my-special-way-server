import * as passport from 'passport';
import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
// import { graphiqlExpress } from 'apollo-server-express';
import { GraphQlService } from './schemas/graphql.service';
import { GraphqlController } from './graphql-controller/graphql.controller.temp';
import { UsersResolver } from './resolvers/users.resolver';
import { ClassResolver } from './resolvers/class.resolver';
import { StudentResolver } from './resolvers/student.resolver';
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
        StudentResolver,
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
            .apply(graphqlPlayground({endpoint: '/graphql'}))
            // .apply(graphiqlExpress({ endpointURL: '/graphql' }))
            .forRoutes('/play');
    }
}
import * as passport from 'passport';
import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { GraphQlService } from './schemas/graphql.service';
import { GraphqlController } from './graphql-controller/graphql.controller.temp';
import { UsersResolver } from './resolvers/users.resolver';
import { ClassResolver } from './resolvers/class/class.resolver';
import { LessonResolver } from './resolvers/lesson.resolver';
import { StudentResolver } from './resolvers/student.resolver';
import { LocationsResolver } from './resolvers/locations.resolver';
import { PersistenceModule } from '../persistence/persistence.module';
import graphqlPlayground from 'graphql-playground-middleware-express';
import { getConfig } from '../../config/config-loader';
import { ClassLogic } from './resolvers/class/services/class-logic.service';
import { LabelsResolver } from './resolvers/label.resolver';

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
        LessonResolver,
        LocationsResolver,
        LabelsResolver,
        ClassLogic,
    ],
    controllers: [GraphqlController],
})
export class GraphqlModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        if (!getConfig().isDev) {
            consumer
                .apply(passport.initialize())
                .forRoutes('/graphql')
                .apply(passport.authenticate('jwt', { session: false }))
                .forRoutes('/graphql');
        }
        consumer
            .apply(graphqlPlayground({ endpoint: '/graphql' }))
            .forRoutes('/play');
    }
}

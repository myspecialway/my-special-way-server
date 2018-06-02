import * as passport from 'passport';
// import * as passport from 'passport';
import { buildSchema } from 'graphql';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [GraphqlModule, AuthModule],
})

export class AppModule implements NestModule {
  constructor(private readonly graphQLFactory: GraphQLFactory) { }
  configure(consumer: MiddlewareConsumer) {
    const schema = buildSchema(`
    const root = {
      message: () => 'Welcome to My-Special-W@@y!',
    };
    consumer
      .apply(passport.initialize())
      .forRoutes('/graphql')
      .apply(passport.authenticate('jwt', { session: false }))
      .forRoutes('/graphql')
      .apply(graphqlExpress(req => ({ schema, rootValue: root })))
      .forRoutes('/graphql')
      .apply(graphiqlExpress({ endpointURL: '/graphql' }))
      .forRoutes('/graphiql');
  }
import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { graphqlExpress } from 'apollo-server-express';
import { GraphQLModule, GraphQLFactory,   } from '@nestjs/graphql';
import * as express_graphql from 'express-graphql';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { buildSchema } from 'graphql';

@Module({
  imports: [GraphQLModule],
  controllers: [AppController],
  providers: [ AppService ],
})
export class AppModule implements  NestModule {
  constructor(private readonly graphQLFactory: GraphQLFactory) {}

  // GraphQL schema
   private sChema = buildSchema(`
      type Query {
          message: String
      }
    `);

    // Root resolver
    private root = {
      message: () => 'Hello World2!'
    };
  configure(consumer: MiddlewareConsumer) {
    const typeDefs = this.graphQLFactory.mergeTypesByPaths('./**/*.graphql');
    const schema = this.graphQLFactory;

    consumer
      // .apply(graphqlExpress(req => ({ schema: this.sChema, rootValue: this.root ,graphiql: true})))
      .apply(express_graphql({
        schema: this.sChema,
        rootValue: this.root,
        graphiql: true
    }))
      .forRoutes('/graphql');
  }
}
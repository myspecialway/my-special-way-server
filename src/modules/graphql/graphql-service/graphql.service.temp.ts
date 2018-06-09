import { buildSchema, GraphQLSchema, GraphQLObjectType } from 'graphql';
import { queryPersonType } from '../queries/person.query.temp';
export class GraphqlService {
    constructor(){}

    //import { GraphQLModule, GraphQLFactory } from '@nestjs/graphql';
    // const typeDefs = this.graphQLFactory.mergeTypesByPaths('./**/*.graphql');
    // const schema = this.graphQLFactory.createSchema({ typeDefs });

    public get schema() : GraphQLSchema {
        return buildSchema(`type Query {
            message: String
        }`);
    }

    public get _schema():GraphQLSchema {
        return new GraphQLSchema({
            query: queryPersonType/*,
            mutation: new GraphQLObjectType({
            name: 'Mutation',
            fields: null//mutation
            })*/
        })
        }
}
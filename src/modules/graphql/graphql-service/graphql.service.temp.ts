import { buildSchema, GraphQLSchema, GraphQLObjectType } from 'graphql';
import { queryType } from '../queries/person.query.temp';
export class GraphqlService {
    constructor(){}

    public get schema() : GraphQLSchema {
        return buildSchema(`type Query {
            message: String
        }`);
    }

    private _schema = new GraphQLSchema({
        query: queryType,
        mutation: new GraphQLObjectType({
          name: 'Mutation',
          fields: null//mutation
        })
      })
}
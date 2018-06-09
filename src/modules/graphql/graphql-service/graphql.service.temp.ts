import { buildSchema, GraphQLSchema, GraphQLObjectType } from 'graphql';
import { queryPersonType } from '../queries/person.query.temp';
export class GraphqlService {
    constructor(){}

    public get root() {
        return { message: () => 'Welcome to My-Special-W@@y!'};
    }

    public get schema(): GraphQLSchema {
        return buildSchema(`type Query {
            message: String
        }`);
    }

    public get _schema(): GraphQLSchema {
        return new GraphQLSchema({
            query: queryPersonType,
            /*mutation: new GraphQLObjectType({
            name: 'Mutation',
            fields: null//mutation
            })*/
        });
    }
}
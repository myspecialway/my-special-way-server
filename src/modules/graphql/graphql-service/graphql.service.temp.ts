import { buildSchema, GraphQLSchema, GraphQLObjectType } from 'graphql';
import { queryPersonType } from '../queries/person.query.temp';
export class GraphqlService {
    constructor(){}

    public get root() {
        return { persons: () => ['Welcome to My-Special-W@@y!']};
    }

    public get schema(): GraphQLSchema {
        return new GraphQLSchema({
            query: queryPersonType,
            /*mutation: new GraphQLObjectType({
            name: 'Mutation',
            fields: null//mutation
            })*/
        });
    }
}
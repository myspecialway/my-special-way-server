import { GraphQLObjectType } from 'graphql';
import { GraphQLList } from 'graphql';
import { personModel } from '../../../mock_temporary/personMock';
import { personType } from '../types/person.type';

// Query
export const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => {
    return {
      persons: {
        type: new GraphQLList(personType),
        resolve: () => {
          const persons = personModel;
          if (!persons) {
            throw new Error('Error occurred while getting persons');
          }
          return persons;
        },
      },
    };
  },
});
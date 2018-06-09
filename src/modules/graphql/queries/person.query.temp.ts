import { GraphQLObjectType, GraphQLList } from 'graphql';
import { personModel } from '../../../mock_temporary/personMock';
import { personType } from '../types/person.type.temp';

// Query
export const queryPersonType = new GraphQLObjectType({
  name: 'personQuery',
  description: `This represents a personQuery`,
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
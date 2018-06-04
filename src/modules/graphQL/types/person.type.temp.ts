/* istanbul ignore next */
import { GraphQLObjectType, GraphQLNonNull,
    GraphQLID, GraphQLString} from 'graphql';

/* istanbul ignore next */
const addressType = new GraphQLObjectType({
    name: 'address',
    fields: () => {
        return {
            street: {
                type: GraphQLString,
            },
            zip: {
                type: GraphQLString,
            },
            city: {
                type: GraphQLString,
            },
            country: {
                type: GraphQLString,
            },
        };
    },
});

/* istanbul ignore next */
const contactType = new GraphQLObjectType({
    name: 'contact',
    fields: () => {
        return {
            email: {
                type: GraphQLString,
            },
            phone: {
                type: GraphQLString,
            },
            emergencyContact_1: {
                type: GraphQLString,
            },
            emergencyContact_2: {
                type: GraphQLString,
            },
        };
    },
});

/* istanbul ignore next */
const demographyType = new GraphQLObjectType({
    name: 'demography',
    fields: () => {
      return {
            name : {
                type: GraphQLString,
            },
            firstName: {
                type: GraphQLString,
            },
            birthday: {
                type: GraphQLString,
            },
            contacts: {
                type : contactType,
            },
            address: {
                type : demographyType,
            },
        };
    },
});

/* istanbul ignore next */
// Person Type
export const personType = new GraphQLObjectType({
  name: 'person',
  fields: () => {
    return {
      personId: {
        type: new GraphQLNonNull(GraphQLID),
      },
      type: {
        type: GraphQLString,
      },
      status : {
        type: GraphQLString,
      },
      password: {
        type: GraphQLString,
      },
      demography : {
        type: demographyType,
      },
    };
  },
});
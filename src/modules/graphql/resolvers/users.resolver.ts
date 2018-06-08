import { IResolvers } from 'graphql-tools';

export const userResolvers = {
    users: (a, b, c, d) => {

        console.log(a);
        console.log(b);
        console.log(c);
        console.log(d);
    },
    user: (a, b, c, d) => {
        console.log(a);
        console.log(b);
        console.log(c);
        console.log(d);
    },
};

const users = [
    {
        id: '1',
        username: 'first',
    },
    {
        id: '2',
        username: 'second',
    },
    {
        id: '3',
        username: 'third',
    },
];
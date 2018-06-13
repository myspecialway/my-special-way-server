import * as fs from 'fs';
import * as path from 'path';
import { GraphQLSchema } from 'graphql';
import { Injectable, Logger } from '@nestjs/common';
import { GraphQLFactory } from '@nestjs/graphql';
import * as _ from 'lodash';
import { IResolvers, IResolverOptions, IResolverObject } from 'graphql-tools/dist/Interfaces';
import { ResolveOptions } from 'dns';

const info = 'hello';
const classes = [
    {
        _id: 'class1', name: 'class1', level: 'A', number: 1,
        schedule: {
            sun_0: {title: 'lesson1', icon: 'icon name'},
        },
    },
    {
        _id: 'class2', name: 'class2', level: 'A', number: 2,
        schedule: {
            sun_0: {title: 'lesson1', icon: 'icon name'},
        },
    },
];
const teachers = [
    {_id: '100', name: 'teacher1', lastname: 'teacher', class_id: 'class1'},
    {_id: '101', name: 'teacher2', lastname: 'teacher2', class_id: 'class2'},
];
const students = [
    {_id: 's1', name: 'student1', lastname: '', class_id: 'class1'},
    {_id: 's2', name: 'student2', lastname: '', class_id: 'class1'},
    {_id: 's3', name: 'student3', lastname: '', class_id: 'class1'},
    {_id: 's4', name: 'student4', lastname: '', class_id: 'class2'},
];

@Injectable()
export class GraphQlService extends Logger {
    constructor(private graphQlFactory: GraphQLFactory) {
        super('GraphQlService');
    }
    public schema = `
        schema {
            query: Query
            # mutation: Mutation
        }
        type Query {
            info: String
            # getAllStudents: [Student!]!
            getClasses: [Class]!
        }

        type Teacher {
            _id: ID!
            name: String!
            lastname: String!
            students: [Student!]
        }
        type Student {
            _id: ID!
            name: String!
            lastname: String!
            class: Class!
            schedule: Schedule
            teacher: Teacher!
        }

        type Class {
            #_id: ID!
            name: String!
            level: String!
            number: Int
            schedule: Schedule!
            location: Point
            students: [Student]
            teachers: [Teacher]
        }

        type Schedule {
            sun_0: Lesson
            sun_1: Lesson
            sun_2: Lesson
            sun_3: Lesson
            sun_4: Lesson
            sun_5: Lesson
            sun_6: Lesson
            sun_7: Lesson
            sun_8: Lesson
            sun_9: Lesson
            mon_0: Lesson
            mon_1: Lesson
            mon_2: Lesson
            mon_3: Lesson
            mon_4: Lesson
            mon_5: Lesson
            mon_6: Lesson
            mon_7: Lesson
            mon_8: Lesson
            mon_9: Lesson
            tue_0: Lesson
            tue_1: Lesson
            tue_2: Lesson
            tue_3: Lesson
            tue_4: Lesson
            tue_5: Lesson
            tue_6: Lesson
            tue_7: Lesson
            tue_8: Lesson
            tue_9: Lesson
            wed_0: Lesson
            wed_1: Lesson
            wed_2: Lesson
            wed_3: Lesson
            wed_4: Lesson
            wed_5: Lesson
            wed_6: Lesson
            wed_7: Lesson
            wed_8: Lesson
            wed_9: Lesson
            thu_0: Lesson
            thu_1: Lesson
            thu_2: Lesson
            thu_3: Lesson
            thu_4: Lesson
            thu_5: Lesson
            thu_6: Lesson
            thu_7: Lesson
            thu_8: Lesson
            thu_9: Lesson
            fri_0: Lesson
            fri_1: Lesson
            fri_2: Lesson
            fri_3: Lesson
            fri_4: Lesson
            fri_5: Lesson
            fri_6: Lesson
            fri_7: Lesson
            fri_8: Lesson
            fri_9: Lesson
        }

        type Lesson {
            title: String!
            icon: String
        }

        type Point {
            latitude: Float!
            longitude: Float!
        }
    `;
    public resolvers: IResolvers = {
        Query: {
            info: (root, args, context) =>  {
                // tslint:disable-next-line:no-console
                console.log({root, args, context});
            },
            getClasses: (root, args, context) => {
                return classes;
            },
        },
        Class: {
            students: () => students,
        },
    };
    getSchema(): GraphQLSchema {
        try {
            this.log('getSchema:: starting schema creation');
            const typeDefs = this.schema;
            // const files = fs.readdirSync(__dirname).filter(file => file.includes('.gql'));

            // for (const file of files) {
            //     typeDefs += fs.readFileSync(path.join(__dirname, file)).toString('utf8');
            // }

            const schema = this.graphQlFactory.createSchema({ typeDefs, resolvers: this.resolvers });
            this.log('getSchema:: schema creation complete');
            return schema;
        } catch (error) {
            this.error('getSchema:: error creating schema', error.stack);
            throw error;
        }
    }
}

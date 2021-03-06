jest.mock('fs');

import * as fs from 'fs';
import { GraphQlService } from './graphql.service';
import { GraphQLFactory } from '@nestjs/graphql';

describe('grapql service', () => {
    let graphqlService: GraphQlService;
    let graphqlFactory: Partial<GraphQLFactory>;
    beforeEach(() => {
        graphqlFactory = {
            createSchema: jest.fn(),
        };

        graphqlService = new GraphQlService(graphqlFactory as GraphQLFactory);
    });

    it('should retrieve files with only *.gql ext for schemas', () => {
        (fs.readdirSync as jest.Mock).mockReturnValueOnce(['file1.gql', 'file2.gql', 'otherfile.txt']);
        (fs.readFileSync as jest.Mock).mockImplementation(filename => filename);
        (graphqlFactory.createSchema as jest.Mock).mockImplementationOnce(files => files);

        const schema = graphqlService.getSchema();
        const schemaToTest = schema as any;

        expect(schemaToTest.typeDefs).toContain('file1.gql');
        expect(schemaToTest.typeDefs).toContain('file2.gql');
        expect(schemaToTest.typeDefs).not.toContain('otherfile.txt');
    });

    it('should rethrow an error and write to log if error has been thrown throughout the execution', () => {
        (fs.readdirSync as jest.Mock).mockImplementation(() => { throw new Error('mock error'); });

        expect(graphqlService.getSchema.bind(graphqlService)).toThrow();
    });
});

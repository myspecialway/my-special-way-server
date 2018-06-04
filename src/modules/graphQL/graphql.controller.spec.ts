import { GraphqlController } from './graphql.controller.temp';
import { Request, Response } from 'express';

describe('graphql controller', () => {
    let controller: GraphqlController;
    beforeEach(() => {
        controller = new GraphqlController();
    });

    it('should get response from POST graphql endoiubt', () => {
        const mockRequest = new Request(null);
        const mockResponse = new Response();
        controller.postGraphql(mockRequest, mockResponse, () => { });
    });
});
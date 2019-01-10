// Returns a new mock request for use in testing.
import { Response, Request } from 'express';

export const mockReq = (options = {}): Partial<Request> => {
  const ret: Partial<Request> = {};
  return Object.assign(
    ret,
    {
      headers: jest.fn().mockReturnValue(ret),
      accepts: jest.fn().mockReturnValue(ret),
      acceptsCharsets: jest.fn().mockReturnValue(ret),
      acceptsEncodings: jest.fn().mockReturnValue(ret),
      acceptsLanguages: jest.fn().mockReturnValue(ret),
      body: {},
      flash: jest.fn().mockReturnValue(ret),
      get: jest.fn().mockReturnValue(ret),
      is: jest.fn().mockReturnValue(ret),
      params: {},
      query: {},
      session: {},
    },
    options,
  );
};

// Returns a new mock response for use in testing.
export const mockRes = (options = {}): Partial<Response> => {
  const ret: Partial<Response> = {};
  return Object.assign(
    ret,
    {
      append: jest.fn().mockReturnValue(ret),
      attachement: jest.fn().mockReturnValue(ret),
      clearCookie: jest.fn().mockReturnValue(ret),
      cookie: jest.fn().mockReturnValue(ret),
      download: jest.fn().mockReturnValue(ret),
      end: jest.fn().mockReturnValue(ret),
      format: {},
      get: jest.fn().mockReturnValue(ret),
      headersSent: jest.fn().mockReturnValue(ret),
      json: jest.fn().mockReturnValue(ret),
      jsonp: jest.fn().mockReturnValue(ret),
      links: jest.fn().mockReturnValue(ret),
      locals: {},
      location: jest.fn().mockReturnValue(ret),
      redirect: jest.fn().mockReturnValue(ret),
      render: jest.fn().mockReturnValue(ret),
      send: jest.fn().mockReturnValue(ret),
      sendFile: jest.fn().mockReturnValue(ret),
      sendStatus: jest.fn().mockReturnValue(ret),
      set: jest.fn().mockReturnValue(ret),
      status: jest.fn().mockReturnValue(ret),
      type: jest.fn().mockReturnValue(ret),
      vary: jest.fn().mockReturnValue(ret),
      write: jest.fn().mockReturnValue(ret),
      writeHead: jest.fn().mockReturnValue(ret),
    },
    options,
  );
};

import 'express';

// Augment Express's Request with the fields our middleware attaches:
//  - `userId`  set by requireAuth after a valid token is verified
//  - `valid`   holds input that passed Zod validation (controllers read this
//              instead of the raw req.body/query/params)
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      valid: {
        body: unknown;
        query: unknown;
        params: unknown;
      };
    }
  }
}

export {};

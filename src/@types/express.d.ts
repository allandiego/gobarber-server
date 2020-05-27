/**
 * In this file we are extending the Request interface provided by Express
 * to include an `user` option with an id.
 *
 * This way we can set this value inside a middleware and it will be available
 * to other functions throughout the processing flow.
 *
 * It will also be availble in the intelisense if using typescript.
 */
declare namespace Express {
  export interface Request {
    user: {
      id: string;
    };
  }
}

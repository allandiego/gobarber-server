/**
 * The main idea behind this class that is similar to the default one is
 * to provide a way for us to know when an error is trully unexpected (default
 * error class, thrown in runtime) or some error we catch during normal
 * flow (explicitly thrown in the code).
 */
export default class AppError {
  public readonly message: string;

  public readonly statusCode: number;

  constructor(message: string, statusCode = 400) {
    this.message = message;
    this.statusCode = statusCode;
  }
}

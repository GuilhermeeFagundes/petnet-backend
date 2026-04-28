export class ResponseError extends Error {
  constructor(message, httpCode = 400) {
    super(message);
    this.httpCode = httpCode;
    this.name = 'ResponseError';
  }
}

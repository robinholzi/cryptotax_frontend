
export class InvalidCsvInputError extends Error {
  constructor(msg: string) {
      super(msg);
      Object.setPrototypeOf(this, InvalidCsvInputError.prototype);
  }
}
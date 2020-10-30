export default class ErrorResponse {
  constructor(code, message, type) {
    this.code = code;
    this.message = message;
    this.type = type;
  }
}

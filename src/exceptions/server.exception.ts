import { HttpException } from '@nestjs/common';
import { ErrorCode, code2message, code2status } from './error-codes';

export class ServerException extends HttpException {
  private readonly _code;
  constructor(code: ErrorCode) {
    super(code2message.get(code) as string, code2status.get(code) as number);
    this._code = code;
  }

  get exceptionCode() {
    return this._code;
  }
}

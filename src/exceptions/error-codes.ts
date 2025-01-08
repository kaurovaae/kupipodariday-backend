import { HttpStatus } from '@nestjs/common';

export enum ErrorCode {
  LoginOrPasswordIncorrect = 100,
  UserAlreadyExists = 101,
}

export const code2message = new Map<ErrorCode, string>([
  [ErrorCode.LoginOrPasswordIncorrect, 'Login or password is incorrect'],
  [ErrorCode.UserAlreadyExists, 'User already exists'],
]);

export const code2status = new Map<ErrorCode, HttpStatus>([
  [ErrorCode.LoginOrPasswordIncorrect, HttpStatus.BAD_REQUEST],
  [ErrorCode.UserAlreadyExists, HttpStatus.BAD_REQUEST],
]);

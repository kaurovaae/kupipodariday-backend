import { HttpStatus } from '@nestjs/common';

export enum ErrorCode {
  LoginOrPasswordIncorrect = 100,
  UserAlreadyExists = 101,
  UserNotFound = 102,
  Unauthorized = 103,
  NotFound = 104,
  WishNotFound = 105,
  OfferNotFound = 106,
  WishlistNotFound = 107,
  Conflict = 108,
  TooMuchMoney = 109,
  EmptyItemsId = 110,
  WishesNotFound = 111,
  ConflictUpdateOtherProfile = 112,
}

export const code2message = new Map<ErrorCode, string>([
  [ErrorCode.LoginOrPasswordIncorrect, 'Некорректный логин или пароль'],
  [ErrorCode.UserAlreadyExists, 'Пользователь уже существует'],
  [ErrorCode.Unauthorized, 'Unauthorized'],
  [ErrorCode.UserNotFound, 'Пользователь не найден'],
  [ErrorCode.NotFound, 'Not found'],
  [ErrorCode.WishNotFound, 'Подарок не найден'],
  [ErrorCode.OfferNotFound, 'Заявка не найдена'],
  [ErrorCode.WishlistNotFound, 'Вишлист не найден'],
  [ErrorCode.Conflict, 'Conflict'],
  [ErrorCode.TooMuchMoney, 'Сумма заявки больше чем осталось собрать'],
  [ErrorCode.EmptyItemsId, 'Отсутствует itemsId'],
  [ErrorCode.WishesNotFound, 'Подарки с указанными id не найдены'],
  [ErrorCode.ConflictUpdateOtherProfile, 'Нельзя редактировать чужой профиль'],
]);

export const code2status = new Map<ErrorCode, HttpStatus>([
  [ErrorCode.LoginOrPasswordIncorrect, HttpStatus.BAD_REQUEST],
  [ErrorCode.UserAlreadyExists, HttpStatus.BAD_REQUEST],
  [ErrorCode.Unauthorized, HttpStatus.UNAUTHORIZED],
  [ErrorCode.UserNotFound, HttpStatus.NOT_FOUND],
  [ErrorCode.NotFound, HttpStatus.NOT_FOUND],
  [ErrorCode.WishNotFound, HttpStatus.NOT_FOUND],
  [ErrorCode.OfferNotFound, HttpStatus.NOT_FOUND],
  [ErrorCode.WishlistNotFound, HttpStatus.NOT_FOUND],
  [ErrorCode.Conflict, HttpStatus.CONFLICT],
  [ErrorCode.TooMuchMoney, HttpStatus.CONFLICT],
  [ErrorCode.EmptyItemsId, HttpStatus.BAD_REQUEST],
  [ErrorCode.WishesNotFound, HttpStatus.NOT_FOUND],
  [ErrorCode.ConflictUpdateOtherProfile, HttpStatus.BAD_REQUEST],
]);

import { HttpStatus } from '@nestjs/common';

export enum ErrorCode {
  LoginOrPasswordIncorrect = 100,
  UserAlreadyExists = 101,
  UserNotFound = 102,
  Unauthorized = 103,
  NotFound = 104,
  Conflict = 105,

  WishNotFound = 200,
  WishesNotFound = 201,
  ConflictUpdateWishPrice = 202,
  ConflictUpdateOfferTooMuchMoney = 203,
  ConflictCreateOwnWishOffer = 204,
  WishRaisedIsRatherThanPrice = 205,

  WishlistNotFound = 300,

  OfferNotFound = 400,
  EmptyItemsId = 401,

  ConflictUpdateOtherProfile = 500,
  ConflictDeleteOtherProfile = 501,
  ConflictUpdateOtherWish = 502,
  ConflictDeleteOtherWish = 503,
  ConflictUpdateOtherWishlist = 504,
  ConflictDeleteOtherWishlist = 505,
}

export const code2message = new Map<ErrorCode, string>([
  [ErrorCode.LoginOrPasswordIncorrect, 'Некорректный логин или пароль'],
  [ErrorCode.UserAlreadyExists, 'Пользователь уже существует'],
  [ErrorCode.Unauthorized, 'Unauthorized'],
  [ErrorCode.UserNotFound, 'Пользователь не найден'],
  [ErrorCode.NotFound, 'Not found'],
  [ErrorCode.WishNotFound, 'Подарок не найден'],
  [
    ErrorCode.WishRaisedIsRatherThanPrice,
    'Сумма предварительного сбора не может быть больше стоимости подарка',
  ],
  [ErrorCode.OfferNotFound, 'Заявка не найдена'],
  [ErrorCode.WishlistNotFound, 'Вишлист не найден'],
  [ErrorCode.Conflict, 'Conflict'],
  [
    ErrorCode.ConflictUpdateOfferTooMuchMoney,
    'Сумма заявки больше, чем осталось собрать',
  ],
  [ErrorCode.EmptyItemsId, 'Отсутствует itemsId'],
  [ErrorCode.WishesNotFound, 'Подарки с указанными id не найдены'],
  [ErrorCode.ConflictUpdateOtherProfile, 'Нельзя редактировать чужой профиль'],
  [ErrorCode.ConflictDeleteOtherProfile, 'Нельзя удалить чужой профиль'],
  [ErrorCode.ConflictUpdateOtherWish, 'Нельзя редактировать чужой подарок'],
  [ErrorCode.ConflictDeleteOtherWish, 'Нельзя удалить чужой подарок'],
  [ErrorCode.ConflictUpdateOtherWishlist, 'Нельзя редактировать чужой вишлист'],
  [ErrorCode.ConflictDeleteOtherWishlist, 'Нельзя удалить чужой вишлист'],
  [ErrorCode.ConflictUpdateWishPrice, 'Нельзя изменить стоимость подарка'],
  [ErrorCode.ConflictCreateOwnWishOffer, 'Нельзя скинуться на свой подарок'],
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
  [ErrorCode.ConflictUpdateOfferTooMuchMoney, HttpStatus.CONFLICT],
  [ErrorCode.EmptyItemsId, HttpStatus.BAD_REQUEST],
  [ErrorCode.WishesNotFound, HttpStatus.NOT_FOUND],
  [ErrorCode.ConflictUpdateOtherProfile, HttpStatus.BAD_REQUEST],
  [ErrorCode.ConflictDeleteOtherProfile, HttpStatus.BAD_REQUEST],
  [ErrorCode.ConflictUpdateOtherWish, HttpStatus.BAD_REQUEST],
  [ErrorCode.ConflictDeleteOtherWish, HttpStatus.BAD_REQUEST],
  [ErrorCode.ConflictUpdateOtherWishlist, HttpStatus.BAD_REQUEST],
  [ErrorCode.ConflictDeleteOtherWishlist, HttpStatus.BAD_REQUEST],
  [ErrorCode.ConflictUpdateWishPrice, HttpStatus.BAD_REQUEST],
  [ErrorCode.ConflictCreateOwnWishOffer, HttpStatus.BAD_REQUEST],
]);

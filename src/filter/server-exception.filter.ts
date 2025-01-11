import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { ServerException } from '../exceptions/server.exception';

@Catch(ServerException)
export class ServerExceptionFilter implements ExceptionFilter {
  catch(exception: ServerException, host: ArgumentsHost) {
    /**
     * Реализуйте обработку исключения в фильтре, чтобы вернуть ответ в нужном формате
     */
    console.log('exception', exception.exceptionCode);
    const status = exception.getStatus();
    console.log('status', status);
    const message = exception.getResponse();
    console.log('message', message);

    const ctx = host.switchToHttp();

    // const request = ctx.getRequest();
    const response = ctx.getResponse();

    // меняем объект ответа
    response.status(status).json({
      errorCode: exception.exceptionCode,
      message,
      status,
    });
  }
}

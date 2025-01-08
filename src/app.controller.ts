import { Controller, UseFilters } from '@nestjs/common';
import { ServerExceptionFilter } from './filter/server-exception.filter';

@UseFilters(ServerExceptionFilter)
@Controller()
export class AppController {}

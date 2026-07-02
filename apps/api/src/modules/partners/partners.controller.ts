/* eslint-disable @typescript-eslint/require-await, @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/explicit-function-return-type */
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors } from '@nestjs/common';
import { UserRole } from '@prisma/client';

import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { ResponseInterceptor } from '../../common/interceptors/response.interceptor';

import { CreatePartnerDto, UpdatePartnerDto } from './dto/partner.dto';
import { PartnersService } from './partners.service';

@Controller('api/v1/partners')
@UseInterceptors(ResponseInterceptor)
export class PartnersController {
  constructor(private readonly partnersService: PartnersService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() createPartnerDto: CreatePartnerDto) {
    return this.partnersService.create(createPartnerDto);
  }

  @Public()
  @Get()
  findAll(@Query() query: any) {
    return this.partnersService.findAll(query);
  }

  @Public()
  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.partnersService.findOne(slug);
  }

  @Patch(':slug')
  @Roles(UserRole.ADMIN)
  update(@Param('slug') slug: string, @Body() updatePartnerDto: UpdatePartnerDto) {
    return this.partnersService.update(slug, updatePartnerDto);
  }

  @Delete(':slug')
  @Roles(UserRole.ADMIN)
  remove(@Param('slug') slug: string) {
    return this.partnersService.softDelete(slug);
  }
}

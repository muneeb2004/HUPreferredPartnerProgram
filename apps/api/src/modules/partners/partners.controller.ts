import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors } from '@nestjs/common';

import { ResponseInterceptor } from '../../common/interceptors/response.interceptor';

import { CreatePartnerDto, UpdatePartnerDto } from './dto/partner.dto';
import { PartnersService } from './partners.service';

@Controller('api/v1/partners')
@UseInterceptors(ResponseInterceptor)
export class PartnersController {
  constructor(private readonly partnersService: PartnersService) {}

  @Post()
  create(@Body() createPartnerDto: CreatePartnerDto) {
    return this.partnersService.create(createPartnerDto);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.partnersService.findAll(query);
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.partnersService.findOne(slug);
  }

  @Patch(':slug')
  update(@Param('slug') slug: string, @Body() updatePartnerDto: UpdatePartnerDto) {
    return this.partnersService.update(slug, updatePartnerDto);
  }

  @Delete(':slug')
  remove(@Param('slug') slug: string) {
    return this.partnersService.softDelete(slug);
  }
}

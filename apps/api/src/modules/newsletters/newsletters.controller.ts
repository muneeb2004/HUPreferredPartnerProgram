import { Controller, Get, Post, Param, Query, UseGuards, Body, Patch, Delete } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { UserRole } from '@prisma/client';

import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';

import { CreateNewsletterIssueDto, UpdateNewsletterIssueDto } from './dto/newsletter.dto';
import { NewslettersService } from './newsletters.service';


@Controller('api/v1')
export class NewslettersController {
  constructor(private newslettersService: NewslettersService) {}

  @Public()
  @Throttle({ default: { limit: 100, ttl: 60000 } })
  @Get('newsletters')
  async findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.newslettersService.findAll(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
    );
  }

  @Public()
  @Throttle({ default: { limit: 100, ttl: 60000 } })
  @Get('newsletters/:slug')
  async findOne(@Param('slug') slug: string) {
    return this.newslettersService.findBySlug(slug);
  }

  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @Throttle({ default: { limit: 1, ttl: 600000 } })
  @Post('admin/newsletters/:id/send')
  async triggerSend(@Param('id') id: string) {
    return this.newslettersService.triggerSend(id);
  }

  // --- Admin CRUD ---
  
  @Get('admin/newsletters/series')
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  async findAllSeries() {
    return this.newslettersService.findAllSeries();
  }

  @Get('admin/newsletters')
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  async findAllAdmin() {
    return this.newslettersService.findAllAdmin();
  }

  @Get('admin/newsletters/:id')
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  async findOneAdmin(@Param('id') id: string) {
    return this.newslettersService.findOneAdmin(id);
  }

  @Post('admin/newsletters')
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  async createIssue(@Body() dto: CreateNewsletterIssueDto) {
    return this.newslettersService.createIssue(dto);
  }

  @Patch('admin/newsletters/:id')
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  async updateIssue(@Param('id') id: string, @Body() dto: UpdateNewsletterIssueDto) {
    return this.newslettersService.updateIssue(id, dto);
  }

  @Delete('admin/newsletters/:id')
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  async deleteIssue(@Param('id') id: string) {
    return this.newslettersService.deleteIssue(id);
  }
}

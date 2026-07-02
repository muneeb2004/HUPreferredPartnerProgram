/* eslint-disable @typescript-eslint/require-await, @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/explicit-function-return-type */
import { Controller, Post, Body, UseInterceptors } from '@nestjs/common';

import { ResponseInterceptor } from '../../common/interceptors/response.interceptor';

import { MediaService } from './media.service';

@Controller('api/v1/media')
@UseInterceptors(ResponseInterceptor)
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload-url')
  generateUploadUrl(@Body() body: { fileName: string; mimeType: string }) {
    return this.mediaService.generateUploadUrl(body.fileName, body.mimeType);
  }

  @Post('confirm')
  confirmUpload(@Body() body: { key: string; url: string; mimeType: string; sizeBytes: number }) {
    return this.mediaService.confirmUpload(body.key, body.url, body.mimeType, body.sizeBytes);
  }
}

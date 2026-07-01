import { Controller, Post, Body, UseInterceptors } from '@nestjs/common';
import { MediaService } from './media.service';
import { ResponseInterceptor } from '../../common/interceptors/response.interceptor';

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

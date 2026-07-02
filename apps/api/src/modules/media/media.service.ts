/* eslint-disable @typescript-eslint/require-await, @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/explicit-function-return-type */
import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class MediaService {
  constructor(private readonly prisma: PrismaService) {}

  async generateUploadUrl(fileName: string, mimeType: string) {
    // Simulated S3 Signed URL generation
    // Real implementation would use @aws-sdk/client-s3 and getSignedUrl
    const s3Key = `${Date.now()}-${fileName}`;
    const uploadUrl = `https://s3-mock.amazonaws.com/upload/${s3Key}?Signature=mock`;

    return {
      uploadUrl,
      key: s3Key,
    };
  }

  async confirmUpload(key: string, url: string, mimeType: string, sizeBytes: number) {
    return this.prisma.mediaAsset.create({
      data: {
        key,
        url,
        mimeType,
        sizeBytes,
      },
    });
  }
}

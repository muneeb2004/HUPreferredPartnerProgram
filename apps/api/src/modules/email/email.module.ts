import { Module } from '@nestjs/common';

import { EmailProvider } from './email.provider';
import { SESProvider } from './ses.provider';

@Module({
  providers: [
    {
      provide: EmailProvider,
      useClass: SESProvider,
    },
  ],
  exports: [EmailProvider],
})
export class EmailDeliveryModule {}

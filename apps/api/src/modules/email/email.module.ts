/* eslint-disable @typescript-eslint/require-await, @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/explicit-function-return-type */
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

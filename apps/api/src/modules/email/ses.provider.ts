/* eslint-disable @typescript-eslint/require-await, @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/explicit-function-return-type */
import { Injectable, Logger } from '@nestjs/common';

import { EmailProvider, EmailOptions } from './email.provider';

@Injectable()
export class SESProvider implements EmailProvider {
  private readonly logger = new Logger(SESProvider.name);

  // In a real implementation, we would inject the AWS SES SDK client here.
  // For the architectural blueprint, we simulate the SES dispatch.

  async sendEmail(options: EmailOptions): Promise<boolean> {
    this.logger.log(`Simulating SES delivery to ${options.to} - Subject: ${options.subject}`);
    // Simulated network delay
    await new Promise(resolve => setTimeout(resolve, 50));
    return true;
  }

  async sendBulkEmail(options: EmailOptions[]): Promise<boolean[]> {
    this.logger.log(`Simulating SES bulk delivery for ${options.length} recipients`);
    await new Promise(resolve => setTimeout(resolve, 100));
    return options.map(() => true);
  }
}

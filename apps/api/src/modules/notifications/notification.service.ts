import { Injectable, Logger } from '@nestjs/common';
import { BaseNotificationPayload } from './interfaces';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  async send(payload: BaseNotificationPayload): Promise<void> {
    this.logger.log(`Sending notification [${payload.type}] to ${payload.recipientId}`);
    
    // Future expansion:
    // Route to email, sms, in-app, push based on preferences and payload
    
    if (payload.channels?.includes('email')) {
      this.logger.debug(`Would send email to ${payload.recipientId} with template ${payload.template}`);
    }

    if (payload.channels?.includes('in_app')) {
      this.logger.debug(`Would create in-app notification for ${payload.recipientId}`);
    }
  }
}

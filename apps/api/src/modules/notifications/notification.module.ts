import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { OfferNotificationListener } from './listeners/offer-notification.listener';

@Module({
  providers: [NotificationService, OfferNotificationListener],
  exports: [NotificationService],
})
export class NotificationModule {}

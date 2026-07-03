export type NotificationChannel = 'email' | 'in_app' | 'sms' | 'push';

export interface BaseNotificationPayload {
  recipientId: string;
  type: string;
  template?: string;
  channels?: NotificationChannel[];
  data: Record<string, any>;
}

export interface OfferExpiringSoonEvent {
  offerId: string;
  title: string;
  partnerId: string;
  endDate: Date;
}

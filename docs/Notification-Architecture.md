# Notification Architecture

The Notification Architecture provides a scalable, event-driven mechanism to dispatch messages across various channels (Email, In-App, SMS, Push).

## Core Components

1. **EventEmitter2**: Used for internal decoupling. Features/modules publish events (e.g., `offer.expiring_soon`, `user.email.change_requested`).
2. **Listeners**: Dedicated listener classes (e.g., `OfferNotificationListener`) subscribe to specific events, fetch necessary contextual data (like user preferences or active users), and construct standard notification payloads.
3. **NotificationService**: A centralized service that receives a `BaseNotificationPayload` from listeners. It acts as a router to the appropriate channels.

## Data Structures

```typescript
export type NotificationChannel = 'email' | 'in_app' | 'sms' | 'push';

export interface BaseNotificationPayload {
  recipientId: string;
  type: string;
  template?: string;
  channels?: NotificationChannel[];
  data: Record<string, any>;
}
```

## Future Expansion
The `NotificationService` is currently a stub that logs intentions. It is designed so that integrating Amazon SES (for email) or other providers only requires adding the corresponding provider logic within the service, without touching the event emitters or listeners.

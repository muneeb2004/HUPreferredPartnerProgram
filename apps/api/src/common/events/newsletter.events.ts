export class NewsletterPublishedEvent {
  constructor(public readonly newsletterId: string) {}
}

export class NewsletterSendRequestedEvent {
  constructor(public readonly newsletterId: string, public readonly issueId: string) {}
}

export class NewsletterQueuedEvent {
  constructor(public readonly issueId: string, public readonly totalSubscribers: number) {}
}

export class NewsletterSendingEvent {
  constructor(public readonly issueId: string) {}
}

export class NewsletterSentEvent {
  constructor(public readonly issueId: string) {}
}

export class DeliveryCompletedEvent {
  constructor(
    public readonly issueId: string, 
    public readonly subscriptionId: string,
    public readonly status: 'SENT' | 'BOUNCED' | 'COMPLAINED'
  ) {}
}

export class BounceReceivedEvent {
  constructor(public readonly email: string) {}
}

export class ComplaintReceivedEvent {
  constructor(public readonly email: string) {}
}

export class SubscriptionVerifiedEvent {
  constructor(public readonly subscriptionId: string) {}
}

export class SubscriptionUnsubscribedEvent {
  constructor(public readonly subscriptionId: string) {}
}

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  attachments?: any[];
}

export abstract class EmailProvider {
  abstract sendEmail(options: EmailOptions): Promise<boolean>;
  abstract sendBulkEmail(options: EmailOptions[]): Promise<boolean[]>;
}

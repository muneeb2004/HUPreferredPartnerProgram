import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class SubscribeDto {
  @IsEmail()
  email!: string;
}

export class VerifySubscriptionDto {
  @IsString()
  @IsNotEmpty()
  token!: string;
}

export class UnsubscribeDto {
  @IsEmail()
  email!: string;
}

export class ConfirmUnsubscribeDto {
  @IsString()
  @IsNotEmpty()
  token!: string;
}

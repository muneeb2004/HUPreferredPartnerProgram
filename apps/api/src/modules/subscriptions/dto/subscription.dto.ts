/* eslint-disable @typescript-eslint/require-await, @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/explicit-function-return-type */
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

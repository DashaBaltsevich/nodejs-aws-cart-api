import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class DeliveryDto {
  @IsString()
  @IsOptional()
  type?: string;

  @IsString()
  @IsNotEmpty()
  address: string;
}

export class PaymentDto {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  creditCard?: string;
}

export class CheckoutDto {
  @ValidateNested()
  @Type(() => PaymentDto)
  payment: PaymentDto;

  @ValidateNested()
  @Type(() => DeliveryDto)
  delivery: DeliveryDto;

  @IsString()
  comments: string;
}

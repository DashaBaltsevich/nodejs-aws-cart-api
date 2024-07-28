import {
  IsNotEmpty,
  IsString,
  ValidateNested,
  IsInt,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CartItemDto {
  @IsString()
  @IsNotEmpty()
  product_id: string;

  @IsInt()
  @IsNotEmpty()
  count: number;
}

export class UpdateCartDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  items: CartItemDto[];
}

import {
  IsString,
  IsNumber,
  IsOptional,
  IsUUID,
  IsArray,
  IsBoolean,
  Min,
  IsNotEmpty,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  stock: number;

  @IsUUID()
  categoryId: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  imageUrls?: string[];

  @IsString()
  @IsNotEmpty()
  sku: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
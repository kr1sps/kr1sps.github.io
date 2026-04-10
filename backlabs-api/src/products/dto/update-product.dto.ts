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

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Название не может быть пустым' })
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber({ allowNaN: false, maxDecimalPlaces: 2 })
  @Min(0, { message: 'Цена не может быть меньше 0' })
  price?: number;

  @IsOptional()
  @IsNumber({ allowNaN: false })
  @Min(0, { message: 'Остаток не может быть меньше 0' })
  stock?: number;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imageUrls?: string[];

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Артикул не может быть пустым' })
  sku?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

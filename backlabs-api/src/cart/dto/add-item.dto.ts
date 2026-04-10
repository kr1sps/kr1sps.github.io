import { IsUUID, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddItemDto {
  @ApiProperty({ description: 'ID товара' })
  @IsUUID()
  productId: string;

  @ApiProperty({ description: 'Количество товара' })
  @IsInt()
  @Min(1)
  quantity: number;
}

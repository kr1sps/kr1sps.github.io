import { InputType, Field, Float, Int } from '@nestjs/graphql';
import { IsString, Min, IsArray } from 'class-validator';

@InputType()
export class CreateProductInput {
  @Field()
  @IsString()
  name: string;

  @Field()
  @IsString()
  description: string;

  @Field(() => Float)
  @Min(0)
  price: number;

  @Field(() => Int)
  @Min(0)
  stock: number;

  @Field(() => [String], { defaultValue: [] })
  @IsArray()
  imageUrls: string[];

  @Field()
  @IsString()
  sku: string;

  @Field()
  categoryId: string;
}

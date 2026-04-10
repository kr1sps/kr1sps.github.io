import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

import { Product } from '../../products/entities/product.entity';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity('categories')
export class Category {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  name: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  description: string;

  @Field(() => Category, { nullable: true })
  @ManyToOne(() => Category, (category) => category.children, {
    nullable: true,
  })
  @JoinColumn({ name: 'parentId' })
  parent: Category;

  @Field(() => ID, { nullable: true })
  @Column({ nullable: true })
  parentId: string;

  @Field(() => [Category], { defaultValue: [] })
  @OneToMany(() => Category, (category) => category.parent)
  children: Category[];

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}

import {
  Resolver,
  Query,
  Args,
  ID,
  ResolveField,
  Parent,
  Int,
  Mutation,
} from '@nestjs/graphql';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { CategoriesService } from '../categories/categories.service';
import { Category } from '../categories/entities/category.entity';
import { PaginatedProducts } from './dto/paginated-products.dto';
import { CreateProductInput } from './dto/create-product.input';

@Resolver(() => Product)
export class ProductsResolver {
  constructor(
    private readonly productsService: ProductsService,
    private readonly categoriesService: CategoriesService,
  ) {}

  @Query(() => PaginatedProducts)
  async products(
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
  ) {
    const result = await this.productsService.findAll({ page, limit });
    return {
      items: result.data,
      totalCount: result.total,
      totalPages: Math.ceil(result.total / limit),
    };
  }

  @Mutation(() => Product)
  async createProduct(
    @Args('createProductInput') createProductInput: CreateProductInput,
  ) {
    return this.productsService.create(createProductInput);
  }

  @Query(() => [Product], { name: 'products' })
  async findAll() {
    const result = await this.productsService.findAll({ limit: 100, page: 1 });
    return result.data;
  }

  @Query(() => Product, { name: 'product', nullable: true })
  async findOne(@Args('id', { type: () => ID }) id: string) {
    return this.productsService.findOne(id);
  }

  @ResolveField(() => Category, { nullable: true })
  async category(@Parent() product: Product) {
    if (product.category) return product.category;
    return this.categoriesService.findOne(product.categoryId);
  }

  @Mutation(() => Product)
  async archiveProduct(@Args('id', { type: () => ID }) id: string) {
    return this.productsService.update(id, { isActive: true });
  }

  @Mutation(() => Product)
  async returnFromArchive(@Args('id', { type: () => ID }) id: string) {
    return this.productsService.update(id, { isActive: false });
  }
}

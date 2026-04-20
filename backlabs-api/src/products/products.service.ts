import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  ILike,
  Between,
  FindOptionsOrder,
  FindOptionsWhere,
} from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const existing = await this.productRepository.findOneBy({
      sku: createProductDto.sku,
    });
    if (existing) {
      throw new BadRequestException(
        `Product with SKU ${createProductDto.sku} already exists`,
      );
    }

    const product = this.productRepository.create({
      ...createProductDto,
      imageUrls:
        createProductDto.imageUrls && createProductDto.imageUrls.length > 0
          ? createProductDto.imageUrls
          : ['https://i.postimg.cc/9XD701DH/izobrazenie.png'],
      isActive: createProductDto.isActive ?? true,
    });

    return this.productRepository.save(product);
  }

  async findAll(query: QueryProductDto): Promise<{
    data: Product[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const {
      categoryId,
      minPrice,
      maxPrice,
      inStock,
      search,
      page = 1,
      limit = 24,
      sort,
      showArchived,
    } = query;

    const where: FindOptionsWhere<Product> = {};

    if (!showArchived) {
      where.isActive = true;
    }

    if (categoryId) where.categoryId = categoryId;
    if (minPrice !== undefined && maxPrice !== undefined) {
      where.price = Between(minPrice, maxPrice);
    } else if (minPrice !== undefined) {
      where.price = Between(minPrice, 999999999);
    } else if (maxPrice !== undefined) {
      where.price = Between(0, maxPrice);
    }
    if (inStock) where.stock = Between(1, 999999);
    if (search) {
      where.name = ILike(`%${search}%`);
    }

    let order: FindOptionsOrder<Product> = { createdAt: 'DESC' };
    if (sort) {
      const [field, direction] = sort.split('_');
      if (field === 'price') {
        order = { price: direction === 'asc' ? 'ASC' : 'DESC' };
      } else if (field === 'name') {
        order = { name: direction === 'asc' ? 'ASC' : 'DESC' };
      } else if (sort === 'newest') {
        order = { createdAt: 'DESC' };
      }
    }

    const [data, total] = await this.productRepository.findAndCount({
      where,
      order,
      skip: (page - 1) * limit,
      take: limit,
      relations: ['category'],
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.findOne(id);
    Object.assign(product, updateProductDto);

    return this.productRepository.save(product);
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    if (!product) {
      throw new NotFoundException('Product with ID ${id} not found');
    }

    return this.productRepository.delete(product.id);
  }
}

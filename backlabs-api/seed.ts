// seed.ts
import { AppDataSource } from './data-source';
import { User, UserRole } from './src/users/entities/user.entity';
import { Category } from './src/categories/entities/category.entity';
import { Product } from './src/products/entities/product.entity';
import * as bcrypt from 'bcrypt';

async function seed() {
  await AppDataSource.initialize();
  console.log('Data Source has been initialized!');

  const userRepository = AppDataSource.getRepository(User);
  const categoryRepository = AppDataSource.getRepository(Category);
  const productRepository = AppDataSource.getRepository(Product);

  const existingUsers = await userRepository.count();
  if (existingUsers > 0) {
    console.log('Database already contains data. Skipping seed.');
    await AppDataSource.destroy();
    return;
  }

  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('user123', 10);

  const admin = userRepository.create({
    email: 'admin@example.com',
    password: adminPassword,
    name: 'Admin',
    role: UserRole.ADMIN,
    phone: '+79001112233',
    address: 'Москва, Кремль',
  });

  const customer = userRepository.create({
    email: 'user@example.com',
    password: userPassword,
    name: 'Иван Петров',
    role: UserRole.CUSTOMER,
    phone: '+79004445566',
    address: 'Санкт-Петербург, Невский пр., 1',
  });

  const savedUsers = await userRepository.save([admin, customer]);
  console.log(`Users created: ${savedUsers.length}`);

  // 2. Создаём категории
  const laptops = categoryRepository.create({
    name: 'Ноутбуки',
    description: 'Портативные компьютеры',
  });

  const smartphones = categoryRepository.create({
    name: 'Смартфоны',
    description: 'Мобильные телефоны',
  });

  const accessories = categoryRepository.create({
    name: 'Аксессуары',
    description: 'Чехлы, наушники, зарядки',
  });

  const savedCategories = await categoryRepository.save([
    laptops,
    smartphones,
    accessories,
  ]);
  console.log(`Categories created: ${savedCategories.length}`);

  // Получаем сохранённые категории с ID
  const [catLaptops, catSmartphones, catAccessories] = savedCategories;

  // 3. Создаём товары
  const products = productRepository.create([
    {
      name: 'Ноутбук Acer Aspire 5',
      description: 'Ноутбук с процессором Intel Core i5, 8 ГБ ОЗУ, SSD 512 ГБ',
      price: 54990,
      stock: 15,
      categoryId: catLaptops.id,
      imageUrls: ['https://via.placeholder.com/300'],
      sku: 'ACER-ASP5-001',
      isActive: true,
    },
    {
      name: 'MacBook Air 13"',
      description: 'Apple M1, 8 ГБ ОЗУ, SSD 256 ГБ',
      price: 89990,
      stock: 8,
      categoryId: catLaptops.id,
      imageUrls: ['https://via.placeholder.com/300'],
      sku: 'APPLE-MBA-001',
      isActive: true,
    },
    {
      name: 'Смартфон Samsung Galaxy S23',
      description: 'Флагманский смартфон с отличной камерой',
      price: 74990,
      stock: 22,
      categoryId: catSmartphones.id,
      imageUrls: ['https://via.placeholder.com/300'],
      sku: 'SAMS-S23-001',
      isActive: true,
    },
    {
      name: 'iPhone 15 Pro',
      description: 'Apple A17 Pro, 256 ГБ',
      price: 124990,
      stock: 5,
      categoryId: catSmartphones.id,
      imageUrls: ['https://via.placeholder.com/300'],
      sku: 'APPLE-IP15P-001',
      isActive: true,
    },
    {
      name: 'Наушники Sony WH-1000XM5',
      description: 'Беспроводные наушники с шумоподавлением',
      price: 32990,
      stock: 30,
      categoryId: catAccessories.id,
      imageUrls: ['https://via.placeholder.com/300'],
      sku: 'SONY-WHXM5-001',
      isActive: true,
    },
    {
      name: 'Чехол для iPhone 15 Pro',
      description: 'Силиконовый чехол MagSafe',
      price: 3990,
      stock: 100,
      categoryId: catAccessories.id,
      imageUrls: ['https://via.placeholder.com/300'],
      sku: 'CASE-IP15-001',
      isActive: true,
    },
    {
      name: 'Ноутбук Lenovo ThinkPad X1',
      description: 'Бизнес-ноутбук с Intel Core i7',
      price: 119990,
      stock: 0,
      categoryId: catLaptops.id,
      imageUrls: ['https://via.placeholder.com/300'],
      sku: 'LENOVO-TPX1-001',
      isActive: true,
    },
  ]);

  const savedProducts = await productRepository.save(products);
  console.log(`Products created: ${savedProducts.length}`);

  console.log('Seeding completed successfully!');
  await AppDataSource.destroy();
}

seed().catch((error) => {
  console.error('Error during seeding:', error);
  process.exit(1);
});

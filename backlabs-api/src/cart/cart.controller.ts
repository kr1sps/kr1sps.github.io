import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  Patch,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AddItemDto } from './dto/add-item.dto';

interface RequestWithUser {
  user: {
    id: string;
    email: string;
    role: string;
  };
}

@ApiTags('cart')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Получить корзину пользователя' })
  getCart(@Req() req: RequestWithUser) {
    return this.cartService.getCart(req.user.id);
  }

  @Post('items')
  @ApiOperation({ summary: 'Добавить товар в корзину' })
  addItem(@Req() req: RequestWithUser, @Body() body: AddItemDto) {
    console.log('🔥 [БЭКЕНД] ПОЛУЧЕН ЗАПРОС ДОБАВЛЕНИЯ В КОРЗИНУ!', body);
    return this.cartService.addItem(req.user.id, body.productId, body.quantity);
  }

  @Patch('items/:productId')
  @ApiOperation({ summary: 'Обновить точное количество товара' })
  updateItemQuantity(
    @Req() req: RequestWithUser,
    @Param('productId') productId: string,
    @Body() body: { quantity: number },
  ) {
    return this.cartService.updateItemQuantity(
      req.user.id,
      productId,
      body.quantity,
    );
  }

  @Delete('items/:productId')
  @ApiOperation({ summary: 'Удалить товар из корзины' })
  removeItem(
    @Req() req: RequestWithUser,
    @Param('productId') productId: string,
  ) {
    return this.cartService.removeItem(req.user.id, productId);
  }

  @Delete()
  @ApiOperation({ summary: 'Очистить корзину' })
  clearCart(@Req() req: RequestWithUser) {
    return this.cartService.clearCart(req.user.id);
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderStatus } from './entities/order.entity';
import { UserRole } from '../users/entities/user.entity';
import { Sse } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { EventsService, OrderEvent } from '../events/events.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

interface RequestWithUser {
  user?: {
    id: string;
    role: UserRole;
  };
}

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly eventsService: EventsService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  create(@Body() createOrderDto: CreateOrderDto, @Req() req: RequestWithUser) {
    const userId = req.user!.id;
    return this.ordersService.create(userId, createOrderDto);
  }

  @Sse('events')
  getOrderEvents(): Observable<{ data: string; type?: string; id?: string }> {
    return this.eventsService.getOrderEvents().pipe(
      map((event: OrderEvent) => ({
        data: JSON.stringify(event),
        type: event.type,
        id: event.order.id,
      })),
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findAll(@Query('status') status?: OrderStatus, @Req() req?: RequestWithUser) {
    const userId = req?.user?.id;
    const role = req?.user?.role || UserRole.CUSTOMER;
    return this.ordersService.findAll(userId, role, status);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findOne(@Param('id') id: string, @Req() req?: RequestWithUser) {
    const userId = req?.user?.id;
    const role = req?.user?.role || UserRole.CUSTOMER;
    return this.ordersService.findOne(id, userId, role);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  updateStatus(
    @Param('id') id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
    @Req() req?: RequestWithUser,
  ) {
    const role = req?.user?.role || UserRole.CUSTOMER;
    return this.ordersService.updateStatus(id, updateOrderStatusDto, role);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  cancel(@Param('id') id: string, @Req() req?: RequestWithUser) {
    const userId = req?.user?.id as string;
    const role = req?.user?.role || UserRole.CUSTOMER;
    return this.ordersService.cancel(id, userId, role);
  }
}

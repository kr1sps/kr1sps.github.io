import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';
import { Order } from '../orders/entities/order.entity';

export interface OrderEvent {
  type: 'created' | 'updated' | 'cancelled';
  order: Order;
}

@Injectable()
export class EventsService {
  private orderSubject = new Subject<OrderEvent>();

  emitOrderEvent(event: OrderEvent) {
    this.orderSubject.next(event);
  }

  getOrderEvents() {
    return this.orderSubject.asObservable();
  }
}

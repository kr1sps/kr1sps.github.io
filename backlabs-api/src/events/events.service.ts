import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';

export interface OrderEvent {
  type: 'created' | 'updated' | 'cancelled';
  order: any;
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

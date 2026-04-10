import { useEffect, useRef } from 'react';
import { message } from 'antd';
import { useAuthStore } from '../store/authStore';

export const useOrderEvents = () => {
  const { user } = useAuthStore();
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      return;
    }

    const eventSource = new EventSource('/api/orders/events');

    eventSource.onopen = () => {
      console.log('SSE connection opened');
    };

    eventSource.addEventListener('created', (event) => {
      try {
        const data = JSON.parse(event.data);
        message.success({
          content: `Новый заказ #${data.order.id} на сумму ${data.order.total} ₽`,
          duration: 5,
        });
      } catch (error) {
        console.error('Failed to parse SSE event:', error);
      }
    });

    eventSource.addEventListener('updated', (event) => {
      try {
        const data = JSON.parse(event.data);
        message.info({
          content: `Статус заказа #${data.order.id} изменён на "${data.order.status}"`,
          duration: 5,
        });
      } catch (error) {
        console.error('Failed to parse SSE event:', error);
      }
    });

    eventSource.addEventListener('cancelled', (event) => {
      try {
        const data = JSON.parse(event.data);
        message.warning({
          content: `Заказ #${data.order.id} отменён`,
          duration: 5,
        });
      } catch (error) {
        console.error('Failed to parse SSE event:', error);
      }
    });

    eventSource.onerror = (error) => {
      console.error('SSE connection error:', error);
    };

    eventSourceRef.current = eventSource;

    return () => {
      eventSource.close();
      console.log('SSE connection closed');
    };
  }, [user]);
};
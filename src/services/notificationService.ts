/**
 * Notification Service Layer (WhatsApp Business API & SMS Provider Adapter)
 * 
 * Demonstrates automated customer communication triggers for Phase-1.
 * Ready to connect with MSG91, Twilio, or Meta Cloud API for WhatsApp Business.
 */

import { Order, OrderStatus } from '../types';

export interface NotificationEvent {
  id: string;
  type: 'whatsapp' | 'sms';
  recipient: string;
  title: string;
  message: string;
  timestamp: string;
  orderId: string;
}

type NotificationListener = (event: NotificationEvent) => void;
const listeners: Set<NotificationListener> = new Set();

export const NotificationService = {
  subscribe(callback: NotificationListener): () => void {
    listeners.add(callback);
    return () => listeners.delete(callback);
  },

  emitNotification(event: NotificationEvent): void {
    listeners.forEach((cb) => {
      try {
        cb(event);
      } catch (err) {
        console.error('Notification listener error:', err);
      }
    });
  },

  generateWhatsAppOrderUrl(whatsappNumber: string, orderId?: string, query?: string): string {
    const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
    let text = 'Hi Darbar Cafe & Restaurant, I would like to explore your menu & place an order.';
    if (orderId) {
      text = `Hi Darbar Cafe & Restaurant, I would like to know the update on my order #${orderId}.`;
    } else if (query) {
      text = `Hi Darbar Cafe & Restaurant, ${query}`;
    }
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
  },

  sendOrderPlacedNotifications(order: Order, whatsappNumber: string): void {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Simulate WhatsApp Automated Confirmation
    const waEvent: NotificationEvent = {
      id: `wa-${Date.now()}`,
      type: 'whatsapp',
      recipient: order.phone,
      title: 'WhatsApp Confirmation Sent',
      message: `Namaste ${order.customerName}! 🍽️ Your order #${order.orderId} (₹${order.total}) has been received by Darbar Cafe & Restaurant. Estimated delivery: 35–45 mins. Track here: darbarrestaurant.com/order/${order.orderId}`,
      timestamp: time,
      orderId: order.orderId,
    };
    this.emitNotification(waEvent);

    // Simulate SMS Trigger
    const smsEvent: NotificationEvent = {
      id: `sms-${Date.now() + 1}`,
      type: 'sms',
      recipient: order.phone,
      title: 'SMS Sent via MSG91 Gateway',
      message: `Darbar Restaurant: Your order #${order.orderId} is confirmed. Amt: ₹${order.total}. Est. delivery 35-45 mins. Call ${whatsappNumber} for support.`,
      timestamp: time,
      orderId: order.orderId,
    };
    setTimeout(() => this.emitNotification(smsEvent), 600);
  },

  sendStatusUpdateNotification(order: Order, status: OrderStatus): void {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let text = `Darbar Restaurant: Order #${order.orderId} status changed to ${status}.`;

    if (status === 'Preparing') {
      text = `👨‍🍳 Darbar Restaurant: Our Master Chef is now preparing your delicious food fresh with authentic spices!`;
    } else if (status === 'Ready') {
      text = `✨ Darbar Restaurant: Order #${order.orderId} is packed hot & ready!`;
    } else if (status === 'Out for Delivery') {
      text = `🛵 Darbar Restaurant: Order #${order.orderId} is out for delivery! Our rider is heading your way. Keep phone reachable.`;
    } else if (status === 'Delivered') {
      text = `🎉 Darbar Restaurant: Order #${order.orderId} has been delivered! Enjoy your meal! Please rate your experience.`;
    }

    const event: NotificationEvent = {
      id: `update-${Date.now()}`,
      type: 'whatsapp',
      recipient: order.phone,
      title: `WhatsApp: ${status} Update`,
      message: text,
      timestamp: time,
      orderId: order.orderId,
    };
    this.emitNotification(event);
  },
};

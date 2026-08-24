import { apiFetch } from './api';

interface CartItem {
  product_name: string;
  quantity: number;
  unit_price: number;
}

interface CheckoutPayload {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  items: CartItem[];
}

export async function handleCheckout(payload: CheckoutPayload) {
  try {
    const data = await apiFetch('/orders/checkout/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (data.checkout_url) {
      // Redirect customer to Bachs Pay Hosted Page
      window.location.href = data.checkout_url;
    }
  } catch (error: any) {
    console.error('Checkout error:', error.message);
    alert(error.message || 'Failed to initialize payment');
  }
}
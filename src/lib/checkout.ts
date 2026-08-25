import { fetchApi } from './api';

export async function initiateCheckout(orderPayload: any) {
  const res = await fetchApi('/api/checkout/', {
    method: 'POST',
    body: JSON.stringify(orderPayload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || data.message || 'Checkout failed');
  }

  if (data.checkout_url) {
    return data.checkout_url;
  }

  throw new Error('Checkout URL not provided by the server');
}
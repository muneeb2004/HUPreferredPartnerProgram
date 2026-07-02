'use server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export async function subscribeAction(prevState: unknown, formData: FormData): Promise<{ error: string; success?: never; } | { success: string; error?: never; }> {
  const email = formData.get('email') as string;

  if (!email || !email.includes('@')) {
    return { error: 'Invalid email address' };
  }

  try {
    const res = await fetch(`${API_URL}/subscriptions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) {
      const data = (await res.json()) as { message?: string };
      return { error: data.message || 'Subscription failed' };
    }

    return { success: 'Verification email sent. Please check your inbox.' };
  } catch (err) {
    return { error: 'Service unavailable' };
  }
}

export async function verifyAction(token: string): Promise<{ error: string; success?: never; } | { success: string; error?: never; }> {
  try {
    const res = await fetch(`${API_URL}/subscriptions/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });

    if (!res.ok) {
      return { error: 'Invalid or expired token' };
    }

    return { success: 'Subscription verified successfully!' };
  } catch (err) {
    return { error: 'Service unavailable' };
  }
}

export async function unsubscribeAction(prevState: unknown, formData: FormData): Promise<{ error: string; success?: never; } | { success: string; error?: never; }> {
  const email = formData.get('email') as string;

  try {
    const res = await fetch(`${API_URL}/subscriptions/unsubscribe/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) {
      return { error: 'Failed to request unsubscribe' };
    }

    return { success: 'If subscribed, you will receive an unsubscribe email shortly.' };
  } catch (err) {
    return { error: 'Service unavailable' };
  }
}

export async function confirmUnsubscribeAction(token: string): Promise<{ error: string; success?: never; } | { success: string; error?: never; }> {
  try {
    const res = await fetch(`${API_URL}/subscriptions/unsubscribe/confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });

    if (!res.ok) {
      return { error: 'Invalid or expired token' };
    }

    return { success: 'You have been unsubscribed.' };
  } catch (err) {
    return { error: 'Service unavailable' };
  }
}

import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // Keep apiVersion compatible with installed Stripe types
  apiVersion: '2023-10-16',
});

export async function createCheckoutSession(
  eventId: string,
  eventTitle: string,
  price: number,
  userId: string,
  successUrl: string,
  cancelUrl: string
) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Registration: ${eventTitle}`,
            description: `Event registration for ${eventTitle}`,
          },
          unit_amount: Math.round(price * 100), // Convert to cents
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      eventId,
      userId,
    },
  });

  return session;
}

export async function verifyPayment(sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  return session.payment_status === 'paid';
}
import Stripe from 'stripe'

const secret = process.env.STRIPE_SECRET_KEY

export const stripe = secret
  ? new Stripe(secret, {
      apiVersion: '2024-09-30.acacia',
      typescript: true,
    })
  : // Fallback stub to avoid build-time crashes when env is missing
    ({ webhooks: { constructEvent: () => ({}) } } as unknown as Stripe)
import {
  lemonSqueezySetup,
  getSubscription,
  cancelSubscription,
  updateSubscription,
  listProducts,
  listVariants,
  getCheckoutURL,
  createCheckout,
} from '@lemonsqueezy/lemonsqueezy.js'

export function configureLemonSqueezy() {
  lemonSqueezySetup({
    apiKey: process.env.LEMON_SQUEEZY_API_KEY!,
    onError: (error) => console.error('Lemon Squeezy Error:', error),
  })
}

export async function getProducts() {
  configureLemonSqueezy()
  const { data, error } = await listProducts({
    filter: { storeId: process.env.LEMON_SQUEEZY_STORE_ID },
  })
  if (error) throw error
  return data
}

export async function getVariants(productId: string) {
  configureLemonSqueezy()
  const { data, error } = await listVariants({
    filter: { productId },
  })
  if (error) throw error
  return data
}

export async function createCheckoutSession({
  variantId,
  userId,
  userEmail,
  userName,
}: {
  variantId: string
  userId: string
  userEmail: string
  userName?: string
}) {
  configureLemonSqueezy()

  const { data, error } = await createCheckout(
    process.env.LEMON_SQUEEZY_STORE_ID!,
    variantId,
    {
      checkoutData: {
        email: userEmail,
        name: userName,
        custom: {
          user_id: userId,
        },
      },
      productOptions: {
        redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?success=true`,
      },
    }
  )

  if (error) throw error
  return data
}

export async function getSubscriptionDetails(subscriptionId: string) {
  configureLemonSqueezy()
  const { data, error } = await getSubscription(subscriptionId)
  if (error) throw error
  return data
}

export async function cancelUserSubscription(subscriptionId: string) {
  configureLemonSqueezy()
  const { data, error } = await cancelSubscription(subscriptionId)
  if (error) throw error
  return data
}

export async function resumeUserSubscription(subscriptionId: string) {
  configureLemonSqueezy()
  const { data, error } = await updateSubscription(subscriptionId, {
    cancelled: false,
  })
  if (error) throw error
  return data
}

export { getCheckoutURL }

# Lemon Squeezy Setup Guide for TestimonialStack

## Step 1: Create Lemon Squeezy Account

1. Go to https://lemonsqueezy.com
2. Sign up for an account (free to start)
3. Verify your email

## Step 2: Create Your Store

1. In the LS dashboard, click "Stores" → "Create Store"
2. Store name: "TestimonialStack" (or your preferred name)
3. Store URL: `testimonialstack` (becomes testimonialstack.lemonsqueezy.com)
4. Click "Create Store"
5. **Copy your Store ID** from the URL or store settings

## Step 3: Create Products & Variants

### Create Starter Plan

1. Click "Products" → "New Product"
2. Product name: "TestimonialStack Starter"
3. Description: "Perfect for growing products"
4. Click "Create Product"

**Add Starter Variant:**
1. In the product page, go to "Variants" tab
2. Click "Add Variant"
3. Name: "Monthly Subscription"
4. Price: $19.00
5. Billing type: "Subscription"
6. Interval: "Monthly"
7. Click "Save"
8. **Copy the Variant ID** (you'll see it in the URL or variant settings)

### Create Pro Plan

1. Click "Products" → "New Product"
2. Product name: "TestimonialStack Pro"
3. Description: "For serious makers with unlimited everything"
4. Click "Create Product"

**Add Pro Variant:**
1. In the product page, go to "Variants" tab
2. Click "Add Variant"
3. Name: "Monthly Subscription"
4. Price: $39.00
5. Billing type: "Subscription"
6. Interval: "Monthly"
7. Click "Save"
8. **Copy the Variant ID**

## Step 4: Get Your API Key

1. Click your profile (top right) → "Settings"
2. Go to "API" section
3. Click "Create API Key"
4. Name it: "TestimonialStack Production"
5. **Copy the API Key** (you won't see it again!)

## Step 5: Set Up Webhook

1. In Settings, go to "Webhooks"
2. Click "Add Webhook"
3. Webhook URL: `http://localhost:3000/api/webhooks/lemonsqueezy` (for testing)
   - For production: `https://yourdomain.com/api/webhooks/lemonsqueezy`
4. Select events to listen for:
   - ✅ `subscription_created`
   - ✅ `subscription_updated`
   - ✅ `subscription_cancelled`
   - ✅ `subscription_expired`
   - ✅ `subscription_payment_failed`
5. Click "Create Webhook"
6. **Copy the Signing Secret** (shows after creation)

## Step 6: Configure Environment Variables

Add these values to your `.env.local` file:

```bash
# Lemon Squeezy - Get these from your LS dashboard
LEMON_SQUEEZY_API_KEY=your_api_key_here
LEMON_SQUEEZY_STORE_ID=your_store_id_here
LEMON_SQUEEZY_WEBHOOK_SECRET=your_webhook_signing_secret_here

# Product Variant IDs (from Lemon Squeezy)
LEMON_SQUEEZY_STARTER_VARIANT_ID=your_starter_variant_id
LEMON_SQUEEZY_PRO_VARIANT_ID=your_pro_variant_id
```

## Step 7: Test the Integration

1. Restart your dev server: `npm run dev`
2. Visit http://localhost:3000/dashboard/billing
3. Click "Upgrade to Starter"
4. You'll be redirected to Lemon Squeezy checkout
5. Use test card: **4242 4242 4242 4242**
6. Complete the checkout
7. Webhook should fire and update your database
8. You'll be redirected back with success message

## Step 8: Enable Test Mode (Optional)

For testing without real charges:

1. In LS dashboard, go to Settings → General
2. Enable "Test Mode"
3. All transactions will be test transactions
4. Use test card numbers from LS docs

## Troubleshooting

### Webhook not firing?

1. Check webhook logs in LS dashboard (Settings → Webhooks → View your webhook)
2. Make sure your local server is accessible (use ngrok for local testing)
3. Verify the signing secret matches

### Checkout not creating?

1. Check browser console for errors
2. Verify API key is valid
3. Check that variant IDs are correct

### Database not updating?

1. Check webhook signature verification is working
2. Look at server logs for webhook errors
3. Verify Supabase admin key has permissions

## Using ngrok for Local Development

Since webhooks need a public URL:

```bash
# Install ngrok
brew install ngrok  # or download from ngrok.com

# Start your dev server
npm run dev

# In another terminal, create a tunnel
ngrok http 3000

# Copy the HTTPS URL (e.g., https://abc123.ngrok.io)
# Update your webhook URL in LS to: https://abc123.ngrok.io/api/webhooks/lemonsqueezy
```

## Production Checklist

Before going live:

- [ ] Disable test mode in Lemon Squeezy
- [ ] Update webhook URL to production domain
- [ ] Add environment variables to production hosting (Vercel/Netlify)
- [ ] Test full checkout flow in production
- [ ] Set up email notifications in LS
- [ ] Configure checkout appearance/branding
- [ ] Add terms of service and privacy policy links

## Next Steps

Once configured:

1. Test all three upgrade flows (Free → Starter, Free → Pro, Starter → Pro)
2. Test subscription cancellation
3. Test payment failure handling
4. Monitor webhook logs for any issues

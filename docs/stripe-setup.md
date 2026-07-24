# Stripe Setup Guide

Follow these steps to wire up billing for ResumeForge.

## 1. Create a Stripe account
https://dashboard.stripe.com/register — use **Test mode** while developing.

## 2. Create the Pro product + price
1. Dashboard → **Product catalog** → **Add product**
2. Name: `ResumeForge Pro`
3. Pricing model: **Recurring**, **Monthly**, **$9.00 USD**
4. Save — copy the generated **Price ID** (`price_xxxxxxxxxxxx`)
5. Paste it into `.env.local` as `STRIPE_PRO_PRICE_ID`

## 3. Get your API keys
Dashboard → **Developers** → **API keys**
- Copy **Secret key** → `STRIPE_SECRET_KEY`
- Copy **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

## 4. Set up the webhook (local development)
Install the Stripe CLI: https://stripe.com/docs/stripe-cli

```bash
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

The CLI prints a webhook signing secret (`whsec_...`) — paste it into
`.env.local` as `STRIPE_WEBHOOK_SECRET`.

## 5. Set up the webhook (production)
Dashboard → **Developers** → **Webhooks** → **Add endpoint**
- Endpoint URL: `https://yourdomain.com/api/stripe/webhook`
- Events to send:
  - `checkout.session.completed`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_failed`
- Copy the **Signing secret** into your production env as `STRIPE_WEBHOOK_SECRET`

## 6. Enable the Customer Portal
Dashboard → **Settings** → **Billing** → **Customer portal**
- Enable "Customers can cancel subscriptions"
- Enable "Customers can update payment methods"
- Save

## 7. Test the flow
1. `npm run dev`
2. In another terminal: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
3. Sign in → go to `/billing` → click **Upgrade to Pro**
4. Use Stripe's test card: `4242 4242 4242 4242`, any future expiry, any CVC
5. Confirm the webhook fires (`checkout.session.completed`) and your DB user's
   `plan` field flips to `PRO`

## Test cards reference
| Card | Behavior |
|---|---|
| `4242 4242 4242 4242` | Always succeeds |
| `4000 0000 0000 9995` | Always declined (insufficient funds) |
| `4000 0025 0000 3155` | Requires 3D Secure authentication |

## Going live
1. Toggle Stripe dashboard to **Live mode**
2. Repeat steps 2–6 with live keys (they're separate from test keys)
3. Update production env vars
4. Re-test the full checkout flow with a real card (refund yourself after)

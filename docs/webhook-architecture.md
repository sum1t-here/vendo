# Webhook Architecture - Vendo

*The webhook we are referring here is the stripe webhook*

Version: v1
Status: Active
Last Updated: 28/02/2026
Related Commit: [14ab5a3](https://github.com/sum1t-here/vendo/commit/14ab5a39ac7623def01b55fd662123d68778e9c0)

## Overview
The Stripe webhook is the authoritative source of truth for payment confirmation.

Critical business state changes (order confirmation, stock deduction) occur only after Stripe confirms payment via webhook.

We do not:
- Mark orders as paid on frontend success page
- Deduct stock during checkout session creation
- Trust client-side cart data

## High Level Flow

```
Cart (Zustand - Client)
        ↓
POST /api/checkout
        ↓
Backend:
  - Validates stock
  - Validates price
  - Creates Stripe Checkout Session
  - Attaches metadata (userId + cart snapshot)
        ↓
User completes payment on Stripe
        ↓
Stripe → Webhook (/api/webhook)
        ↓
Webhook:
  - Verifies signature
  - Reads metadata
  - Creates Order in Payload
  - Deducts stock
```
## Checkout section metadata

```
metadata: {
  userId: user.user?.id?.toString() ?? '',
  items: JSON.stringify(
    validatedItems.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      variantId: item.variantId,
      variantValue: item.variantValue,
    }))
  ),
}
```
- Stores immutable cart snapshot at checkout time
- Allows webhook to reconstruct purchase without relying on frontend state
- Avoids dependency on live cart state

**IMPORTANT NOTE**
This implementation currently stores full cart data inside Stripe metadata.

## Responsibilities

Triggered on:

```
checkout.session.completed
```
Webhook performs:

- Stripe signature verification
- Metadata extraction (userId, items)
- JSON parsing of cart snapshot
- Order creation in Payload
- Stock deduction
- Console logging for visibility

## Idempotency Strategy

```ts
const { docs: existingUser } = await payload.find({
  collection: 'orders',
  where: {
    stripeSessionId: { equals: session.id },
  },
});

if (existingUser.length > 0) {
  return;
}
```
- Checking for existing order by stripeSessionId
- Preventing duplicate order creation

## Stock deduction strategy

```ts
const items = JSON.parse(session.metadata.items);
const userId = session.metadata.userId;

// deduct stock
for (const item of items) {
  const { docs } = await payload.find({
    collection: 'products',
    where: {
      id: { equals: item.id },
    },
    depth: 0,
    limit: 1,
  });

  const product = docs[0];

  if (!product) {
    console.error('Product not found for id:', item.id);
    continue;
  }

  if (item.variantId) {
    const updatedVariants = product?.variants?.map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (v: any) => (v.id === item.variantId ? { ...v, stock: Math.max(0, v.stock - item.quantity) } : v)
    );

    await payload.update({
      collection: 'products',
      id: product.id,
      data: {
        variants: updatedVariants,
      },
    });
  } else {
    await payload.update({
      collection: 'products',
      id: product.id,
      data: {
        // item.quantity : 0 as quantity:any
        stock: Math.max(0, product?.stock ? -item.quantity : 0),
      },
    });
  }
}
```
- Stock is deducted only after payment is confirmed by Stripe
- This prevents over-selling and ensures stock accuracy
**NOTE**
There is no database transaction wrapping order creation + stock deduction.

## Security Measures

Current implementation relies on:
- Stripe signature verification
- Idempotency check
- Stock validation at checkout
- No trust placed in frontend totals
- Order creation restricted from frontend

## Future Improvements

- Database transaction for order creation + stock deduction
- More robust error handling
- Monitoring and alerting for webhook failures
- Retry mechanism for failed webhooks

## Planned Observability
Logging and monitoring will be implemented using:
- Prometheus for metrics collection
- Grafana for visualization and alerting

Planned metrics include:
- Checkout session creation count
- Webhook success/failure count
- Order creation rate
- Stock deduction failures
- Webhook processing latency

This upgrade will be tracked with a dedicated commit.

## Known Limitations

- No database transaction wrapping order creation + stock deduction
- No retry mechanism for failed webhooks
- No monitoring and alerting for webhook failures
- Metadata size limit (20KB) - not suitable for large carts
- No distributed lock for stock deduction (race condition possible)
- No rate limiting on webhook endpoint (DDoS possible)
- No queue for webhook processing (webhook failures are not retried)

## Design Principles Followed

- Backend is the source of truth
- Webhook is the source of truth for payment confirmation
- Frontend is only for display
- Idempotency is handled at webhook level
- Payment confirmation required before state mutation
- Cart snapshot stored at the time of checkout

## Metadata Refactor (Planned)

Status: Not implemented
Description:

- Replace full cart snapshot with orderId only
- Move cart persistence fully to database
- Reduce Stripe metadata size

Commit Reference: <TO_BE_ADDED>

## Observability Upgrade (Planned)

Status: Not implemented
Description:

- Replace console logging with structured logging
- Add Prometheus metrics
- Add Grafana dashboards
- Add webhook failure alerts

Commit Reference: <TO_BE_ADDED>
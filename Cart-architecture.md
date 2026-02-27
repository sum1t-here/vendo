# Cart Architecture — Vendo

## Overview

The cart in Vendo is built with Zustand + `persist` middleware. It lives in localStorage so it survives page refreshes, and syncs to the server so it survives logout/login cycles.

---

## Stack

| Layer | Tool | Reason |
|---|---|---|
| Client state | Zustand | Minimal boilerplate, no re-render issues |
| Persistence | Zustand `persist` | Auto localStorage sync, zero setup |
| Server sync | Payload CMS REST API | Cart collection in PostgreSQL |
| Type safety | TypeScript | Catch type mismatches at compile time |

---

## Data Flow

```
User adds item
      ↓
Zustand store (in memory)
      ↓
persist middleware → localStorage (survives refresh)
      ↓
syncToServer() → POST /api/cart-sync (survives logout)
      ↓
User logs out → clearCart() → localStorage cleared
      ↓
User logs in → GET /api/cart-sync → restore to Zustand
```

---

## CartItem Shape

```ts
interface CartItem {
  id: number           // Payload product ID
  name: string         // snapshot at time of add
  price: number        // snapshot — re-validated at checkout
  image: string        // Cloudinary URL
  slug: string         // for linking back to product
  quantity: number
  stock: number        // product level stock
  variantId?: string   // Payload variant ID (string, not number)
  variantValue?: string // e.g. "M", "Red"
  variantStock?: number // variant level stock
}
```

> **Why snapshot?** Product name and price can change. We store the value at the time of adding so the cart always shows what the user saw. Price is re-validated against the DB at checkout anyway.

---

## Store Actions

| Action | Syncs to server | Debounced |
|---|---|---|
| `addToCart` | Yes — immediately | No |
| `removeFromCart` | Yes — immediately | No |
| `updateCartItemQuantity` | Yes | Yes — 1s |
| `clearCart` | No | — |

---

## Why Per-Action Sync Instead of `subscribe`

### The `subscribe` approach

```ts
useCartStore.subscribe((state) => {
  setTimeout(() => syncToServer(state.items), 1000)
})
```

Simple one-liner. Automatically fires on every state change.

### Problems with `subscribe`

**Problem 1 — It fires on `clearCart` too**

When the user logs out, `clearCart()` sets `items: []`. The subscriber fires and saves an empty cart to the server. Now when they log back in, their cart is gone.

```
User logs out
      ↓
clearCart() → items: []
      ↓
subscribe fires → saves [] to server ← WIPES SAVED CART
      ↓
User logs in → restores [] ← cart is gone
```

You can work around this with a flag:

```ts
let isClearingCart = false

clearCart: () => {
  isClearingCart = true
  set({ items: [] })
  setTimeout(() => isClearingCart = false, 100)
}

useCartStore.subscribe((state) => {
  if (isClearingCart) return
  // ...sync
})
```

But now you have a mutable flag outside the store, a `setTimeout` to reset it, and a race condition if `subscribe` fires within those 100ms. The workaround is messier than the original problem.

**Problem 2 — Everything is debounced equally**

With `subscribe` + debounce, every action waits 1 second before syncing — including `addToCart` and `removeFromCart` which should sync immediately.

```
User adds item → 1s delay → synced
User removes item → 1s delay → synced
User changes quantity → 1s delay → synced  ← fine
```

The delay on add/remove means if the user adds an item and immediately closes the browser, it's not saved.

**Problem 3 — No per-action control**

With `subscribe` you can't say "sync immediately for add, debounce for quantity update". It's all or nothing. You'd need to track what kind of change happened, which means more state outside the store.

### The per-action approach

```ts
addToCart: (item) => {
  const newItems = [...get().items, item]
  set({ items: newItems })
  syncToServer(newItems)  // immediate
},

updateCartItemQuantity: (id, quantity) => {
  const newItems = /* update */
  set({ items: newItems })
  debouncedSync(newItems) // debounced — user clicks +/- rapidly
},

clearCart: () => {
  set({ items: [] })
  // no sync — server keeps the last real cart
},
```

Each action decides its own sync strategy. No flags, no race conditions, no surprises.

### Comparison

| | `subscribe` | Per-action |
|---|---|---|
| Code simplicity | One liner | More verbose |
| `clearCart` problem | Needs workaround flag | Solved by omission |
| Add to cart delay | 1s | Immediate |
| Remove delay | 1s | Immediate |
| Quantity change | 1s | 1s (debounced) |
| Per-action control | Hard | Native |
| Race conditions | Possible | None |

---

## Stock Validation — Two Layers

### Layer 1 — Client (Zustand store)

Prevents adding more than available stock to the cart:

```ts
addToCart: (item) => {
  const existing = get().items.find(/* match */)
  if (existing) {
    const maxStock = item.variantStock ?? item.stock
    if (existing.quantity >= maxStock) {
      throw new Error(`Only ${maxStock} items available`)
    }
  }
}
```

This gives instant feedback without a server round-trip.

### Layer 2 — Server (checkout route)

Re-fetches every product from the database before creating the Stripe session:

```ts
// app/api/checkout/route.ts
for (const cartItem of items) {
  const product = await payload.find({ collection: 'products', where: { id: ... } })

  // validates: published? in stock? variant exists?
  // uses DB price — never trusts frontend price
}
```

Client validation is UX. Server validation is security. Both are necessary.

> **Rule**: Never trust the frontend for price or stock. The client check is a convenience. The server check is the source of truth.

---

## Cart Sync API

### `POST /api/cart` — Save cart

Called after every add/remove/quantity change. Updates the cart document for the logged-in user.

### `GET /api/cart` — Restore cart

Called after login. Returns the user's saved cart items.

Both endpoints read the `payload-token` cookie to identify the user. If the user is not logged in, `POST` returns 401 silently and `GET` returns `{ items: [] }`.

---

## Logout Flow

```
User clicks logout
      ↓
Last sync already saved to server (happened on last cart change)
      ↓
clearCart() → localStorage: []
      ↓
router.push('/') + router.refresh()
      ↓
Server session cookie cleared
```

No sync on logout — the server already has the latest state from the last cart change.

---

## Login Flow

```
User logs in successfully
      ↓
GET /api/cart-sync → { items: [...] }
      ↓
useCartStore.setState({ items })
      ↓
persist middleware → localStorage updated
      ↓
Cart restored to last saved state
```

---

## V2 Improvements (Not in scope yet)

- Guest cart — allow adding to cart without login
- Cart merge — merge guest cart with server cart on login
- Optimistic updates — show cart changes immediately, rollback on sync failure
- Cart expiry — clear server cart after N days of inactivity
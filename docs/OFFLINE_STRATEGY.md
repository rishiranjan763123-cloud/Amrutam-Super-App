# Offline Strategy

## Three Layers
1. **Read cache** — TanStack Query results are persisted to MMKV via `cachePersister.ts`, restored on app launch. Users can browse previously-seen doctors/products/records with zero network.
2. **Write queue** — Mutations attempted while offline (bookings, cart sync, checkout) are pushed to `mutationQueue.ts` (MMKV-backed) instead of failing.
3. **Sync on reconnect** — `NetworkProvider` listens via NetInfo; on regaining connectivity it triggers `syncManager.processSyncQueue()`, which replays queued mutations in order with retry-and-drop-after-3-attempts semantics.

## Trade-off
Queued mutations are optimistic — the UI shows them as "pending" immediately. If a queued booking later fails (e.g. slot taken by someone else while offline), the user finds out only at sync time via a toast, not instantly. This was accepted because blocking the UI until connectivity returns would be a worse experience for the offline-first goal.
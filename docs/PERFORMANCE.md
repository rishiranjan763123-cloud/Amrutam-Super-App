# Performance

## Virtualization
All lists (5k doctors, 20k products, 10k records) use a single shared `VirtualizedList` wrapper around Shopify's FlashList rather than FlatList — FlashList reuses views instead of re-mounting them, which is the difference between smooth and janky scroll at this scale.

## Memoization
- Every list-item component (`DoctorCard`, `ProductCard`, `RecordCard`) is wrapped in `React.memo` with custom comparators comparing only the fields that affect rendering.
- All `renderItem`/`onPress` callbacks passed into lists are wrapped in `useCallback` so memoized children don't re-render on unrelated parent state changes.
- Derived values (cart totals, grouped timeline sections) use `useMemo` keyed on their actual dependencies.

## Client-side filtering trade-off
Health Records timeline fetches the full dataset once (cached) and filters/groups client-side on every keystroke, rather than re-querying a paginated endpoint per filter change. For ~10k small JSON records this is faster and simpler than debounced server round-trips; for Shop's 20k products, filtering happens server-side via paginated `searchProducts` since product objects/images are heavier.
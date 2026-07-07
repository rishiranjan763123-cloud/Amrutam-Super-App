import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

/**
 * MSW handlers used across integration tests. Kept generic so any
 * module's tests can import `server` and override handlers per-test
 * with server.use(...) for failure/edge-case scenarios (timeouts,
 * malformed JSON, empty responses, 401 session expiry, etc).
 */
export const handlers = [
  http.get('*/doctors', () => {
    return HttpResponse.json({ items: [], hasMore: false, totalCount: 0 });
  }),

  http.get('*/products', () => {
    return HttpResponse.json({ items: [], hasMore: false, totalCount: 0 });
  }),

  http.post('*/consultations/book', () => {
    return HttpResponse.json({ id: 'booking_test', status: 'CONFIRMED' });
  }),

  // Example: simulate malformed JSON response for reliability testing
  http.get('*/malformed-test', () => {
    return new HttpResponse('{ not valid json', {
      headers: { 'Content-Type': 'application/json' },
    });
  }),

  // Example: simulate session expiry
  http.get('*/session-expired-test', () => {
    return new HttpResponse(null, { status: 401 });
  }),
];

export const server = setupServer(...handlers);
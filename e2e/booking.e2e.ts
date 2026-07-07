import { by, device, element, expect as detoxExpect } from 'detox';

describe('Consultation Booking Flow (E2E)', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('completes the full booking journey: search → view doctor → pick slot → confirm', async () => {
    // Land on Doctor List tab
    await detoxExpect(element(by.id('doctor-list-screen'))).toBeVisible();

    // Search for a doctor
    await element(by.id('doctor-search-input')).typeText('Sharma');
    await new Promise((resolve) => setTimeout(resolve, 500)); // debounce wait

    // Tap first result
    await element(by.id('doctor-card-0')).tap();

    // On doctor details, verify slots loaded
    await detoxExpect(element(by.id('doctor-details-screen'))).toBeVisible();
    await detoxExpect(element(by.id('slot-picker'))).toBeVisible();

    // Select the first available slot
    await element(by.id('slot-button-0')).tap();
    await element(by.id('proceed-to-book-button')).tap();

    // Confirmation sheet appears
    await detoxExpect(element(by.id('booking-confirmation-sheet'))).toBeVisible();
    await element(by.id('confirm-booking-button')).tap();

    // Should land on Upcoming Consultations with the new booking visible
    await detoxExpect(element(by.id('upcoming-consultations-screen'))).toBeVisible();
    await detoxExpect(element(by.id('booking-card-0'))).toBeVisible();
  });

  it('prevents double booking the same slot twice', async () => {
    await element(by.id('doctor-card-0')).tap();
    await element(by.id('slot-button-0')).tap();
    await element(by.id('proceed-to-book-button')).tap();
    await element(by.id('confirm-booking-button')).tap();

    // Attempt to book the exact same slot again
    await element(by.id('back-button')).tap();
    await element(by.id('slot-button-0')).tap();

    // Slot should now be shown as unavailable/booked, not selectable
    await detoxExpect(element(by.id('slot-button-0'))).not.toBeVisible();
  });
});
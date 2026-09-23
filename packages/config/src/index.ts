/**
 * Shared constants for Motoraconect.
 *
 * These are reference/display values only (e.g. for populating a picker
 * before the network round-trip resolves, or as fallbacks). The actual
 * list of countries/currencies/makes lives in the database from Phase 2+
 * (`countries`, `currencies`, `vehicle_makes` tables) so admin can edit
 * them without an app release — see §15/§35 of the architecture doc.
 */

export const APP_NAME = "Motoraconect";
export const APP_TAGLINE = "BUY. SELL. VERIFY. IMPORT. UNDERSTAND.";
export const INITIAL_CURRENCIES = ["PKR", "USD", "JPY", "AED", "EUR", "GBP"] as const;
export const PRIMARY_NAV_TABS = ["HOME", "VEHICLES", "SELL", "SERVICES", "PROFILE"] as const;
export const FEATURE_FLAGS = {
  AUCTION_SHEET_READER: false,
  IMPORT_CALCULATOR: false,
  ASK_MOTORACONECT_AI: false,
  MESSAGING: false,
  CONSULTATION: false,
  PAYMENTS: false,
  DEALER_PLATFORM: false,
  PARTS_MARKETPLACE: false,
} as const;
# Phase 5 — Import Calculator & Guides

## Status

**Implementation complete.** Comprehensive verification is intentionally deferred to the final verification/hardening phase.

## Delivered

- Transparent landed-cost calculator.
- Purchase-currency to PKR conversion using a user-entered FX rate.
- CIF calculation.
- User-entered duty and tax rates.
- Port, clearing, registration, and other fixed charges.
- Calculated landed-cost total in PKR.
- Persistent calculation history with owner-scoped RLS.
- Guide categories and published guide content.
- Mobile Services navigation to calculator and guides.

## Calculation model

The MVP calculates:

1. Purchase price × user FX rate = purchase price in PKR.
2. Purchase price in PKR + freight + insurance = CIF.
3. CIF × duty rate = duty.
4. CIF + duty = tax base.
5. Tax base × tax rate = taxes.
6. Port + clearing + registration + other charges = additional charges.
7. CIF + duty + taxes + additional charges = total landed-cost estimate.

The rates and charges are explicitly user-entered. The result is an estimate, not an official customs assessment.

## Deferred / later enhancements

- Official rule/provider integrations for destination-specific duties and taxes.
- Live exchange-rate provider.
- Vehicle-linked saved calculations from listing detail.
- Richer guide authoring/admin workflow.
- Comprehensive automated, runtime, security, and cross-platform verification.

## Exit criteria

Phase 5 implementation is complete when the calculator, persistence, guide storage, mobile presentation, and documentation are in place. Final verification remains in the final hardening phase.

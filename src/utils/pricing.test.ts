import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateSubtotal,
  calculateDiscount,
  calculateShipping,
  calculateTax,
  calculateOrderTotals,
  validatePCCompatibility,
  calculateSavings,
  calculateBundleDiscount,
  PCBuildState
} from './pricing';

test('calculateSubtotal sums up items accurately with quantities', () => {
  const items = [
    { price: 100, quantity: 2 }, // 200
    { price: 49.99, quantity: 1 }, // 49.99
    { price: 12.50, quantity: 4 } // 50
  ];
  assert.equal(calculateSubtotal(items), 299.99);
  assert.equal(calculateSubtotal([]), 0);
});

test('calculateDiscount applies percentage discount correctly', () => {
  const coupon = {
    code: 'NEXUS10',
    discountPercentage: 10,
    active: true
  };
  const result = calculateDiscount(200, coupon);
  assert.equal(result.isValid, true);
  assert.equal(result.discount, 20);
});

test('calculateDiscount enforces minimum order amount', () => {
  const coupon = {
    code: 'BIGSAVER',
    discountAmount: 50,
    minOrderAmount: 200,
    active: true
  };
  const resultFail = calculateDiscount(150, coupon);
  assert.equal(resultFail.isValid, false);
  assert.equal(resultFail.discount, 0);

  const resultPass = calculateDiscount(250, coupon);
  assert.equal(resultPass.isValid, true);
  assert.equal(resultPass.discount, 50);
});

test('calculateShipping provides free shipping above threshold ($150)', () => {
  assert.equal(calculateShipping(50), 15);
  assert.equal(calculateShipping(149.99), 15);
  assert.equal(calculateShipping(150), 0);
  assert.equal(calculateShipping(1200), 0);
});

test('calculateOrderTotals computes complete cart finances', () => {
  const items = [{ price: 100, quantity: 1 }];
  const coupon = { code: 'SAVE10', discountPercentage: 10, active: true };
  const totals = calculateOrderTotals(items, coupon, 0.16);

  assert.equal(totals.subtotal, 100);
  assert.equal(totals.discount, 10);
  // Discounted subtotal: 90. Shipping: 15 (< 150). Tax (16% of 90): 14.40.
  assert.equal(totals.shipping, 15);
  assert.equal(totals.tax, 14.40);
  assert.equal(totals.total, 119.40);
});

test('validatePCCompatibility catches socket mismatch', () => {
  const build: PCBuildState = {
    cpu: { id: 'c1', category: 'cpu', name: 'Ryzen 7 7800X3D', price: 449, socket: 'AM5', watts: 120 },
    motherboard: { id: 'm1', category: 'motherboard', name: 'Intel Z790 Hero', price: 500, socket: 'LGA1700' },
    gpu: { id: 'g1', category: 'gpu', name: 'RTX 4080 Super', price: 999, watts: 320 },
    psu: { id: 'p1', category: 'psu', name: 'Corsair 850W', price: 140, watts: 850 }
  };

  const validation = validatePCCompatibility(build);
  assert.equal(validation.isCompatible, false);
  assert.equal(validation.warnings.length, 1);
  assert.match(validation.warnings[0], /Incompatibilidad de Socket/);
});

test('validatePCCompatibility validates matching socket and checks wattage', () => {
  const build: PCBuildState = {
    cpu: { id: 'c1', category: 'cpu', name: 'Ryzen 7 7800X3D', price: 449, socket: 'AM5', watts: 120 },
    motherboard: { id: 'm1', category: 'motherboard', name: 'ROG Strix B650E-F', price: 280, socket: 'AM5' },
    gpu: { id: 'g1', category: 'gpu', name: 'RTX 4080 Super', price: 999, watts: 320 },
    psu: { id: 'p1', category: 'psu', name: 'ROG Thor 850W', price: 199, watts: 850 }
  };

  const validation = validatePCCompatibility(build);
  assert.equal(validation.isCompatible, true);
  assert.equal(validation.warnings.length, 0);
  assert.equal(validation.totalWatts, 75 + 120 + 320); // 515W
  assert.ok(validation.recommendedPsuWatts <= 850);
});

test('calculateSavings detects discount and returns amount and percent', () => {
  const result = calculateSavings(1149.99, 1249.99);
  assert.equal(result.hasDiscount, true);
  assert.equal(result.amountSaved, 100);
  assert.equal(result.percentSaved, 8);

  const noDiscount = calculateSavings(500, 500);
  assert.equal(noDiscount.hasDiscount, false);
  assert.equal(noDiscount.amountSaved, 0);
});

test('calculateBundleDiscount computes combo price and savings accurately', () => {
  const bundle = calculateBundleDiscount([249.99, 159.99], 25); // Keyboard ($249.99) + Mouse ($159.99) = 409.98
  assert.equal(bundle.originalTotal, 409.98);
  assert.equal(bundle.discountPercentage, 25);
  assert.equal(bundle.totalSavings, 102.50);
  assert.equal(bundle.bundlePrice, 307.48);
});


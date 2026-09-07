/**
 * Borrowing Power Calculator Test Suite
 */


const assert = require('assert'); 
const {BorrowingCalculator} = require('./borrowingCalculator');
const calculator = new BorrowingCalculator();

describe('Term Deposit Calculator Tests', () => {

  it('should calculate borrowing power for standard values', async () => {
    const result = await calculator.calculateBorrowingPower(120000, 2, 3000, 10000, 7.5);
    assert.ok(result.maxLoanAmount > 0, 'Should yield a positive borrowing power amount');
    assert.strictEqual(result.monthlyRepayment, 4600);
  });

  it('should return 0 for invalid negative inputs', async () => {
    const result = await calculator.calculateBorrowingPower(30000, 3, 4000, 5000, 7.5);
    assert.strictEqual(result.maxLoanAmount, 0);
    assert.strictEqual(result.monthlyRepayment, 0);
  });

  it('should return the correct tax for a given income', async () => {
    const tax = await calculator.getTax(120000);
    assert.strictEqual(tax, 24000);
  });

  it('should return the correct HEM for a given income and dependents', async () => {
    const hem = await calculator.getHEM(120000, 2);
    assert.strictEqual(hem, 3100);
  });

  it('should calculate borrowing power with zero dependents', async () => {
    const result = await calculator.calculateBorrowingPower(100000, 0, 2500, 5000, 7.5);
    assert.ok(result.maxLoanAmount > 0, 'Should yield a positive borrowing power amount');
    assert.strictEqual(result.monthlyRepayment, 4266.67);
  });
  });


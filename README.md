# Borrowing Power Calculator

A mortgage borrowing power calculator, originally started by Gen, completed as part of the Ferocia Junior Engineering Code Exercise.

Given a person's income, dependents, declared living expenses, and credit card limits, it estimates:
- The maximum amount they could borrow for a home loan over a 30-year term.
- The monthly mortgage repayment that amount would require

Tax and household living expense (HEM) figures are fetched live from a local development API rather than estimated in-code.

## Setup

Make sure you have [Node.js](https://nodejs.org/) installed. Then, from the project folder, install dependencies:

```
npm install
```

## Running the development API

The calculator depends on a local API for tax and HEM values. Start it in its own terminal window and leave it running:

```
npm run api
```

The API will be available at `http://localhost:3000/`. See `server.md` for full endpoint documentation, including the required authentication token.

## Running the calculator

In a second terminal (the API needs to stay running in the first), run:

```
npm start
```

This launches an interactive prompt in the terminal, asking for:
- Gross Annual Income
- Number of Dependents
- Declared Monthly Expenses
- Total Credit Card Limits

It will then print the maximum borrowing power and the assumed monthly repayment.

## Running the tests

With the API still running, run:

```
npm test
```

This runs the Mocha test suite in `test_calculator.js` against the `BorrowingCalculator` class. There are 5 tests:

1. `calculateBorrowingPower` with standard values (end-to-end, happy path)
2. `calculateBorrowingPower` with inputs that should yield $0 (the early-exit / can't-afford-a-loan path)
3. `getTax` tested directly, isolated from the rest of the calculation
4. `getHEM` tested directly, isolated from the rest of the calculation
5. `calculateBorrowingPower` with dependents set to 0, an edge case that also exercises the other side of the `Math.max(expenses, baselineHEM)` logic (declared expenses winning over HEM, rather than HEM winning as in test 1)

The brief asked for the test suite to have full coverage. After checking on Slack, the guidance was to use judgement on what "good coverage" means for this app. The above was chosen to cover the main path, the failure path, each API-backed piece in isolation so a break in tax vs. HEM logic is immediately obvious rather than hidden inside the combined calculation, and one boundary condition, without over-engineering a small exercise with things like mocked API responses.

## Design decisions and assumptions

- Language: JavaScript was chosen over TypeScript. The brief noted this choice wouldn't affect scoring either way, and JS kept the focus on understanding the core logic and API integration.

- Structure: The original standalone functions (`getTax`, `getHEM`, `calculateBorrowingPower`) have been grouped into a single `BorrowingCalculator` class, per Gen's original intent noted in the brief. Related logic is clear and makes it straightforward to extend later, for example adding a new API-backed method like a dynamic interest rate lookup or centralising shared setup such as the API base URL or auth header, which is currently repeated in each method without restructuring the whole file.

- Living expenses: (`Math.max(expenses, baselineHEM)`): The calculator uses whichever is higher, the user's own declared expenses or the official HEM benchmark for their income and dependents. This is an assumption as it protects against a borrower understating their real living costs so the bank doesn't approve a loan the person may not actually be able to manage.

- Credit card liability: (`creditLimits * 0.03`): The calculation uses the full available credit limit on any credit card, not the current outstanding balance. Even at a $0 balance, that credit is available to be drawn on at any time, so it's treated as a monthly liability. This is the same conservative lending-safety assumption as above.

- Test values: Updated to reflect real API data. The original test suite written against the placeholder `getTax`/`getHEM` functions expected a monthly repayment of 4200 for a specific set of inputs. Once real API values were used, the correct figure was independently recalculated by hand using the real tax and HEM values fetched via the API and confirmed to be 4600. The test was updated to reflect this correct, verified figure rather than the outdated placeholder number.

- Loan term and rates: Loan term is 360 months and the base interest rate plus assessment buffer are left as fixed constants at the top of the file, matching the original starter code. Not configurable inputs right now, but they'd be the next extension point given the new class structure.

## Known limitations and possible next steps

- No handling yet for the API being unreachable or returning an error such as invalid PAT or malformed inputs. Currently a failed `fetch` would surface as an unhandled rejection rather than a clear error message.
- No input validation on the console prompts such as non-numeric input beyond what `parseFloat`/`parseInt` automatically provide.
- Loan term, base rate, and assessment buffer are constants rather than configurable inputs.

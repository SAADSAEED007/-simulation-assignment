# 09 — Validation and Error Handling

This document examines the defensive programming measures implemented in `src/lib/queueing/validation.ts`, `conversions.ts`, and `stability.ts` to guarantee numerical stability, prevent mathematical division-by-zero exceptions, and provide actionable user feedback.

---

## 1. Input Validation Rules Matrix

The table below catalogs every validation check actively enforced in `validateAndParseInput()`:

| Field | Condition Checked | Code Defense | Error Message Triggered |
|---|---|---|---|
| **Arrival Inflow** | Both fields empty | `!hasInterArrival && !hasArrivalRate` | `"Please enter either the average inter-arrival time or arrival rate (λ)."` |
| **Inter-Arrival Time** | Non-numeric or $\le 0$ | `isNaN(parsed) \|\| parsed <= 0` | `"Average inter-arrival time must be a positive number greater than 0."` |
| **Inter-Arrival Time** | $> 1000\text{ min}$ | `parsed > 1000` | `"Inter-arrival time is unreasonably large (max 1000 min)."` |
| **Arrival Rate** ($\lambda$) | Non-numeric or $\le 0$ | `isNaN(parsed) \|\| parsed <= 0` | `"Arrival rate (λ) must be a positive number greater than 0."` |
| **Arrival Rate** ($\lambda$) | $> 5000\text{ veh/hr}$ | `parsed > 5000` | `"Arrival rate exceeds realistic simulation range (max 5000 veh/hr)."` |
| **Service Inflow** | Both fields empty | `!hasServiceTime && !hasServiceRate` | `"Please enter either the average service time or service rate (μ)."` |
| **Service Time** | Non-numeric or $\le 0$ | `isNaN(parsed) \|\| parsed <= 0` | `"Average service time must be a positive number greater than 0."` |
| **Service Time** | $> 1000\text{ min}$ | `parsed > 1000` | `"Service time is unreasonably large (max 1000 min)."` |
| **Service Rate** ($\mu$) | Non-numeric or $\le 0$ | `isNaN(parsed) \|\| parsed <= 0` | `"Service rate (μ) must be a positive number greater than 0."` |
| **Service Rate** ($\mu$) | $> 5000\text{ veh/hr}$ | `parsed > 5000` | `"Service rate exceeds realistic simulation range (max 5000 veh/hr)."` |
| **M/G/1 Variance** | Empty | `values.serviceVariance.trim() === ''` | `"Please enter the service-time variance Var(S) in min²."` |
| **M/G/1 Variance** | Negative or NaN | `isNaN(parsed) \|\| parsed < 0` | `"Service-time variance cannot be negative."` |
| **M/G/1 Std Dev** | Empty | `values.serviceStdDev.trim() === ''` | `"Please enter the service-time standard deviation (σS) in minutes."` |
| **M/G/1 Std Dev** | Negative or NaN | `isNaN(parsed) \|\| parsed < 0` | `"Service-time standard deviation cannot be negative."` |
| **G/G/1 Arrival Std** | Empty | `values.arrivalStdDev.trim() === ''` | `"Please enter the arrival standard deviation (σA) in minutes for G/G/1."` |
| **G/G/1 Arrival Std** | Negative or NaN | `isNaN(parsed) \|\| parsed < 0` | `"Arrival standard deviation cannot be negative."` |
| **G/G/1 Service Std** | Empty | `values.serviceStdDev.trim() === ''` | `"Please enter the service standard deviation (σS) in minutes for G/G/1."` |
| **G/G/1 Service Std** | Negative or NaN | `isNaN(parsed) \|\| parsed < 0` | `"Service standard deviation cannot be negative."` |

---

## 2. Division-by-Zero Defense

Division-by-zero is a lethal trap in queueing algorithms because:
1. $E[A] = 0 \implies \lambda = 60 / 0 \to \infty$.
2. $E[S] = 0 \implies \mu = 60 / 0 \to \infty$.
3. When $\rho = 1$, the denominator $(1 - \rho) = 0 \implies L_q = \rho^2 / 0 \to \text{NaN} \text{ or } \infty$.

### Code Safeguards:
1. **Utility Level (`src/lib/queueing/conversions.ts`)**:
   ```typescript
   export function timeToRate(minutes: number): number {
     if (minutes <= 0) return 0;
     return 60 / minutes;
   }
   ```
   If a non-positive number bypasses the UI, the function clamps to `0` rather than allowing JavaScript to evaluate `Infinity`.

2. **Stability Assessment Level (`src/lib/queueing/stability.ts`)**:
   ```typescript
   if (serviceRate <= 0) {
     return {
       status: 'UNSTABLE',
       isStable: false,
       rho: Infinity,
       title: 'INVALID SERVICE CAPACITY',
       summary: 'Service rate is non-positive; system cannot process vehicles.',
       ...
     };
   }
   ```

---

## 3. Handling Unstable Utilization ($\rho \ge 1.0$)

A common bug in poorly engineered queueing calculators is that when $\lambda = 15$ and $\mu = 10$ ($\rho = 1.5$), they blindly evaluate:
$$L_q = \frac{1.5^2}{1 - 1.5} = \frac{2.25}{-0.5} = -4.50 \text{ vehicles}$$
Displaying **negative 4.5 vehicles** in line is mathematically absurd and physically impossible.

### How the Calculator Solves This:
The calculation modules (`mm1.ts`, `mg1.ts`, `gg1.ts`) implement an upfront threshold check:
```typescript
const rho = lambda / mu;
const isStable = rho < 0.9999;
const isCritical = Math.abs(rho - 1.0) <= 0.0001;

if (isCritical || !isStable) {
  return {
    ...
    status: isCritical ? 'CRITICAL' : 'UNSTABLE',
    isStable: false,
    statusMessage: '...',
    Lq: null,
    L: null,
    WqMin: null,
    WMin: null,
    WqHours: null,
    WHours: null,
    ...
  };
}
```
When `isStable === false`:
1. Core performance metrics are set to `null`.
2. The user interface translates `null` into the mathematical symbol **`∞`** (`"infinite queue"`, `"unbounded wait"`).
3. A high-visibility **rose alert banner** displays a plain-English explanation:
   > *"Arrivals are occurring faster than the single server can process vehicles (ρ > 1). Under the single-server assumption, the queue will continue to grow rather than reach steady state (Lq → ∞)."*
4. The calculation step breakdown explains:
   > *Formula: $L_q = \rho^2 / (1 - \rho)$, Denominator $(1 - \rho) < 0 \implies L_q \to \infty, W_q \to \infty$. Steady-state distribution does not exist for an overloaded single server.*

---

## 4. Error Display in the User Interface

When invalid inputs are entered:
1. `executeQueueCalculation()` returns `{ success: false, errors }`.
2. In `page.tsx`:
   * `setErrors(outcome.errors)` updates the React error state.
   * `setResults(null)` clears any previous calculation metrics from the screen.
3. In `CalculatorSection.tsx`:
   * Red error boxes render directly below the offending input container (`bg-rose-950/40 border border-rose-800 text-rose-300`).
   * No misleading or stale metrics remain visible.

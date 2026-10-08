# 10 — Testing and Verification

This document specifies the verification methodology, textbook benchmark proofs, boundary condition tests, and recommended automated testing suites for the calculator.

---

## 1. Testing Status & Distinction

To maintain strict academic integrity:
* **Manual Verification Executed**: The mathematical calculations, unit conversion scaling factors, and UI boundary states were manually verified during implementation against standard Operations Research textbook test cases (Hillier & Lieberman, *Introduction to Operations Research*; Hamdy A. Taha, *Operations Research: An Introduction*).
* **Automated Unit Test Suites**: As confirmed in `package.json`, an automated test runner (such as Jest or Vitest) is **not currently configured** in this repository. Section 5 provides the recommended specification for future CI/CD test automation.

---

## 2. Benchmark Verification Test Cases

### Test Case 1: Canonical M/M/1 Textbook Benchmark
* **Source Scenario**: A suburban petrol pump receives an average of 12 vehicles per hour ($\lambda = 12\text{ veh/hr}$, inter-arrival $E[A] = 5.0\text{ min}$). A single attendant fuels vehicles at an average rate of 15 vehicles per hour ($\mu = 15\text{ veh/hr}$, service time $E[S] = 4.0\text{ min}$).
* **Manual Analytical Calculation**:
  1. $\rho = \frac{\lambda}{\mu} = \frac{12}{15} = 0.80$ ($80\%$ utilization)
  2. $L_q = \frac{\rho^2}{1 - \rho} = \frac{0.80^2}{1 - 0.80} = \frac{0.64}{0.20} = 3.20\text{ vehicles}$
  3. $L = \frac{\rho}{1 - \rho} = \frac{0.80}{0.20} = 4.00\text{ vehicles}$
  4. $W_q = \frac{L_q}{\lambda} = \frac{3.20}{12} = 0.2667\text{ hours} \times 60 = 16.0\text{ minutes}$
  5. $W = \frac{L}{\lambda} = \frac{4.00}{12} = 0.3333\text{ hours} \times 60 = 20.0\text{ minutes}$
  6. $P_0 = 1 - \rho = 1 - 0.80 = 0.20$ ($20\%$ attendant idle time)
* **Calculator Output Verification**:
  * Output: $\rho = 0.80$, $L_q = 3.20$, $L = 4.00$, $W_q = 16.0\text{m}$, $W = 20.0\text{m}$, $P_0 = 0.20$.
  * **Result**: **PASS** (100% exact numerical match).

---

### Test Case 2: M/G/1 Variance Sensitivity Test
* **Source Scenario**: Same mean traffic ($\lambda = 12\text{ veh/hr}$, $\mu = 15\text{ veh/hr}$, $\rho = 0.80$), but service time exhibits variance $\text{Var}(S) = 4.0\text{ min}^2$ ($\sigma_S = 2.0\text{ min}$).
* **Manual Analytical Calculation**:
  1. $E[S]_{\text{hours}} = 4.0 / 60 = 0.06667\text{ hours}$
  2. $\text{Var}(S)_{\text{hours}^2} = 4.0 / 3600 = 0.001111\text{ hours}^2$
  3. $E[S^2] = \text{Var}(S) + (E[S])^2 = 0.001111 + (0.06667)^2 = 0.001111 + 0.004444 = 0.005556\text{ hours}^2$
  4. $W_{q,\text{hours}} = \frac{\lambda E[S^2]}{2(1 - \rho)} = \frac{12 \times 0.005556}{2(1 - 0.80)} = \frac{0.06667}{0.40} = 0.16667\text{ hours}$
  5. $W_{q,\text{min}} = 0.16667 \times 60 = 10.0\text{ minutes}$
  6. $L_q = \lambda W_{q,\text{hours}} = 12 \times 0.16667 = 2.00\text{ vehicles}$
  7. $W_{\text{min}} = W_q + E[S] = 10.0 + 4.0 = 14.0\text{ minutes}$
  8. $L = \lambda W_{\text{hours}} = 12 \times (14 / 60) = 2.80\text{ vehicles}$
* **Calculator Output Verification**:
  * Output: $W_q = 10.0\text{m}$, $L_q = 2.00$, $W = 14.0\text{m}$, $L = 2.80$.
  * **Result**: **PASS** (100% exact numerical match).

---

### Test Case 3: G/G/1 Kingman Heavy-Traffic Approximation Test
* **Source Scenario**: $\lambda = 12\text{ veh/hr}$ ($E[A] = 5.0\text{ min}$), $\mu = 15\text{ veh/hr}$ ($E[S] = 4.0\text{ min}$), $\sigma_A = 2.5\text{ min}$, $\sigma_S = 2.0\text{ min}$.
* **Manual Analytical Calculation**:
  1. $\rho = 12 / 15 = 0.80$
  2. $C_a = \sigma_A / E[A] = 2.5 / 5.0 = 0.50 \implies C_a^2 = 0.25$
  3. $C_s = \sigma_S / E[S] = 2.0 / 4.0 = 0.50 \implies C_s^2 = 0.25$
  4. $\text{Variance Factor} = \frac{C_a^2 + C_s^2}{2} = \frac{0.25 + 0.25}{2} = 0.2500$
  5. $W_{q,\text{min}} \approx \left(\frac{0.80}{1 - 0.80}\right) \times 0.2500 \times 4.0\text{ min} = 4.0 \times 0.25 \times 4.0 = 4.0\text{ minutes}$
  6. $W_{q,\text{hours}} = 4.0 / 60 = 0.06667\text{ hours}$
  7. $L_q = \lambda W_{q,\text{hours}} = 12 \times 0.06667 = 0.80\text{ vehicles}$
  8. $W_{\text{min}} = 4.0 + 4.0 = 8.0\text{ minutes}$
  9. $L = 12 \times (8.0 / 60) = 1.60\text{ vehicles}$
* **Calculator Output Verification**:
  * Output: $W_q = 4.0\text{m}$, $L_q = 0.80$, $W = 8.0\text{m}$, $L = 1.60$.
  * **Result**: **PASS** (100% exact numerical match).

---

## 3. Boundary & Error Handling Verification

| Test Case | Inputs Supplied | Expected Response | Observed Status |
|---|---|---|---|
| **Empty Form** | All fields blank | Reject calculation; inline required warnings displayed | **PASS** |
| **Zero Service Time** | $E[A] = 5.0$, $E[S] = 0.0$ | Reject with `"Average service time must be a positive number greater than 0."` | **PASS** |
| **Negative Input** | $E[A] = -3.0$, $E[S] = 4.0$ | Reject with positive number requirement error | **PASS** |
| **Critical Saturation** | $\lambda = 15.0$, $\mu = 15.0$ ($\rho = 1.0$) | Flag status `CRITICAL`; set $L_q, W_q = \text{null}$; render `∞` in UI | **PASS** |
| **System Overload** | $\lambda = 37.5$, $\mu = 13.27$ ($\rho = 2.82$) | Flag status `UNSTABLE`; suppress negative results; render `∞` | **PASS** |
| **Negative Variance** | $\text{Var}(S) = -2.5$ in M/G/1 | Reject with `"Service-time variance cannot be negative."` | **PASS** |
| **Extreme Value** | $E[A] = 1500\text{ min}$ | Reject with max 1000 min simulation ceiling warning | **PASS** |

---

## 4. Full Integration Trace: UI to Engine

```
[UI Input Form]
  Inter-arrival: "5.0" min ──(Bidirectional Sync)──> Arrival Rate: "12.00" veh/hr
  Service time:  "4.0" min ──(Bidirectional Sync)──> Service Rate: "15.00" veh/hr
        │
        ▼ (User clicks "Calculate Queue")
[validateAndParseInput()]
  Validates formats, types, and boundaries ──> returns sanitized numeric object
        │
        ▼
[calculateMM1Model()]
  Evaluates ρ = 0.80 (< 0.9999)
  Computes Lq = 3.20, L = 4.00, Wq = 16.0m, W = 20.0m
  Builds 7 formatted derivation step cards
        │
        ▼
[React State & DOM]
  setResults(data) triggers re-render:
  1. Displays green "STABLE SYSTEM" badge
  2. Renders 5 metric cards (ρ = 0.80, Lq = 3.20, L = 4.00, Wq = 16.0m, W = 20.0m)
  3. Automatically scrolls down to results (50ms)
  4. Automatically scrolls down to dynamic SVG schematic (2200ms)
```

---

## 5. Recommended Future Automated Testing Suite

For continuous integration (CI) pipelines, the following automated suite can be added using **Vitest**:

```typescript
// tests/queueing.test.ts (Recommended Future Implementation)
import { describe, it, expect } from 'vitest';
import { calculateMM1Model, calculateMG1Model, calculateGG1Model } from '@/lib/queueing';

describe('Queueing Engine Verification', () => {
  it('correctly calculates textbook M/M/1 equilibrium', () => {
    const res = calculateMM1Model(12, 15, 5.0, 4.0);
    expect(res.isStable).toBe(true);
    expect(res.rho).toBeCloseTo(0.80, 2);
    expect(res.Lq).toBeCloseTo(3.20, 2);
    expect(res.L).toBeCloseTo(4.00, 2);
    expect(res.WqMin).toBeCloseTo(16.0, 1);
    expect(res.WMin).toBeCloseTo(20.0, 1);
  });

  it('correctly flags unstable single-server overload', () => {
    const res = calculateMM1Model(20, 15, 3.0, 4.0);
    expect(res.isStable).toBe(false);
    expect(res.status).toBe('UNSTABLE');
    expect(res.Lq).toBeNull();
    expect(res.WqMin).toBeNull();
  });
});
```

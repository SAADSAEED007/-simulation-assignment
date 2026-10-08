# 07 — Calculation Logic & Pipeline

This document details the end-to-end execution flow of the calculator, tracing the pipeline from user input capture in the browser DOM to mathematical evaluation, step generation, and visual schematic rendering.

---

## 1. High-Level Calculation Flow Diagram

```
                 User Interacts with UI
           (Selects Model, Inputs Data)
                         │
                         ▼
        Click "Calculate Queue" Button
                         │
                         ▼
             executeQueueCalculation()
                         │
                         ▼
             validateAndParseInput()
              ┌──────────┴──────────┐
       Invalid                     Valid
          │                           │
          ▼                           ▼
    Return Errors            Sanitized Data
    (Render in UI)    (λ, μ, E[A], E[S], variances)
                              │
                              ▼
                   Queueing Model Dispatcher
           ┌──────────────────┼──────────────────┐
           ▼                  ▼                  ▼
    calculateMM1Model  calculateMG1Model  calculateGG1Model
           │                  │                  │
           └──────────────────┼──────────────────┘
                              │
                              ▼
                      Stability Check
                     (Evaluate ρ = λ/μ)
              ┌───────────────┴───────────────┐
       ρ ≥ 1.0 (Unstable/Critical)       ρ < 1.0 (Stable)
              │                               │
              ▼                               ▼
    Set Metrics to null              Compute Lq, L, Wq, W
    Lq → ∞, Wq → ∞                   via Model Formulas
    Generate Warning Steps           Build Substitution Steps
              │                               │
              └───────────────┬───────────────┘
                              │
                              ▼
                  CalculatedResults Object
                              │
                              ▼
            React State Update (setResults)
                              │
           ┌──────────────────┴──────────────────┐
           ▼                                     ▼
     Auto-Scroll Step 4                    Auto-Scroll Schematic
     (Immediate, 50ms)                     (After Review, 2.2s)
           │                                     │
           ▼                                     ▼
    Render 5 Metric Cards                 Render SVG Pipeline
    & Step-by-Step Drawer                 (Vehicle Tokens & Flow)
```

---

## 2. Detailed Pipeline Stages

### Stage 1: Form State Capture & Real-Time Synchronization
* **Source**: `src/components/calculator/CalculatorSection.tsx`
* **Mechanism**: Whenever the user edits an input, helper handlers enforce mathematical synchronization:
  * Entering Inter-Arrival Time ($t$) updates `arrivalRate` to $(60 / t)$.
  * Entering Arrival Rate ($\lambda$) updates `interArrivalTime` to $(60 / \lambda)$.
  * Entering Service Time ($s$) updates `serviceRate` to $(60 / s)$.
  * Entering Service Rate ($\mu$) updates `serviceTime` to $(60 / \mu)$.
  * Entering Variance updates Standard Deviation to $\sqrt{\text{Variance}}$, and vice-versa.
* This ensures that no matter which field the user fills, the underlying form state maintains internal consistency.

### Stage 2: Validation and Input Sanitization
* **Source**: `src/lib/queueing/validation.ts` (`validateAndParseInput`)
* **Execution**:
  1. **Arrival Check**: Checks whether `interArrivalTime` or `arrivalRate` is non-empty. Parses floats, checks for `isNaN`, bounds between $0 < t \le 1000$ and $0 < \lambda \le 5000$. Derives sanitized $\lambda$ and $E[A]$.
  2. **Service Check**: Checks whether `serviceTime` or `serviceRate` is non-empty. Enforces $0 < s \le 1000$ and $0 < \mu \le 5000$. Derives sanitized $\mu$ and $E[S]$.
  3. **Model-Specific Check**:
     * If `MG1`: Ensures variance $\ge 0$ and computes both $\text{Var}(S)$ in $\text{min}^2$ and $\sigma_S$ in $\text{min}$.
     * If `GG1`: Ensures both $\sigma_A \ge 0$ and $\sigma_S \ge 0$.
  4. Returns `ValidationOutput`:
     ```typescript
     { isValid: boolean, errors: Record<string, string>, sanitized: { lambda, mu, ... } }
     ```

### Stage 3: Model Execution Dispatcher
* **Source**: `src/lib/queueing/index.ts` (`executeQueueCalculation`)
* If `isValid === false`, the function terminates early, returning `{ success: false, errors }`.
* If valid, it unpacks `validation.sanitized` and branches to the selected model function:
  * `MM1` $\to$ `calculateMM1Model(lambda, mu, interArrivalTimeMin, serviceTimeMin)`
  * `MG1` $\to$ `calculateMG1Model(lambda, mu, interArrivalTimeMin, serviceTimeMin, varS)`
  * `GG1` $\to$ `calculateGG1Model(lambda, mu, interArrivalTimeMin, serviceTimeMin, arrStd, servStd)`

---

## 3. Model-Specific Calculation Logic

### 3.1 M/M/1 Algorithm Flow (`src/lib/queueing/mm1.ts`)
1. **Traffic Intensity**: Compute $\rho = \lambda / \mu$.
2. **Stability Evaluation**:
   * If $|\rho - 1.0| \le 0.0001 \implies$ Return status `CRITICAL`, all metrics `null`.
   * If $\rho > 1.0 \implies$ Return status `UNSTABLE`, all metrics `null`.
3. **Equilibrium Metrics Calculation** (if $\rho < 0.9999$):
   $$\begin{aligned}
   L_q &= \frac{\rho^2}{1 - \rho} \\
   L &= \frac{\rho}{1 - \rho} \\
   W_{q,\text{hours}} &= \frac{L_q}{\lambda} \implies W_{q,\text{min}} = W_{q,\text{hours}} \times 60 \\
   W_{\text{hours}} &= \frac{L}{\lambda} \implies W_{\text{min}} = W_{\text{hours}} \times 60 \\
   P_0 &= 1 - \rho
   \end{aligned}$$
4. **Step Array Compilation**: Generates 7 sequential step cards detailing $\lambda, \mu, \rho, L_q, L, W_q, W$.

### 3.2 M/G/1 Algorithm Flow (`src/lib/queueing/mg1.ts`)
1. **Time Base Scaling**:
   $$E[S]_{\text{hours}} = \frac{E[S]_{\text{min}}}{60}, \quad \text{Var}(S)_{\text{hours}^2} = \frac{\text{Var}(S)_{\text{min}^2}}{3600}$$
2. **Second Moment Derivation**:
   $$E[S^2]_{\text{hours}^2} = \text{Var}(S)_{\text{hours}^2} + \left(E[S]_{\text{hours}}\right)^2$$
3. **Pollaczek–Khinchine Computation**:
   $$W_{q,\text{hours}} = \frac{\lambda \cdot E[S^2]_{\text{hours}^2}}{2(1 - \rho)}, \quad W_{q,\text{min}} = W_{q,\text{hours}} \times 60$$
4. **Total System Delay & Little’s Law**:
   $$W_{\text{hours}} = W_{q,\text{hours}} + E[S]_{\text{hours}}, \quad W_{\text{min}} = W_{\text{hours}} \times 60$$
   $$L_q = \lambda \cdot W_{q,\text{hours}}, \quad L = \lambda \cdot W_{\text{hours}}$$
5. **Coefficient of Variation**: $C_s = \sqrt{\text{Var}(S)} / E[S]$.

### 3.3 G/G/1 Algorithm Flow (`src/lib/queueing/gg1.ts`)
1. **Coefficients of Variation**:
   $$C_a = \frac{\sigma_A}{E[A]}, \quad C_s = \frac{\sigma_S}{E[S]}$$
2. **Variance Factor**:
   $$\text{Variance Factor} = \frac{C_a^2 + C_s^2}{2}$$
3. **Kingman Approximation**:
   $$W_{q,\text{min}} \approx \left(\frac{\rho}{1 - \rho}\right) \times \text{Variance Factor} \times E[S]_{\text{min}}$$
   $$W_{q,\text{hours}} = \frac{W_{q,\text{min}}}{60}$$
4. **System Totals & Little’s Law**:
   $$W_{\text{min}} = W_{q,\text{min}} + E[S]_{\text{min}}, \quad W_{\text{hours}} = \frac{W_{\text{min}}}{60}$$
   $$L_q = \lambda \cdot W_{q,\text{hours}}, \quad L = \lambda \cdot W_{\text{hours}}$$

---

## 4. UI Transition & Rendering Logic

Upon receiving successful `CalculatedResults`:
1. `setResults(outcome.results)` triggers React re-rendering.
2. An automatic scroll timer triggers at **$50\text{ms}$** to bring `#step-4` (Queueing Results) smoothly into the viewport.
3. A secondary transition timer triggers at **$2200\text{ms}$** to scroll smoothly down to `#system-schematic` (Petrol Pump Schematic), guiding the user from numerical results to the visual queue flow.
4. The visual schematic dynamically calculates `carsToDisplay`:
   $$\text{carsToDisplay} = \begin{cases} 6 \text{ (+ Overflow badge)} & \text{if } \rho \ge 1.0 \\ \min(5, \max(0, \text{round}(L_q))) & \text{if stable} \end{cases}$$
   rendering individual vehicle badges queued before the fuel attendant.

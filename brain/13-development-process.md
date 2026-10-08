# 13 — Development Process and Methodology

This document outlines the systematic engineering methodology used to design, implement, and verify the **Petrol Pump Queueing Calculator**.

---

## 1. Engineering Lifecycle Overview

The development followed a phased engineering workflow prioritizing mathematical correctness and architectural decoupling:

```
[Phase 1: Domain Analysis]
  • Study petrol station vehicle queue dynamics
  • Identify core parameters (λ, μ, ρ, Lq, L, Wq, W)
           │
           ▼
[Phase 2: Mathematical Formulation]
  • Derive closed-form equations for M/M/1
  • Formulate Pollaczek–Khinchine second-moment logic for M/G/1
  • Formulate Kingman Heavy-Traffic approximation for G/G/1
           │
           ▼
[Phase 3: Domain Engine Implementation]
  • Build pure TypeScript modules in src/lib/queueing/
  • Establish dimensional conversion logic (minutes ↔ hours)
  • Implement stability threshold assessment (ρ < 1, ρ = 1, ρ > 1)
           │
           ▼
[Phase 4: Defensive Validation Engine]
  • Implement input bounds (positive numbers, realistic caps)
  • Guard against division-by-zero
  • Suppress erroneous negative queue outputs under instability
           │
           ▼
[Phase 5: Presentation & Visualization]
  • Design 4-step wizard interface (Model → Data → Action → Results)
  • Build dynamic reactive SVG Queue Schematic
  • Integrate empirical PSO field observation dataset
           │
           ▼
[Phase 6: Verification & Polish]
  • Cross-check outputs against Operations Research textbook benchmarks
  • Validate edge conditions (zero, negative, overload)
  • Verify responsive mobile and desktop UI rendering
```

---

## 2. Phase-by-Phase Development Progression

### Step 1: Understand the Queueing Problem
* Studied the operational flow of vehicles arriving at a retail fuel station forecourt.
* Analyzed the arrival mechanisms, attendant fueling operations, queue buildup, and customer delay impacts.
* Formulated the problem as a single-server stochastic service system ($c = 1$) to align with coursework learning objectives.

### Step 2: Identify Required Variables
* Identified the fundamental independent inputs:
  * Mean Inter-Arrival Time $E[A]$ and Arrival Rate $\lambda$.
  * Mean Service Time $E[S]$ and Service Rate $\mu$.
  * Service variance $\text{Var}(S)$ / Standard deviation $\sigma_S$.
  * Arrival standard deviation $\sigma_A$.
* Identified the dependent performance measures:
  * Traffic intensity $\rho$.
  * Queue length $L_q$ and system length $L$.
  * Queue delay $W_q$ and total station residency $W$.
  * Attendant idle probability $P_0$.

### Step 3: Select Mathematical Models
* Selected three escalating tiers of queueing theory to capture varying levels of distribution realism:
  1. **M/M/1**: Baseline memoryless exponential model.
  2. **M/G/1**: Demonstrates the impact of fueling duration variance via the Pollaczek–Khinchine formula.
  3. **G/G/1**: Evaluates simultaneous arrival and service variability via Kingman's Heavy-Traffic Approximation.

### Step 4: Define Formulas & Units
* Standardized internal calculation arithmetic on hourly rates ($\text{veh/hr}$) and hourly durations ($\text{hr}$) to preserve dimensional consistency.
* Formulated unit scaling rules (e.g., dividing $\text{Var}(S)$ in $\text{min}^2$ by $3600$ to obtain $\text{hr}^2$).
* Formulated the ergodic stability boundary condition ($\rho < 0.9999$).

### Step 5: Design Input Structure
* Designed a dual-format input architecture allowing users to enter either elapsed minutes or hourly rates.
* Implemented live bidirectional synchronization to prevent manual calculation mistakes.
* Designed dynamic toggles for variance versus standard deviation in M/G/1.

### Step 6: Implement Pure Calculation Logic
* Programmed the calculation modules in `src/lib/queueing/`:
  * `mm1.ts`: Evaluates $L_q = \rho^2 / (1 - \rho)$, $W_q = L_q / \lambda$, $L = L_q + \rho$, $W = L / \lambda$.
  * `mg1.ts`: Evaluates $E[S^2] = \text{Var}(S) + (E[S])^2$, $W_q = \lambda E[S^2] / [2(1 - \rho)]$, $L_q = \lambda W_q$.
  * `gg1.ts`: Evaluates $C_a, C_s$, variance factor $(C_a^2 + C_s^2)/2$, and Kingman waiting time.
* Programmed the step generation system to produce human-readable substitution cards for classroom demonstration.

### Step 7: Add Defensive Validation & Stability Logic
* Built `src/lib/queueing/validation.ts` to sanitize raw string inputs, enforce positive numeric values, and reject out-of-bound inputs.
* Built `src/lib/queueing/stability.ts` to catch $\rho \ge 1.0$, preventing division-by-zero or negative queue lengths.

### Step 8: Build User Interface Components
* Assembled the presentation layer in Next.js 16 and React 19:
  * `CalculatorSection.tsx`: Structured the 4-step wizard interface.
  * `Hero.tsx`: Created the dark industrial header with station branding.
  * `ModelExplanations.tsx`: Added reference cards summarizing theoretical assumptions.
  * `PSOStudySection.tsx`: Integrated the August 2026 Pakistan State Oil observation dataset.

### Step 9: Build Dynamic Queue Visualization
* Developed `QueueVisualization.tsx` to provide an animated visual pipeline displaying arriving cars, queued vehicle badges, an active fuel attendant dispenser, and departure states.

### Step 10: Test Calculations & Benchmark Outputs
* Manually verified calculated outputs against canonical Operations Research textbook problems (e.g., $\lambda = 12, \mu = 15 \implies \rho = 0.80, L_q = 3.20, W_q = 16.0\text{ min}$).
* Verified that unstable scenarios ($\rho \ge 1$) properly return $\infty$ and display instability warning banners.

### Step 11: Interface Polish & Viewport Transitions
* Added smooth scrolling transitions (`scrollIntoView`) directing the user from data entry down to results and the visual schematic.
* Ensured high-contrast typography, responsive layouts, and clean dark-theme styling.

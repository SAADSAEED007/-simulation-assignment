# 12 — Design and Engineering Decisions

This document details the engineering rationale behind key architectural, mathematical, and user experience decisions implemented in the calculator.

---

## 1. Mathematical & Domain Decisions

### Decision 1.1: Multi-Model Inclusion (M/M/1, M/G/1, and G/G/1)
* **Decision**: Implement three distinct single-server models rather than a single simple M/M/1 calculator.
* **Engineering Rationale**:
  * An **M/M/1** model assumes exponential service times, which enforces $\sigma_S = E[S]$. In a physical petrol station, this assumption is often violated because dispensing durations depend on tank size and payment speed, frequently exhibiting smaller or larger dispersion.
  * Incorporating **M/G/1** enables students to demonstrate the **Pollaczek–Khinchine relationship** and observe how reducing fueling variance (e.g., standardizing fuel quantities) directly cuts customer waiting delays ($W_q$).
  * Incorporating **G/G/1** introduces **Kingman’s Heavy-Traffic Approximation**, allowing analysis of realistic non-Poisson vehicle arrival patterns (such as traffic light platooning).
  * Together, the three models provide a complete pedagogical progression across classical queueing theory.

### Decision 1.2: Strict Refusal of Erroneous Negative Queue Outputs ($\rho \ge 1.0$)
* **Decision**: When utilization $\rho \ge 1.0$, the calculator refuses to evaluate $(1 - \rho)$ in the denominator, setting metrics to `null` and rendering $\infty$ with an instability banner.
* **Engineering Rationale**:
  * In steady-state queueing theory, formulas such as $L_q = \rho^2 / (1 - \rho)$ are valid strictly when $\rho < 1.0$.
  * If $\rho = 1.2$, naive substitution produces $L_q = 1.44 / (-0.2) = -7.2$ vehicles. Outputting negative vehicles in line is physically impossible and academically disqualifying.
  * Setting metrics to `null` and displaying $\infty$ respects mathematical truth and educates the student on the ergodic limit of stochastic service systems.

### Decision 1.3: Standardized Hourly Rate Math with Minute-Based UI Outputs
* **Decision**: Standardize internal rates on **vehicles per hour** and convert all times to **hours** during formula execution, while formatting waiting time outputs in **minutes**.
* **Engineering Rationale**:
  * Combining minutes and hours in formulas creates dimensional errors (e.g., if $\lambda$ is in $\text{veh/hr}$ and $E[S]$ is in minutes, $\lambda E[S]$ is distorted by a factor of 60).
  * Standardizing internal arithmetic on hourly rates guarantees dimensional consistency across all equations.
  * Translating delays back into minutes for the UI ensures intuitive readability ($W_q = 16.0\text{ minutes}$ is immediately meaningful to a driver or station manager, whereas $0.2667\text{ hours}$ is awkward).

### Decision 1.4: Second Moment Scaling in M/G/1
* **Decision**: Explicitly divide service variance $\text{Var}(S)$ in $\text{min}^2$ by $3600$ before adding to $(E[S]_{\text{hours}})^2$.
* **Engineering Rationale**:
  * Variance has units of time squared ($\text{min}^2$). Because $1\text{ hour} = 60\text{ minutes}$, $1\text{ hr}^2 = 3600\text{ min}^2$.
  * Dividing by 60 instead of 3600 would be a fatal dimensional error that distorts second moment calculations by 60-fold.

---

## 2. User Experience & Interface Decisions

### Decision 2.1: Bidirectional Input Synchronization
* **Decision**: Permit users to enter arrival and service metrics as either duration ($E[A], E[S]$ in minutes) or hourly rate ($\lambda, \mu$ in veh/hr), automatically populating the other.
* **Engineering Rationale**:
  * Different empirical studies record data differently: stopwatch field logs measure minutes per car, whereas pump sales meters record cars per hour.
  * Providing live bidirectional calculation eliminates manual reciprocal math ($60 / x$), preventing human conversion errors.

### Decision 2.2: Pedagogical Step-by-Step Substitution Drawer
* **Decision**: Build a step generator that compiles an array of formula cards with numerical substitutions and academic notes.
* **Engineering Rationale**:
  * In academic coursework defenses, instructors require students to show the exact substitution steps rather than merely presenting a black-box final answer.
  * The step generator makes the engineering process completely transparent and verifiable.

### Decision 2.3: Empirical PSO Dataset as an Optional Preset Rather than Hardcoded Values
* **Decision**: Provide the August 2026 PSO observation dataset as an on-demand reference card with a `"Load PSO Example"` button rather than hardcoding the calculator strictly to PSO values.
* **Engineering Rationale**:
  * Keeps the calculator flexible for any petrol station scenario while grounding it in the university course project's specific field observation case study.
  * Explicitly highlights the academic distinction between a theoretical single-server model and the real station’s parallel multi-pump operation.

### Decision 2.4: Sequential Auto-Scroll Transitions
* **Decision**: Automatically scroll the viewport to `#step-4` upon calculation, followed by a delayed scroll to `#system-schematic` after 2.2 seconds.
* **Engineering Rationale**:
  * Smoothly directs the user’s attention through the logical narrative: first review the quantitative metrics in Step 4, then observe the qualitative physical flow in the schematic.

---

## 3. Structural & Architectural Decisions

### Decision 3.1: Pure Functional Domain Decoupling
* **Decision**: Isolate all calculation logic in `src/lib/queueing` with zero React dependencies.
* **Engineering Rationale**:
  * Follows the **Single Responsibility Principle**. The calculation engine can be unit-tested, verified in Node.js scripts, or reused in command-line tools without browser dependencies.

### Decision 3.2: Empty Component Directories
* **Observation**: Directories `src/components/comparison/`, `presentation/`, and `whatif/` exist in the repository but contain no files.
* **Status**: `Reason not identifiable from source code.` (Presumably reserved as architectural placeholders for future expansion modules).

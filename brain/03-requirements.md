# 03 — System Requirements

This document specifies the exact functional and non-functional requirements implemented in the existing **Petrol Pump Queueing Calculator** codebase.

---

## 1. Functional Requirements (FR)

### FR-01: Queueing Model Selection
* **Requirement**: The system shall permit the user to select one of three discrete single-server queueing models via interactive selector cards:
  1. `MM1`: Single-server Markovian model ($M/M/1$)
  2. `MG1`: Single-server General Service model ($M/G/1$)
  3. `GG1`: Single-server General Arrival & Service model ($G/G/1$)
* **Behavior**: Switching the active model preserves common arrival and service inputs while dynamically toggling model-specific input fields (e.g., variance or standard deviation selectors).

### FR-02: Flexible Vehicle Arrival Input
* **Requirement**: The system shall accept vehicle arrival data in either of two mutually synchronized formats:
  * Format A: **Average Inter-Arrival Time** ($E[A]$) in minutes.
  * Format B: **Arrival Rate** ($\lambda$) in vehicles per hour.
* **Synchronization**: Editing the inter-arrival time in minutes immediately populates the arrival rate via $\lambda = 60 / E[A]$, and vice versa, maintaining mathematical consistency in real time.

### FR-03: Flexible Fuel Attendant Service Input
* **Requirement**: The system shall accept attendant fueling data in either of two mutually synchronized formats:
  * Format A: **Average Service Time** ($E[S]$) in minutes.
  * Format B: **Service Rate** ($\mu$) in vehicles per hour.
* **Synchronization**: Editing the service time in minutes immediately populates the service rate via $\mu = 60 / E[S]$, and vice versa.

### FR-04: Dispersion Input for M/G/1 Model
* **Requirement**: When `MG1` is selected, the system shall provide a toggle enabling the user to specify service-time dispersion via:
  * Option 1: **Service-Time Variance** ($\text{Var}(S)$) in $\text{min}^2$, **OR**
  * Option 2: **Service-Time Standard Deviation** ($\sigma_S$) in minutes.
* **Synchronization**: The system shall automatically synchronize variance and standard deviation using $\text{Var}(S) = (\sigma_S)^2$.

### FR-05: Dispersion Inputs for G/G/1 Model
* **Requirement**: When `GG1` is selected, the system shall require and accept:
  * **Arrival Standard Deviation** ($\sigma_A$) in minutes.
  * **Service Standard Deviation** ($\sigma_S$) in minutes.

### FR-06: Empirical Preset Data Loader
* **Requirement**: The system shall provide a dedicated `"Load PSO Example"` button that populates all form fields with the empirical field metrics observed at the Pakistan State Oil station:
  * Inter-arrival time: `1.60` min ($\lambda = 37.50$ veh/hr)
  * Service time: `4.52` min ($\mu = 13.27$ veh/hr)
  * Service variance: `4.41` $\text{min}^2$ ($\sigma_S = 2.10$ min)
  * Arrival standard deviation: `1.30` min
* **Feedback**: Populating preset values displays a feedback banner and invites the user to click `"Calculate Queue"`.

### FR-07: Client-Side Input Validation
* **Requirement**: The system shall strictly validate all form values before invoking mathematical calculations:
  * Reject non-numeric, empty, or negative inputs.
  * Reject arrival or service times $\le 0$ to prevent division by zero.
  * Enforce realistic upper boundaries ($E[A], E[S] \le 1000$ minutes; $\lambda, \mu \le 5000$ veh/hr).
  * Enforce non-negative standard deviations and variances ($\ge 0$).
  * Display clear, field-specific inline error messages in red boxes upon violation.

### FR-08: Stability & Equilibrium Assessment
* **Requirement**: The system shall evaluate the traffic intensity $\rho = \lambda / \mu$ and classify the system into one of three operational states:
  1. `STABLE` ($\rho < 0.9999$): Capacity exceeds demand; steady state is maintained.
  2. `CRITICAL` ($|\rho - 1.0| \le 0.0001$): Capacity equals demand; queues drift upwards without bound.
  3. `UNSTABLE` ($\rho > 1.0$): Arrival demand exceeds capacity; infinite queue expansion ($L_q \to \infty$).

### FR-09: Computation of Core Performance Measures
* **Requirement**: For stable systems ($\rho < 1$), the system shall compute:
  * Average Queue Length ($L_q$)
  * Average System Length ($L$)
  * Average Waiting Time in Queue ($W_q$ in minutes and hours)
  * Average Total Time in System ($W$ in minutes and hours)
  * Attendant Idle Probability ($P_0 = 1 - \rho$, for $M/M/1$)
  * Coefficients of Variation ($C_a, C_s$, for $G/G/1$)
* **Requirement for Unstable Systems**: When $\rho \ge 1.0$, the system shall refuse to evaluate steady-state formulas, returning `null` metrics and displaying $\infty$ in the user interface to preserve mathematical truth.

### FR-10: Step-by-Step Pedagogical Substitution Breakdown
* **Requirement**: For every completed calculation, the system shall generate a structured array of calculation step cards displaying:
  * Step title
  * Canonical algebraic formula
  * Numerical parameter substitution
  * Calculated result with appropriate units
  * Plain-English academic explanation

### FR-11: Reactive Queue Schematic Visualization
* **Requirement**: After calculation, the system shall render an SVG pipeline schematic showing:
  * Inflowing vehicle stream labeled with $\lambda$
  * Driveway queue displaying discrete car badges up to $\min(5, \text{round}(L_q))$ (or an overflow state if unstable)
  * Single attendant fuel pump dispenser with pulse animations and $\mu$ capacity
  * Vehicle departure stage with total residency time $W$

### FR-12: Form Reset
* **Requirement**: The system shall provide a `"Clear All"` button that purges all form values, active results, errors, and feedback states.

---

## 2. Non-Functional Requirements (NFR)

### NFR-01: Mathematical Precision & Consistency
* All rate calculations must execute on a standardized **hourly basis** ($\text{veh/hr}$), while queueing time delays are presented in **minutes** for practical comprehension.
* Unit conversions (e.g., $\text{min}^2$ to $\text{hr}^2$ via division by 3600) must be applied prior to entering second-moment formulas.
* Floating-point numbers rendered to the user must be rounded cleanly ($2$ decimals for vehicles, $1$ decimal for minutes, $3$ decimals for $\rho$).

### NFR-02: Zero Server Dependency (Deterministic Client Execution)
* All validation, parsing, and queueing algorithms must execute entirely in the user’s browser via pure TypeScript functions. Calculations must execute in under 5 milliseconds with zero network requests.

### NFR-03: Visual Aesthetics & Responsive Layout
* The interface must utilize an ultra-modern dark industrial palette (`#090b0f`, `#0e121a`, emerald accent `#35E6A7`, amber `#f59e0b`, rose `#f43f5e`).
* Layout must be fully responsive across mobile phones, tablets, and desktop workstations.

### NFR-04: Pedagogical Accessibility
* Mathematical notation must use standard Operations Research symbols ($\lambda, \mu, \rho, L_q, L, W_q, W, P_0$).
* Technical terminology must be defined in plain academic language suitable for review by university faculty.

### NFR-05: Modularity and Decoupling
* Mathematical calculations must reside in isolated libraries (`src/lib/queueing`) with zero dependencies on React hooks or DOM elements, ensuring testability and code reuse.

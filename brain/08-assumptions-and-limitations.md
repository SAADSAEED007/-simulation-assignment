# 08 — Assumptions and Limitations

To ensure sound academic interpretation, this document delineates the mathematical assumptions underlying the queueing equations, the real-world operational factors of petrol pump stations, and the intentional software boundaries of the calculator.

---

## 1. Mathematical Model Assumptions

### 1.1 Steady-State Equilibrium ($t \to \infty$)
* **Assumption**: All formulas calculate long-run steady-state expected values rather than transient time-dependent states.
* **Implication**: The system is assumed to have been operating under constant arrival rate $\lambda$ and service rate $\mu$ for a sufficiently long period that initial empty-state conditions no longer influence metrics.

### 1.2 The Strict Stability Condition ($\rho < 1.0$)
* **Mathematical Truth**: For any single-server queue with infinite waiting room, steady-state equilibrium exists **if and only if** the traffic intensity satisfies:
  $$\rho = \frac{\lambda}{\mu} < 1.0$$
* **When $\rho = 1.0$ (Critical Saturation)**: In a deterministic world, $\rho = 1$ would imply zero queue. However, under stochastic variations, queue length follows an unbounded random walk drifting upwards ($L_q \to \infty$). No stationary probability distribution exists.
* **When $\rho > 1.0$ (Overload / Transcritical Regime)**: On average, vehicles arrive faster than the single pump can dispense fuel. The queue grows at an asymptotic rate of $(\lambda - \mu)$ vehicles per hour. Steady-state formulas divide by $(1 - \rho) < 0$, which yields mathematically meaningless negative numbers. The calculator prevents this error by returning $\infty$ (`null`).

### 1.3 Infinite Waiting Room ($K = \infty$)
* **Assumption**: The forecourt driveway can accommodate an infinite number of waiting vehicles.
* **Real-World Reality**: In a real petrol station, the driveway holds perhaps 4 to 8 cars before blocking public roadway lanes or causing incoming drivers to balk (drive away upon seeing a long line).

### 1.4 Infinite Calling Population ($N = \infty$)
* **Assumption**: The arrival of one vehicle does not diminish the likelihood of subsequent vehicles arriving. (Valid for open public highways).

### 1.5 Mutual Independence
* Inter-arrival intervals $A_1, A_2, \dots$ are mutually independent identically distributed (i.i.d.) random variables.
* Fueling durations $S_1, S_2, \dots$ are mutually independent and identically distributed.
* The arrival stream and service durations are completely independent of one another. (In reality, attendants might speed up fueling when observing a long queue).

### 1.6 Service Discipline (Strict FCFS)
* Vehicles are serviced in strict chronological order of arrival without queue jumping, overtaking, or priority lanes.

---

## 2. Real-World Limitations vs. Single-Server Modeling

| Real-World Phenomenon | Single-Server Mathematical Model | Why This Distinction Matters in Coursework |
|---|---|---|
| **Multiple Fuel Dispensers** | Modeled as **one server ($c = 1$)** | Most modern stations (including PSO) operate multiple 2-sided dispensers. A single-server model isolates the performance of a single attendant bottleneck to satisfy course learning objectives. |
| **Driver Reneging & Balking** | Zero balking / Zero reneging | Impatient drivers leave long queues in reality. In our infinite queue model, drivers are assumed to wait indefinitely. |
| **Rush Hour Bursts (Non-Stationary)** | Time-invariant constant rates ($\lambda, \mu$) | Real traffic exhibits morning and evening peak hours. The model assumes a stationary time window (such as a 2-hour peak observation). |
| **Payment & Ancillary Delays** | Lumped into single service duration $S$ | Card processing, oil checks, windshield cleaning, and tire pressure adjustments add multi-stage complexity. Our model abstracts this into aggregate service time. |
| **Attendant Fatigue & Breakdowns** | Server is 100% available with constant rate $\mu$ | Real attendants take breaks, swap shifts, or experience pump nozzle mechanical failures. |

---

## 3. The Empirical PSO Study Paradox: Why $\rho = 2.82$ Occurs

During the August 2026 observation at the Pakistan State Oil station:
* Inflow rate: $\lambda = 37.39\text{ veh/hr}$ ($1.60\text{ min}$ inter-arrival)
* Service rate: $\mu = 13.27\text{ veh/hr}$ ($4.52\text{ min}$ fueling duration)
* Observed actual waiting time: **$4.42\text{ minutes}$**

If evaluated under a single server:
$$\rho = \frac{37.39}{13.27} \approx 2.818$$
Because $\rho = 2.82 \gg 1.0$, a naive single-server interpretation would predict that queue length should explode to infinity. Yet the actual observed waiting time was a modest 4.42 minutes!

**Engineering Explanation**:  
This demonstrates why queueing theory is essential:
1. It proves conclusively that the physical PSO station operated at least **3 to 4 parallel pump nozzles** simultaneously ($c \ge 3 \implies \rho_{\text{multi}} = 37.39 / (3 \times 13.27) = 0.939$).
2. The calculator explicitly flags this scenario as `UNSTABLE (ρ > 1)` for a single server, correctly educating students that single-attendant staffing is mathematically incapable of sustaining this traffic volume without multi-pump parallelism.

---

## 4. Software Boundaries & Scope

To maintain clarity, the following features are outside the current software scope:
1. **Multi-Server Multi-Queue Topologies**: Parallel servers ($M/M/c$) are not currently calculated.
2. **Discrete Event Simulation Engine**: The calculator executes analytical closed-form equations; it does not run a micro-simulation generating pseudo-random car timestamps.
3. **Database Persistence**: Observations are loaded in-memory and not written to a remote SQL/NoSQL database.

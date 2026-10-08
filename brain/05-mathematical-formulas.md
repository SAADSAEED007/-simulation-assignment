# 05 — Mathematical Formulas

This document provides a comprehensive, rigorous specification of every mathematical formula implemented in the calculator’s domain engine (`src/lib/queueing`). The codebase is the absolute source of truth.

---

## 1. Input Conversion & Dimensional Homogeneity Formulas

All queueing models evaluate rates on a standardized **hourly basis** ($\text{vehicles/hour}$) and service times on an **hour** basis during equation solving, while presenting delays to the user in **minutes**.

### F-01: Time-to-Rate Conversion
$$\lambda = \frac{60}{E[A]}, \quad \mu = \frac{60}{E[S]}$$
* **Meaning**: Translates average inter-arrival duration or average fueling duration into hourly throughput rates.
* **Variables**:
  * $E[A]$: Average inter-arrival time in minutes ($\text{min}$).
  * $E[S]$: Average service time in minutes ($\text{min}$).
  * $\lambda$: Vehicle arrival rate in vehicles/hour ($\text{veh/hr}$).
  * $\mu$: Attendant service rate in vehicles/hour ($\text{veh/hr}$).
* **Location in Code**: `src/lib/queueing/conversions.ts` (`timeToRate`) and `validation.ts`.
* **Prerequisite Condition**: $E[A] > 0$ and $E[S] > 0$.

### F-02: Rate-to-Time Conversion
$$E[A] = \frac{60}{\lambda}, \quad E[S] = \frac{60}{\mu}$$
* **Meaning**: Converts an hourly frequency into the average minutes between consecutive events.
* **Location in Code**: `src/lib/queueing/conversions.ts` (`rateToTime`).

### F-03: Service Variance Time-Base Scaling
$$\text{Var}(S)_{\text{hours}^2} = \frac{\text{Var}(S)_{\text{min}^2}}{3600}$$
* **Meaning**: Scales service variance from minutes squared ($\text{min}^2$) to hours squared ($\text{hr}^2$) because $1\text{ hour} = 60\text{ minutes} \implies 1^2\text{ hr}^2 = 60^2 = 3600\text{ min}^2$.
* **Variables**:
  * $\text{Var}(S)_{\text{min}^2}$: Service-time variance entered by user ($\text{min}^2$).
  * $\text{Var}(S)_{\text{hours}^2}$: Service-time variance required for P-K equation ($\text{hr}^2$).
* **Location in Code**: `src/lib/queueing/mg1.ts` (line 17).
* **Why Needed**: Substituting unscaled $\text{min}^2$ variance into an hourly equation causes a catastrophic $3600\times$ dimensional distortion.

---

## 2. Fundamental System & Stability Formulas

### F-04: Traffic Intensity / Attendant Utilization ($\rho$)
$$\rho = \frac{\lambda}{\mu} = \lambda \cdot E[S]_{\text{hours}}$$
* **Meaning**: The fraction of time the fuel attendant is actively dispensing fuel.
* **Variables**: $\lambda$ ($\text{veh/hr}$), $\mu$ ($\text{veh/hr}$), $\rho$ (dimensionless ratio, $0 \le \rho < 1$).
* **Location in Code**: `src/lib/queueing/stability.ts` and model files (`mm1.ts`, `mg1.ts`, `gg1.ts`).
* **Condition & Thresholds Implemented**:
  * **Stable**: $\rho < 0.9999 \implies$ Finite steady-state equilibrium exists.
  * **Critical**: $|\rho - 1.0| \le 0.0001 \implies$ State is non-ergodic; expected queue length grows unboundedly over time.
  * **Unstable**: $\rho > 1.0 \implies$ Deterministic overload; queue explodes ($L_q \to \infty, W_q \to \infty$).

### F-05: Attendant Idle Probability ($P_0$) — M/M/1
$$P_0 = 1 - \rho$$
* **Meaning**: Probability that zero vehicles are present at the pump and the attendant is unoccupied.
* **Location in Code**: `src/lib/queueing/mm1.ts` (line 115).
* **Condition**: $\rho < 1.0$.

### F-06: Little’s Law
$$L = \lambda W, \quad L_q = \lambda W_q$$
* **Meaning**: The fundamental conservation law of queueing systems, proven by John Little (1961). It states that the long-term average number of items in a stationary queueing system ($L$) equals the long-term average arrival rate ($\lambda$) multiplied by the average time an item spends in the system ($W$).
* **Units**: Vehicles = $(\text{veh/hr}) \times (\text{hours})$.
* **Location in Code**: `src/lib/queueing/mg1.ts` (lines 60-61), `gg1.ts` (lines 87, 101), `mm1.ts` (lines 111, 113).

---

## 3. M/M/1 Model Formulas

Applicable when inter-arrival and service times follow independent exponential distributions.

### F-07: Average Queue Length ($L_q$)
$$L_q = \frac{\rho^2}{1 - \rho}$$
* **Meaning**: Average number of vehicles waiting in line behind the vehicle currently at the pump.
* **Variables**: $\rho = \lambda / \mu$.
* **Location in Code**: `src/lib/queueing/mm1.ts` (line 109).

### F-08: Average Number of Vehicles in System ($L$)
$$L = \frac{\rho}{1 - \rho} = L_q + \rho$$
* **Meaning**: Total average vehicles on the premises (waiting vehicles + vehicle being fueled).
* **Location in Code**: `src/lib/queueing/mm1.ts` (line 110).

### F-09: Average Waiting Time in Queue ($W_q$)
$$W_{q,\text{hours}} = \frac{L_q}{\lambda} = \frac{\rho}{\mu(1 - \rho)}, \quad W_{q,\text{min}} = W_{q,\text{hours}} \times 60$$
* **Meaning**: Average duration a driver waits before fueling commences.
* **Location in Code**: `src/lib/queueing/mm1.ts` (lines 111–112).

### F-10: Average Total Time in System ($W$)
$$W_{\text{hours}} = \frac{L}{\lambda} = W_{q,\text{hours}} + \frac{1}{\mu}, \quad W_{\text{min}} = W_{\text{hours}} \times 60 = W_{q,\text{min}} + E[S]_{\text{min}}$$
* **Meaning**: Total elapsed time from arrival at the petrol station to completed departure.
* **Location in Code**: `src/lib/queueing/mm1.ts` (lines 113–114).

---

## 4. M/G/1 Model Formulas (Pollaczek–Khinchine)

Applicable when arrivals are Poisson ($\lambda$) and fueling service duration follows an arbitrary distribution with mean $E[S]$ and variance $\text{Var}(S)$.

### F-11: Second Moment of Service Time ($E[S^2]$)
$$E[S^2]_{\text{hours}^2} = \text{Var}(S)_{\text{hours}^2} + \left(E[S]_{\text{hours}}\right)^2$$
* **Meaning**: By probability theory, variance is defined as $\text{Var}(S) = E[S^2] - (E[S])^2$. Rearranging yields the second raw moment $E[S^2]$.
* **Location in Code**: `src/lib/queueing/mg1.ts` (line 19).

### F-12: Pollaczek–Khinchine Mean Waiting Time ($W_q$)
$$W_{q,\text{hours}} = \frac{\lambda \cdot E[S^2]_{\text{hours}^2}}{2(1 - \rho)}$$
* **Conversion to Minutes**:
  $$W_{q,\text{min}} = W_{q,\text{hours}} \times 60$$
* **Meaning**: Derives expected queue waiting time directly from service variance.
* **Location in Code**: `src/lib/queueing/mg1.ts` (lines 55–56).
* **Equivalence Note**: Combining $L_q = \lambda W_q$ with $E[S^2] = \text{Var}(S) + (E[S])^2$ yields the classical textbook algebraic identity:
  $$L_q = \frac{\lambda^2 \text{Var}(S) + \rho^2}{2(1 - \rho)}$$
  The codebase evaluates $W_q$ first using second moment $E[S^2]$ and derives $L_q = \lambda W_q$, which produces the exact same numerical result with superior numerical stability.

### F-13: System Residency Time ($W$)
$$W_{\text{hours}} = W_{q,\text{hours}} + E[S]_{\text{hours}}, \quad W_{\text{min}} = W_{\text{hours}} \times 60$$
* **Location in Code**: `src/lib/queueing/mg1.ts` (lines 57–58).

### F-14: Queue Length & System Length ($L_q, L$)
$$L_q = \lambda \cdot W_{q,\text{hours}}, \quad L = \lambda \cdot W_{\text{hours}}$$
* **Location in Code**: `src/lib/queueing/mg1.ts` (lines 60–61).

### F-15: Service Coefficient of Variation ($C_s$)
$$C_s = \frac{\sqrt{\text{Var}(S)}}{E[S]} = \frac{\sigma_S}{E[S]}$$
* **Meaning**: Quantifies the relative dispersion of fueling durations.
* **Location in Code**: `src/lib/queueing/mg1.ts` (line 64).

---

## 5. G/G/1 Model Formulas (Kingman’s Heavy-Traffic Approximation)

Applicable when both arrival and service durations follow general continuous distributions.

### F-16: Coefficients of Variation ($C_a$ and $C_s$)
$$C_a = \frac{\sigma_A}{E[A]}, \quad C_s = \frac{\sigma_S}{E[S]}$$
* **Meaning**: Normalizes standard deviations against mean intervals.
* **Location in Code**: `src/lib/queueing/gg1.ts` (lines 16–17).

### F-17: Combined Variance Factor
$$\text{Variance Factor} = \frac{C_a^2 + C_s^2}{2}$$
* **Meaning**: Blends the relative variability of incoming vehicle surges and attendant service speed. If both distributions are exponential, $C_a = 1, C_s = 1 \implies \text{Variance Factor} = (1 + 1)/2 = 1.0$.
* **Location in Code**: `src/lib/queueing/gg1.ts` (line 54).

### F-18: Kingman’s Waiting Time in Queue ($W_q$)
$$W_{q,\text{min}} \approx \left(\frac{\rho}{1 - \rho}\right) \cdot \left(\frac{C_a^2 + C_s^2}{2}\right) \cdot E[S]_{\text{min}}$$
$$W_{q,\text{hours}} = \frac{W_{q,\text{min}}}{60}$$
* **Meaning**: Kingman's heavy-traffic approximation evaluates waiting time as the product of utilization multiplier $\frac{\rho}{1 - \rho}$, variance factor $\frac{C_a^2 + C_s^2}{2}$, and mean service duration $E[S]$.
* **Location in Code**: `src/lib/queueing/gg1.ts` (lines 55–56).

### F-19: Kingman’s Total Time in System ($W$) & Queue Lengths ($L_q, L$)
$$W_{\text{min}} = W_{q,\text{min}} + E[S]_{\text{min}}, \quad W_{\text{hours}} = \frac{W_{\text{min}}}{60}$$
$$L_q = \lambda \cdot W_{q,\text{hours}}, \quad L = \lambda \cdot W_{\text{hours}}$$
* **Location in Code**: `src/lib/queueing/gg1.ts` (lines 57–62).

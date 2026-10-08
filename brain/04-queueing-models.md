# 04 — Supported Queueing Models

This document details the theoretical formulation, stochastic assumptions, and operational relevance of the three single-server queueing models implemented in the calculator.

---

## 1. Kendall’s Notation Framework

In 1953, mathematician David G. Kendall established standard shorthand notation to classify queueing nodes:
$$A \,/\, S \,/\, c \,/\, K \,/\, N \,/\, D$$

Where:
* **$A$** = Arrival process probability distribution.
* **$S$** = Service time probability distribution.
* **$c$** = Number of parallel servers ($c = 1$ in this project).
* **$K$** = System storage capacity (defaulted to $\infty$).
* **$N$** = Calling population size (defaulted to $\infty$).
* **$D$** = Queue discipline (defaulted to First-Come, First-Served / FCFS).

The three models implemented in this software represent three escalating tiers of distribution generality:

```
┌─────────────────────────────────────────────────────────────┐
│                       G/G/1 Model                           │
│     (Arbitrary Arrival Distribution + Arbitrary Service)    │
│                                                             │
│         ┌─────────────────────────────────────────────┐     │
│         │                 M/G/1 Model                 │     │
│         │   (Poisson Arrivals + Arbitrary Service)    │     │
│         │                                             │     │
│         │         ┌─────────────────────────┐         │     │
│         │         │       M/M/1 Model       │         │     │
│         │         │ (Poisson Arr + Exp Srv) │         │     │
│         │         └─────────────────────────┘         │     │
│         └─────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Model 1: M/M/1 (Classic Markovian Queue)

### Classification
* **$A = M$**: Markovian (exponential inter-arrival times, equivalent to a Poisson arrival process).
* **$S = M$**: Markovian (exponential service times).
* **$c = 1$**: Exactly one fuel attendant.

### Underlying Assumptions
1. **Memoryless Property**: The exponential distribution is the only continuous probability distribution possessing memorylessness:
   $$P(X > t + s \mid X > s) = P(X > t)$$
   The probability that a vehicle arrives in the next 60 seconds is entirely independent of how long it has been since the last vehicle arrived. Similarly, the probability that the attendant completes fueling in the next 30 seconds does not depend on how long the vehicle has already been at the pump.
2. **Birth-Death Process**: The state of the system is the number of vehicles $n \in \{0, 1, 2, \dots\}$ in the system. Transitions occur only between adjacent states ($n \to n+1$ with birth rate $\lambda$, and $n \to n-1$ with death rate $\mu$).
3. **Single Channel**: Only one vehicle is fueled at a time.
4. **Infinite Queue**: Driveway space is assumed infinite; arriving drivers never balk.

### Operational Relevance
M/M/1 serves as the baseline theoretical model taught in introductory Operations Research. It provides elegant closed-form solutions without requiring higher moments or numerical approximations.

### Primary Closed-Form Formulas (Implemented)
* Traffic Intensity:
  $$\rho = \frac{\lambda}{\mu}$$
* Server Idle Probability:
  $$P_0 = 1 - \rho$$
* Expected Number of Vehicles in Queue:
  $$L_q = \frac{\rho^2}{1 - \rho}$$
* Expected Number of Vehicles in System:
  $$L = \frac{\rho}{1 - \rho} = L_q + \rho$$
* Expected Waiting Time in Queue:
  $$W_q = \frac{L_q}{\lambda} = \frac{\rho}{\mu(1 - \rho)}$$
* Expected Total Time in System:
  $$W = \frac{L}{\lambda} = W_q + \frac{1}{\mu}$$

---

## 3. Model 2: M/G/1 (Pollaczek–Khinchine Model)

### Classification
* **$A = M$**: Markovian (Poisson arrival process with rate $\lambda$).
* **$S = G$**: General service distribution (arbitrary continuous distribution with known mean $E[S]$ and variance $\text{Var}(S)$).
* **$c = 1$**: Exactly one fuel attendant.

### Why General Service Matters for Petrol Stations
In an M/M/1 model, the service time variance is mathematically constrained to equal the square of the mean:
$$\text{Var}(S)_{\text{exp}} = (E[S])^2 \implies \sigma_S = E[S]$$
In reality, fueling durations at petrol stations rarely exhibit an exponential shape. Many vehicles take a predictable 3 to 4 minutes to dispense fuel, resulting in a variance much lower than $(E[S])^2$. Conversely, stations that mix quick motorcycle top-offs (30 seconds) with massive commercial transport fill-ups (15 minutes) exhibit high service variance.

The M/G/1 model accounts for arbitrary variance through the celebrated **Pollaczek–Khinchine (P-K) Formula**.

### Second Moment Formulation
The P-K relationship requires the expected value of the square of service time:
$$E[S^2] = \text{Var}(S) + (E[S])^2$$

### Implemented P-K Mean Value Formulas
* Expected Waiting Time in Queue:
  $$W_q = \frac{\lambda E[S^2]}{2(1 - \rho)}$$
* Expected Total Time in System:
  $$W = W_q + E[S]$$
* Expected Queue Length (via Little’s Law):
  $$L_q = \lambda W_q$$
* Expected System Length (via Little’s Law):
  $$L = \lambda W$$

### Special Cases Derived from M/G/1
1. **If $\text{Var}(S) = (E[S])^2$** (Exponential service):
   $$E[S^2] = (E[S])^2 + (E[S])^2 = 2(E[S])^2$$
   $$W_q = \frac{\lambda \cdot 2(E[S])^2}{2(1 - \rho)} = \frac{\lambda (E[S])^2}{1 - \rho} = \frac{\rho}{\mu(1 - \rho)}$$
   The formula collapses exactly to the M/M/1 waiting time.
2. **If $\text{Var}(S) = 0$** (Deterministic service / $M/D/1$, e.g. automated automated robot pump):
   $$E[S^2] = (E[S])^2$$
   $$W_q = \frac{\lambda (E[S])^2}{2(1 - \rho)} = \frac{1}{2} W_{q, M/M/1}$$
   Eliminating fueling variability cuts driver queue delays exactly in half.

---

## 4. Model 3: G/G/1 (Kingman’s Heavy-Traffic Approximation)

### Classification
* **$A = G$**: General arrival distribution with mean $E[A]$ and standard deviation $\sigma_A$.
* **$S = G$**: General service distribution with mean $E[S]$ and standard deviation $\sigma_S$.
* **$c = 1$**: Exactly one fuel attendant.

### Why General Arrivals Matter
Real highway or urban traffic does not always follow a pure Poisson process. Traffic upstream may be regulated by traffic light cycles (producing highly periodic, low-variance arrivals) or subject to erratic accident surges (producing high-variance arrivals).

Because an exact closed-form solution for arbitrary $G/G/1$ queues does not exist in elementary functions, the calculator implements **Kingman’s Heavy-Traffic Approximation** (1961), the standard engineering benchmark for general queues.

### Coefficients of Variation ($C_a$ and $C_s$)
To normalize variance across different time scales, the calculator evaluates dimensionless coefficients of variation:
$$C_a = \frac{\sigma_A}{E[A]}, \quad C_s = \frac{\sigma_S}{E[S]}$$
* If $C = 1$, dispersion matches an exponential distribution.
* If $C < 1$, the process is more regular and predictable than exponential.
* If $C > 1$, the process is highly bursty and clustered.

### Implemented Kingman Formulation
* Waiting Time in Queue:
  $$W_q \approx \left(\frac{\rho}{1 - \rho}\right) \left(\frac{C_a^2 + C_s^2}{2}\right) E[S]$$
* Total Time in System:
  $$W = W_q + E[S]$$
* Expected Queue Length (via Little’s Law):
  $$L_q = \lambda W_q$$
* Expected System Length (via Little’s Law):
  $$L = \lambda W$$

Notice how Kingman decomposes delay into three intuitive physical drivers:
$$\text{Delay} \approx (\text{Traffic Intensity Term}) \times (\text{Variability Term}) \times (\text{Service Scale Term})$$

---

## 5. Models Not Currently Implemented

To ensure documentation integrity, the following queueing models are explicitly documented as **Not currently implemented** in the calculator:
* **$M/M/c$ (Multi-Server Queue)**: Stations with $c > 1$ parallel attendants sharing a single waiting line.
* **$M/M/c/K$ (Finite Capacity Queue)**: Stations with restricted driveway space where arriving vehicles balk when $K$ cars are present.
* **$M/M/c/\infty/N$ (Finite Calling Population)**: Private depot pumps servicing a closed fleet of $N$ fleet delivery trucks.
* **Priority Queues ($M/M/1/\text{Priority}$)**: Priority service for emergency ambulances or subscription cardholders.

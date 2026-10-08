# 15 — Future Improvements and Roadmap

This document outlines potential future architectural, mathematical, and analytical enhancements for the **Petrol Pump Queueing Calculator**.

> **Important Notice:**  
> The features outlined below represent **future expansion concepts** for subsequent academic research phases. None of these features are currently implemented in the codebase; the existing software strictly evaluates single-server models ($M/M/1$, $M/G/1$, $G/G/1$).

---

## 1. Mathematical & Model Extensions

### 1.1 Multi-Server Queueing Topologies ($M/M/c$ and $M/G/c$)
* **Motivation**: Real-world stations (including the Pakistan State Oil station observed in the empirical dataset) operate multiple fueling dispensers in parallel.
* **Proposed Extension**:
  * Allow users to specify server count $c \in \{1, 2, 3, \dots, 8\}$.
  * Evaluate multi-server utilization $\rho = \lambda / (c\mu)$ with stability condition $\rho < 1.0$.
  * Implement the **Erlang-C formula** to evaluate the probability of waiting $P(\text{Wait} > 0)$:
    $$P_0 = \left[ \sum_{n=0}^{c-1} \frac{(c\rho)^n}{n!} + \frac{(c\rho)^c}{c!(1 - \rho)} \right]^{-1}$$
    $$L_q = \frac{(c\rho)^c \rho}{c!(1 - \rho)^2} P_0$$

### 1.2 Finite Waiting Driveway Capacity ($M/M/1/K$ and $M/M/c/K$)
* **Motivation**: Physical station forecourts have physical space limits (e.g., maximum 5 cars can wait in the driveway before spilling onto the public street). Once full, arriving drivers balk and drive away.
* **Proposed Extension**:
  * Add a parameter $K$ for maximum system capacity.
  * Evaluate steady-state probabilities $P_n$ for finite state space $n \in \{0, 1, \dots, K\}$.
  * Compute the **Balking Probability** $P_K$ and effective arrival rate $\lambda_{\text{eff}} = \lambda(1 - P_K)$.
  * Calculate economic revenue lost due to forecourt capacity limits.

### 1.3 Priority Queueing Disciplines ($M/M/1/\text{Priority}$)
* **Motivation**: Stations frequently designate dedicated priority lanes for emergency response vehicles (ambulances, police) or cashless subscription passholders.
* **Proposed Extension**:
  * Implement non-preemptive priority models evaluating separate waiting times $W_{q,1}$ (priority) and $W_{q,2}$ (regular).

---

## 2. Analytical & Visualization Enhancements

### 2.1 Interactive Sensitivity Analysis Curves
* **Motivation**: Demonstrating the non-linear "hockey-stick" queue explosion visually enhances academic comprehension.
* **Proposed Extension**:
  * Render an interactive chart showing $W_q$ plotted against $\rho$ from $0.10$ to $0.98$.
  * Enable users to move a slider for $\text{Var}(S)$ to watch the M/G/1 curve shift relative to M/M/1.

### 2.2 Discrete-Event Monte Carlo Simulation Engine
* **Motivation**: Academic curricula often teach analytical queueing theory alongside discrete-event simulation (DES).
* **Proposed Extension**:
  * Add a client-side WebWorker simulation engine that generates 10,000 synthetic vehicles with pseudo-random arrival and service timestamps.
  * Display a side-by-side comparison table contrasting analytical steady-state formulas against simulated sample means.

### 2.3 Statistical Distribution Fitting
* **Motivation**: Transitioning from textbook parameters to raw timestamp logs requires statistical parameter estimation.
* **Proposed Extension**:
  * Allow users to upload raw timestamp CSV logs.
  * Execute Chi-Square ($\chi^2$) and Kolmogorov–Smirnov (K-S) goodness-of-fit tests to automatically identify whether arrivals follow Exponential, Gamma, Weibull, or Lognormal distributions.

---

## 3. Tooling & Export Capabilities

### 3.1 Coursework Report PDF Generator
* **Motivation**: Students and lab researchers often need to export their findings for coursework submission.
* **Proposed Extension**:
  * Add a `"Download Lab Report (PDF)"` button that bundles problem inputs, stability status, calculated metrics, step-by-step substitution cards, and the system schematic into a formatted document.

### 3.2 Historical Experiment Tracker
* **Motivation**: Comparing multiple operational configurations (e.g., comparing current 1-server baseline against a proposed 2-server upgrade).
* **Proposed Extension**:
  * Implement a local storage experiment log allowing users to save scenarios and view a comparative differential table.

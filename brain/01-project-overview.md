# 01 — Project Overview

## 1. Project Identification

* **Project Title**: Petrol Pump Queueing Calculator
* **Internal Package Name**: `pso-queue-analyzer`
* **Version**: 0.1.0
* **Domain**: Operations Research, Queueing Theory, Stochastic Systems Modeling

---

## 2. Project Purpose

The **Petrol Pump Queueing Calculator** is an engineering simulation tool designed to model and analyze the stochastic waiting line dynamics at a fuel retail station. Specifically, the software evaluates the performance of a **single fuel dispenser / fuel attendant** serving arriving motor vehicles under varying traffic intensities and probability distributions.

In retail petrol stations, management faces a perpetual trade-off:
1. **Under-capacity**: Arriving vehicles face prolonged waiting lines ($W_q$), causing vehicle spillback onto public access roads, driver frustration, and lost revenue (balking or reneging).
2. **Over-capacity**: Excessive unattended dispensing islands incur idle labor and equipment depreciation costs.

This calculator allows students, researchers, and station operators to mathematically evaluate this operational boundary by inputting real or hypothetical arrival and fueling metrics, selecting appropriate queueing models, and inspecting the resulting equilibrium performance indicators.

---

## 3. Real-World Case Context: The PSO Empirical Study

To anchor theoretical calculations in empirical reality, the project integrates real-world observational data gathered from a **Pakistan State Oil (PSO)** retail station in August 2026. The study monitored **300 customer vehicles** over four distinct observation sessions (75 vehicles per session), recording:
* Mean vehicle inter-arrival time: **1.60 minutes** ($\lambda \approx 37.39\text{ to }37.50\text{ vehicles/hour}$)
* Mean attendant fueling time: **4.52 minutes** ($\mu \approx 13.27\text{ vehicles/hour}$)
* Mean observed driver waiting time: **4.42 minutes**
* Mean payment/exit duration: **1.17 minutes**
* Mean total site residency: **10.12 minutes**

When analyzed under a **single-server assumption**, this raw inflow rate exceeds the processing capability of a single dispenser ($\rho \approx 2.82 > 1.0$), demonstrating mathematical instability ($L_q \to \infty$). Because the physical PSO station maintained an observed waiting time of only 4.42 minutes, the study empirically proves that real stations maintain multiple parallel dispensers ($M/M/c$). The calculator uses this dataset to illustrate the operational necessity of multi-pump configurations while strictly evaluating single-server dynamics as required by the course syllabus.

---

## 4. Input Capabilities

The calculator provides bidirectional synchronization for arrival and service metrics, accepting inputs in whichever format the user possesses:

1. **Vehicle Arrival Specification**:
   * Average Inter-Arrival Time $E[A]$ (in minutes), **OR**
   * Arrival Rate $\lambda$ (in vehicles/hour).
   * *(G/G/1 only)* Arrival Standard Deviation $\sigma_A$ (in minutes).

2. **Fuel Attendant Service Specification**:
   * Average Service Time $E[S]$ (in minutes), **OR**
   * Service Rate $\mu$ (in vehicles/hour).
   * *(M/G/1 only)* Service Dispersion: either Service-Time Variance $\text{Var}(S)$ (in $\text{min}^2$) or Service Standard Deviation $\sigma_S$ (in minutes).
   * *(G/G/1 only)* Service Standard Deviation $\sigma_S$ (in minutes).

---

## 5. Outputs and Computed Metrics

Upon validation, the calculator computes and displays:

| Output Symbol | Metric Description | Primary Unit |
|---|---|---|
| $\lambda$ | Mean Arrival Rate | Vehicles / hour |
| $\mu$ | Mean Service Processing Rate | Vehicles / hour |
| $\rho$ | Traffic Intensity / Attendant Utilization | Ratio ($[0, 1)$ for stability) |
| **Status** | Stability State Assessment | `STABLE`, `CRITICAL`, or `UNSTABLE` |
| $L_q$ | Expected Number of Vehicles in Queue | Vehicles |
| $L$ | Expected Number of Vehicles in System (Queue + Pump) | Vehicles |
| $W_q$ | Expected Vehicle Waiting Time in Queue | Minutes (and Hours) |
| $W$ | Expected Total Vehicle Residency Time at Station | Minutes (and Hours) |
| $P_0$ | Attendant Idle Probability *(M/M/1 only)* | Probability / Percentage ($1 - \rho$) |
| $C_a, C_s$ | Coefficients of Variation *(G/G/1 only)* | Dimensionless ($\sigma / \text{Mean}$) |
| **Steps** | Substitution Steps & Pedagogical Derivations | LaTeX-style step cards |

If $\rho \ge 1.0$, the calculator refuses to output erroneous negative numbers (a common flaw in naive queue calculators), correctly evaluating $L_q, L, W_q, W$ as $\infty$ (`null`) and rendering an instability alert banner.

---

## 6. Supported Queueing Models

* **M/M/1**: Poisson arrival stream + Exponential service duration + 1 fuel attendant.
* **M/G/1**: Poisson arrival stream + General service duration with variance $\text{Var}(S)$ + 1 fuel attendant (evaluated via Pollaczek–Khinchine mean equation).
* **G/G/1**: General arrival distribution + General service distribution + 1 fuel attendant (evaluated via Kingman’s Heavy-Traffic Approximation).

*(Note: Multi-server models such as $M/M/c$ and finite buffer models such as $M/M/1/K$ are not currently implemented in the calculation engine and are documented in Chapter 15 as future extensions).*

---

## 7. Technology Stack Discovered in Project

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| Framework | Next.js | `16.4.0` | React App Router framework with Turbopack bundler |
| UI Library | React | `19.3.0` | Declarative user interface runtime |
| Language | TypeScript | `^5.0.0` | End-to-end type safety and domain modeling |
| Styling | TailwindCSS | `^4.0.0` | Utility-first CSS engine with dark palette tokens |
| Icons | Lucide React | `^1.52.0` | Visual symbols for vehicles, fuel pumps, gauges |
| Math Engine | Native TypeScript | N/A | Pure functional calculation logic (`src/lib/queueing`) |

---

## 8. Current Implementation Status

* **Status**: Complete, fully functional, and verified.
* All calculations execute deterministically on the client side with zero network latency.
* The codebase cleanly separates mathematical algorithms (`src/lib/queueing`) from presentation components (`src/components/`).

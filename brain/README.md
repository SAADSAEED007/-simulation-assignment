# Petrol Pump Queueing Calculator — Brain

> **Important Statement:**  
> This folder documents the reasoning, mathematical foundation, requirements, assumptions, implementation logic, and verification strategy behind the existing Petrol Pump Queueing Calculator. It is intended to make the engineering process transparent and understandable independently of the user interface.

---

## 1. Executive Summary

The **Petrol Pump Queueing Calculator** (implemented under the project package `pso-queue-analyzer`) is a specialized operations research and queueing theory software tool developed for academic simulation, coursework defense, and petrol station traffic flow analysis. 

The application evaluates vehicle waiting lines, attendant fueling operations, and server congestion at a single-server petrol dispensing pump under stochastic demand. It incorporates empirical observation data gathered from an actual **Pakistan State Oil (PSO)** station (August 2026 field observations covering 300 vehicles across 4 sessions) to illustrate how theoretical queueing equations model real-world vehicle arrivals and service bottlenecks.

### Supported Queueing Models
1. **M/M/1**: Poisson arrivals, exponential service times, single fuel attendant.
2. **M/G/1**: Poisson arrivals, general service distribution with user-specified service-time variance $\text{Var}(S)$ (Pollaczek–Khinchine formula).
3. **G/G/1**: General arrival distribution, general service distribution (Kingman’s Heavy-Traffic Approximation).

---

## 2. Structure of the `brain/` Documentation

This documentation suite is organized systematically to provide complete transparency into the engineering, mathematical, and architectural decisions of the project:

| Chapter | Document | Core Focus |
|---|---|---|
| **01** | [`01-project-overview.md`](file:///d:/single%20server%20project/brain/01-project-overview.md) | High-level summary, target use cases, technology stack, and current status |
| **02** | [`02-problem-understanding.md`](file:///d:/single%20server%20project/brain/02-problem-understanding.md) | Real-world petrol pump operations, arrival/service processes, and queue dynamics |
| **03** | [`03-requirements.md`](file:///d:/single%20server%20project/brain/03-requirements.md) | Exact functional and non-functional requirements implemented in the codebase |
| **04** | [`04-queueing-models.md`](file:///d:/single%20server%20project/brain/04-queueing-models.md) | Detailed breakdown of M/M/1, M/G/1, and G/G/1 theoretical foundations |
| **05** | [`05-mathematical-formulas.md`](file:///d:/single%20server%20project/brain/05-mathematical-formulas.md) | Canonical formulas, unit conversions, substitutions, and stability boundaries |
| **06** | [`06-inputs-and-outputs.md`](file:///d:/single%20server%20project/brain/06-inputs-and-outputs.md) | Comprehensive dictionary of all inputs, parameters, and derived metrics |
| **07** | [`07-calculation-logic.md`](file:///d:/single%20server%20project/brain/07-calculation-logic.md) | Execution pipeline from raw form state to validation, evaluation, and rendering |
| **08** | [`08-assumptions-and-limitations.md`](file:///d:/single%20server%20project/brain/08-assumptions-and-limitations.md) | Mathematical assumptions, physical station boundaries, and software constraints |
| **09** | [`09-validation-and-error-handling.md`](file:///d:/single%20server%20project/brain/09-validation-and-error-handling.md) | Input sanitization, domain rules, division-by-zero defense, and instability handling |
| **10** | [`10-testing-and-verification.md`](file:///d:/single%20server%20project/brain/10-testing-and-verification.md) | Verification proofs, manual checks, textbook benchmarks, and test strategies |
| **11** | [`11-architecture-and-code-structure.md`](file:///d:/single%20server%20project/brain/11-architecture-and-code-structure.md) | Directory architecture, module decomposition, separation of concerns, and data flow |
| **12** | [`12-design-decisions.md`](file:///d:/single%20server%20project/brain/12-design-decisions.md) | Rationale for analytical models, dual-input sync, and pedagogical UI elements |
| **13** | [`13-development-process.md`](file:///d:/single%20server%20project/brain/13-development-process.md) | Step-by-step engineering progression from queue problem study to delivery |
| **14** | [`14-example-calculations.md`](file:///d:/single%20server%20project/brain/14-example-calculations.md) | Fully worked manual examples for all 3 models plus the real PSO station case |
| **15** | [`15-future-improvements.md`](file:///d:/single%20server%20project/brain/15-future-improvements.md) | Roadmap for multi-server ($M/M/c$), finite buffers ($M/M/1/K$), and simulations |

---

## 3. Technology Stack Discovered in Project

* **Framework**: Next.js 16.4.0 (App Router architecture with React Server/Client Components)
* **Runtime / Core Library**: React 19.3.0
* **Language**: TypeScript 5 (Strict type checking, dedicated domain interface definitions)
* **Styling**: TailwindCSS v4 with `@tailwindcss/turbopack`
* **Iconography**: Lucide React (`lucide-react` v1.52.0)
* **State Management**: React functional state (`useState`) with immutable object updates
* **Domain Engine**: Pure TypeScript functional calculation modules with zero external math dependencies

---

## 4. Current Implementation Status

* **Status**: Complete, fully functional, and verified.
* **Core Calculator**: Active at route `/` with 4-step wizard interface (Model Selection $\rightarrow$ Data Entry $\rightarrow$ Calculation Trigger $\rightarrow$ Results Presentation).
* **System Schematic**: Dynamic reactive SVG flow showing queue accumulation, vehicle tokens, single-attendant pump dispenser, and departure states.
* **Pedagogical Step Display**: Collapsible step-by-step substitution breakdown displaying every formula, parameter substitution, intermediate value, and final metric for academic evaluation.
* **Empirical Dataset**: Pakistan State Oil reference card and one-click data loader integrated for demonstration.

# 11 — Architecture and Code Structure

This document maps the architectural topology, directory organization, separation of concerns, and component hierarchy of the **Petrol Pump Queueing Calculator**.

---

## 1. Architectural Philosophy: Decoupled Domain Architecture

The software is engineered with a strict boundary between **presentation** and **mathematical domain computation**:
* **Pure Mathematical Engine (`src/lib/queueing/`)**: Contains zero UI imports, zero React hooks, and zero DOM dependencies. Every module is a pure, side-effect-free TypeScript function that accepts numbers and returns structured calculation models.
* **Declarative Presentation Layer (`src/components/`, `src/app/`)**: Handles user input capture, reactive re-rendering, accessibility, responsive design, and smooth viewport transitions.
* **Empirical Repository (`src/data/`)**: Stores empirical observation records from the Pakistan State Oil study as immutable structured data.

```
┌─────────────────────────────────────────────────────────────────┐
│                       PRESENTATION LAYER                        │
│                                                                 │
│  src/app/page.tsx (State Orchestrator: form, results, errors)   │
│  ├── Navbar.tsx                                                 │
│  ├── Hero.tsx                                                   │
│  ├── CalculatorSection.tsx (4-Step Calculator + Result Cards)   │
│  ├── QueueVisualization.tsx (Dynamic SVG System Schematic)      │
│  ├── ModelExplanations.tsx (Reference Guide Cards)              │
│  ├── PSOStudySection.tsx (Empirical Observation Showcase)       │
│  └── Footer.tsx                                                 │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                 (Raw Form State: strings & types)
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DOMAIN / CALCULATION ENGINE                  │
│                      (src/lib/queueing/)                        │
│                                                                 │
│  index.ts (Facade: executeQueueCalculation)                     │
│  ├── validation.ts (Parser, Sanitizer, Bound Checks)            │
│  ├── conversions.ts (Unit Transformers, Scaling)                │
│  ├── stability.ts (Traffic Intensity & Asymptotic Checks)       │
│  ├── mm1.ts (M/M/1 Closed-Form Formulas & Steps)                │
│  ├── mg1.ts (Pollaczek–Khinchine M/G/1 Formulas & Steps)        │
│  └── gg1.ts (Kingman Heavy-Traffic G/G/1 Formulas & Steps)      │
└────────────────────────────────┬────────────────────────────────┘
                                 ▲
                                 │
                   (Static Observation Data)
                                 │
┌────────────────────────────────┴────────────────────────────────┐
│                    DATA & TYPES DEFINITIONS                     │
│                                                                 │
│  src/types/queueing.ts (ModelType, CalculatedResults, Steps)    │
│  src/data/psoDataset.ts (August 2026 PSO Observation Records)   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Directory Tree & File Inventory

```
d:\single server project\
│
├── public/                          # Static media assets
│   ├── images/hero-background.png   # Forecourt night photograph
│   ├── images/pso-logo.png          # Pakistan State Oil logo
│   └── zPSBnw.pdf                   # Academic study field document
│
├── src/
│   ├── app/                         # Next.js App Router Root
│   │   ├── globals.css              # Global styles & Tailwind imports
│   │   ├── layout.tsx               # Root HTML wrapper & fonts
│   │   └── page.tsx                 # Core page controller & state machine
│   │
│   ├── components/                  # User Interface Component Library
│   │   ├── calculator/
│   │   │   └── CalculatorSection.tsx # 4-step wizard & metric cards
│   │   ├── dataset/
│   │   │   └── PSOStudySection.tsx   # Empirical PSO study overview
│   │   ├── hero/
│   │   │   └── Hero.tsx              # Cinematic hero section
│   │   ├── layout/
│   │   │   ├── Navbar.tsx            # Sticky header navigation
│   │   │   └── Footer.tsx            # Academic metadata footer
│   │   ├── models/
│   │   │   └── ModelExplanations.tsx # Queueing model explanation cards
│   │   └── visualization/
│   │       └── QueueVisualization.tsx# Reactive SVG queue schematic
│   │
│   ├── data/
│   │   └── psoDataset.ts            # 300-vehicle observation dataset
│   │
│   ├── lib/
│   │   └── queueing/                # Pure mathematical engine
│   │       ├── conversions.ts       # Rate & time conversion helpers
│   │       ├── gg1.ts               # G/G/1 Kingman approximation
│   │       ├── index.ts             # Library entry point & dispatcher
│   │       ├── mg1.ts               # M/G/1 Pollaczek–Khinchine logic
│   │       ├── mm1.ts               # M/M/1 birth-death Markov logic
│   │       ├── stability.ts         # Stability assessment & classification
│   │       └── validation.ts        # Input validation & string parsing
│   │
│   └── types/
│       └── queueing.ts              # Domain interfaces & TypeScript types
│
├── package.json                     # Project manifest & dependencies
└── tsconfig.json                    # TypeScript compiler configuration
```

---

## 3. Detailed Component Breakdown

### 3.1 `src/app/page.tsx` (State Controller)
* **Role**: The centralized orchestrator for user interaction.
* **Managed States**:
  * `model`: Current active queueing model (`'MM1' | 'MG1' | 'GG1'`).
  * `formValues`: Raw string inputs for arrival, service, and variance.
  * `results`: Nullable `CalculatedResults` object.
  * `errors`: Record of field validation errors.
  * `psoLoadedFeedback`: Feedback banner text when preset data is loaded.
* **Key Handlers**:
  * `handleCalculate()`: Dispatches calculation to engine, updates state, and executes sequential smooth auto-scrolls down to `#step-4` (at 50ms) and `#system-schematic` (at 2200ms).
  * `handleModelChange()`: Switches active model and recalculates dynamically if valid inputs already exist.
  * `handleLoadPSOExample()`: Populates form with 1.60 min arrival, 4.52 min service, and 4.41 $\text{min}^2$ variance.

### 3.2 `src/components/calculator/CalculatorSection.tsx`
* **Role**: Primary calculation console.
* **Layout Structure**:
  * **Step 1**: Interactive 3-card model selector (`M/M/1`, `M/G/1`, `G/G/1`).
  * **Step 2**: Dual-column input card (Vehicle Arrival on left, Attendant Service on right) with live bidirectional rate-time synchronization and variance/stdDev selector.
  * **Step 3**: Large `"Calculate Queue"` action trigger.
  * **Step 4**: Results container with stability banner, 5 primary metric cards ($\rho, L_q, L, W_q, W$), and a collapsible `"Show Step-by-Step Calculation"` drawer.

### 3.3 `src/components/visualization/QueueVisualization.tsx`
* **Role**: Physical representation of the queueing system.
* **Features**:
  * Glowing neon accent bar with pulse animation.
  * Arriving vehicle stream labeled with $\lambda$ rate.
  * Driveway queue displaying discrete car badges up to $\min(5, \text{round}(L_q))$ (or an animated red overflow tag if $\rho \ge 1$).
  * Single attendant fuel pump dispenser with status indicators and $\mu$ capacity.
  * Departure stage reflecting total residency time $W$.

### 3.4 `src/components/models/ModelExplanations.tsx`
* **Role**: On-page textbook reference.
* Displays 3 comparative cards explaining the statistical foundation of M/M/1, M/G/1, and G/G/1 with direct `"Use in Calculator"` buttons that jump to the calculator.

### 3.5 `src/components/dataset/PSOStudySection.tsx`
* **Role**: Empirical reference showcase.
* Displays observational summary cards (300 vehicles, 4 sessions, $\lambda = 37.39$, $\mu = 13.27$, $W_q = 4.42\text{m}$, revenue PKR 576,300), an academic note explaining why $\rho = 2.82$ indicates multi-pump operation in reality, and a button to load the data into the calculator.

---

## 4. Unused / Placeholder Directories

Inspection of the project reveals three empty directories under `src/components/`:
* `src/components/comparison/` (Empty)
* `src/components/presentation/` (Empty)
* `src/components/whatif/` (Empty)

These represent optional modular stubs reserved during project setup but **not currently implemented or referenced** in `page.tsx`. All active UI functionality is fully contained within the active components documented above.

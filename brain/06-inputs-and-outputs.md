# 06 — Inputs and Outputs Dictionary

This document provides a dictionary of every input parameter collected by the interface and every output performance measure produced by the calculation engine.

---

## 1. Input Parameters Dictionary

### 1.1 `interArrivalTime` (Average Inter-Arrival Time)
* **Form Field**: `formValues.interArrivalTime`
* **Description**: The expected average elapsed time between the arrival of one vehicle and the next vehicle at the petrol pump station.
* **Unit**: Minutes ($\text{min}$).
* **Example**: `5.0` (means one vehicle arrives every 5 minutes on average).
* **Models Using It**: All models (`MM1`, `MG1`, `GG1`).
* **Why Needed**: Establishes the arrival frequency of vehicles. Converted internally to arrival rate $\lambda = 60 / \text{interArrivalTime}$.
* **Validation Rules**: Must be numeric, positive ($> 0$), and $\le 1000$ minutes. Either `interArrivalTime` or `arrivalRate` must be supplied.

### 1.2 `arrivalRate` (Vehicle Arrival Rate $\lambda$)
* **Form Field**: `formValues.arrivalRate`
* **Description**: The average count of vehicles entering the station per hour.
* **Unit**: Vehicles per hour ($\text{veh/hr}$).
* **Example**: `12.0` (means 12 vehicles arrive per hour).
* **Models Using It**: All models (`MM1`, `MG1`, `GG1`).
* **Why Needed**: Represents arrival parameter $\lambda$ in all queueing formulas. Synchronized with `interArrivalTime` via $\lambda = 60 / E[A]$.
* **Validation Rules**: Must be numeric, positive ($> 0$), and $\le 5000\text{ veh/hr}$.

### 1.3 `serviceTime` (Average Service Time)
* **Form Field**: `formValues.serviceTime`
* **Description**: The average continuous duration required for the fuel attendant to operate the pump nozzle, dispense the requested fuel quantity, collect payment, and clear the vehicle.
* **Unit**: Minutes ($\text{min}$).
* **Example**: `4.0` (means fueling takes 4 minutes per vehicle).
* **Models Using It**: All models (`MM1`, `MG1`, `GG1`).
* **Why Needed**: Quantifies server processing duration $E[S]$. Converted internally to service rate $\mu = 60 / \text{serviceTime}$.
* **Validation Rules**: Must be numeric, positive ($> 0$), and $\le 1000$ minutes. Either `serviceTime` or `serviceRate` must be supplied.

### 1.4 `serviceRate` (Attendant Service Rate $\mu$)
* **Form Field**: `formValues.serviceRate`
* **Description**: The maximum number of vehicles the single fuel attendant can service in one hour if operating continuously without idle time.
* **Unit**: Vehicles per hour ($\text{veh/hr}$).
* **Example**: `15.0` (means the attendant can fuel 15 vehicles per hour).
* **Models Using It**: All models (`MM1`, `MG1`, `GG1`).
* **Why Needed**: Directly dictates denominator of server utilization $\rho = \lambda / \mu$.
* **Validation Rules**: Must be numeric, positive ($> 0$), and $\le 5000\text{ veh/hr}$.

### 1.5 `serviceVarianceOption`
* **Form Field**: `formValues.serviceVarianceOption`
* **Type**: `'variance' | 'stdDev'`
* **Description**: UI toggle allowing the user to provide service-time dispersion as either variance ($\text{min}^2$) or standard deviation ($\text{min}$).
* **Models Using It**: `MG1`.

### 1.6 `serviceVariance` (Service-Time Variance $\text{Var}(S)$)
* **Form Field**: `formValues.serviceVariance`
* **Description**: The statistical variance measuring the spread of vehicle fueling times around the mean duration.
* **Unit**: Minutes squared ($\text{min}^2$).
* **Example**: `4.41` (corresponds to a standard deviation of $\sqrt{4.41} = 2.1\text{ min}$).
* **Models Using It**: `MG1`.
* **Why Needed**: In the Pollaczek–Khinchine equation, queueing delay is directly proportional to service variance.
* **Validation Rules**: Required when `serviceVarianceOption === 'variance'`. Must be non-negative ($\ge 0$).

### 1.7 `serviceStdDev` (Service Standard Deviation $\sigma_S$)
* **Form Field**: `formValues.serviceStdDev`
* **Description**: The standard deviation of fueling durations across different vehicles.
* **Unit**: Minutes ($\text{min}$).
* **Example**: `2.1` min.
* **Models Using It**: `MG1` (if stdDev selected) and `GG1` (mandatory).
* **Why Needed**: Used to compute second moment in M/G/1 and coefficient of variation $C_s = \sigma_S / E[S]$ in G/G/1.
* **Validation Rules**: Must be non-negative ($\ge 0$).

### 1.8 `arrivalStdDev` (Arrival Standard Deviation $\sigma_A$)
* **Form Field**: `formValues.arrivalStdDev`
* **Description**: The standard deviation of inter-arrival intervals between incoming vehicles.
* **Unit**: Minutes ($\text{min}$).
* **Example**: `1.30` min.
* **Models Using It**: `GG1` only.
* **Why Needed**: Used to compute arrival coefficient of variation $C_a = \sigma_A / E[A]$ in Kingman's Heavy-Traffic approximation.
* **Validation Rules**: Required for `GG1`. Must be non-negative ($\ge 0$).

---

## 2. Output Performance Measures Dictionary

### 2.1 `rho` ($\rho$ — Traffic Intensity / Utilization)
* **Interface Field**: `results.rho`
* **Type**: `number`
* **Format**: Displayed as decimal (e.g., `0.80`) and percentage (e.g., `80.0% server busy`).
* **Plain English Meaning**: The percentage of an operating hour during which the fuel attendant is actively dispensing fuel. The remaining percentage ($1 - \rho$) is idle time.

### 2.2 `status` & `isStable` (Stability State)
* **Interface Fields**: `results.status` (`'STABLE' | 'CRITICAL' | 'UNSTABLE'`) and `results.isStable` (`boolean`).
* **Visual Representation**: Color-coded banner (Emerald for Stable, Amber for Critical, Rose for Unstable).
* **Plain English Meaning**:
  * **STABLE**: Attendant capacity exceeds incoming traffic ($\rho < 1$). The queue stays finite.
  * **CRITICAL**: Traffic precisely equals maximum single-server capacity ($\rho = 1.0$). Steady-state equilibrium does not exist.
  * **UNSTABLE**: Vehicles arrive faster than the attendant can pump fuel ($\rho > 1$). The queue expands indefinitely.

### 2.3 `Lq` (Average Queue Length)
* **Interface Field**: `results.Lq`
* **Unit**: Vehicles.
* **Display**: E.g. `3.20` vehicles (or `∞` if unstable).
* **Plain English Meaning**: The average count of vehicles waiting in line behind the vehicle currently occupying the pump island.

### 2.4 `L` (Average Number of Vehicles in System)
* **Interface Field**: `results.L`
* **Unit**: Vehicles.
* **Display**: E.g. `4.00` vehicles (or `∞` if unstable).
* **Plain English Meaning**: The total vehicle load on the petrol station, combining all cars queued in the driveway plus the car currently receiving fuel.

### 2.5 `WqMin` (Average Waiting Time in Queue)
* **Interface Field**: `results.WqMin`
* **Unit**: Minutes.
* **Display**: E.g. `16.0m` (or `∞` if unstable).
* **Plain English Meaning**: The average delay in minutes that a driver endures from the moment of entering the station until the fuel nozzle is placed in their tank.

### 2.6 `WMin` (Average Total Time in System)
* **Interface Field**: `results.WMin`
* **Unit**: Minutes.
* **Display**: E.g. `20.0m` (or `∞` if unstable).
* **Plain English Meaning**: The complete customer turnaround time from entering the premises to completed departure ($W = W_q + \text{service time}$).

### 2.7 `idleProbabilityP0` (Attendant Idle Probability)
* **Interface Field**: `results.idleProbabilityP0`
* **Unit**: Fraction / Percentage ($0.0$ to $1.0$).
* **Models**: `MM1`.
* **Plain English Meaning**: The statistical probability that an arriving vehicle finds the pump completely empty with zero wait.

### 2.8 `Ca` and `Cs` (Coefficients of Variation)
* **Interface Fields**: `results.Ca`, `results.Cs`
* **Unit**: Dimensionless ratio.
* **Models**: `GG1` (and `Cs` in `MG1`).
* **Plain English Meaning**: The ratio of standard deviation to mean. Compares the irregularity of the process against an exponential distribution ($C = 1.0$).

### 2.9 `steps` (Step-by-Step Pedagogical Substitution Array)
* **Interface Field**: `results.steps`
* **Structure**: Array of `{ title, formula, substitution, result, explanation }` objects.
* **Plain English Meaning**: Formatted mathematical derivations displayed inside the collapsible `"Show Step-by-Step Calculation"` drawer, demonstrating the exact calculation trajectory for academic validation.

# 14 — Example Calculations & Worked Problems

This document provides four detailed, step-by-step worked examples using realistic petrol station operational data to demonstrate the mathematical mechanics of the calculator.

---

## Example 1: Standard Suburban Station (M/M/1 Model)

### 1. Operational Scenario
A single-pump suburban petrol station receives vehicles at an average inter-arrival interval of **5.0 minutes**. The attendant takes an average of **4.0 minutes** to fuel each vehicle. Both arrival and service durations are assumed to follow memoryless exponential distributions.

### 2. Input Data
* Average Inter-Arrival Time $E[A] = 5.0\text{ minutes}$
* Average Service Time $E[S] = 4.0\text{ minutes}$

### 3. Step-by-Step Derivation

#### Step 1: Rates Conversion
$$\lambda = \frac{60}{E[A]} = \frac{60}{5.0} = 12.00\text{ vehicles/hour}$$
$$\mu = \frac{60}{E[S]} = \frac{60}{4.0} = 15.00\text{ vehicles/hour}$$

#### Step 2: Traffic Intensity ($\rho$)
$$\rho = \frac{\lambda}{\mu} = \frac{12.00}{15.00} = 0.800$$
* **Evaluation**: Since $\rho = 0.80 < 1.0$, the system is **STABLE**. The fuel attendant is busy 80% of the time and idle 20% of the time.

#### Step 3: Expected Number of Vehicles in Queue ($L_q$)
$$L_q = \frac{\rho^2}{1 - \rho} = \frac{0.80^2}{1 - 0.80} = \frac{0.64}{0.20} = 3.20\text{ vehicles}$$

#### Step 4: Expected Total Number of Vehicles at Station ($L$)
$$L = \frac{\rho}{1 - \rho} = \frac{0.80}{0.20} = 4.00\text{ vehicles}$$
*(Check: $L = L_q + \rho = 3.20 + 0.80 = 4.00\text{ vehicles}$)*

#### Step 5: Expected Waiting Time in Queue ($W_q$)
$$W_{q,\text{hours}} = \frac{L_q}{\lambda} = \frac{3.20}{12.00} = 0.2667\text{ hours}$$
$$W_{q,\text{min}} = W_{q,\text{hours}} \times 60 = 0.2667 \times 60 = 16.0\text{ minutes}$$

#### Step 6: Expected Total Time on Site ($W$)
$$W_{\text{min}} = W_{q,\text{min}} + E[S]_{\text{min}} = 16.0 + 4.0 = 20.0\text{ minutes}$$
$$W_{\text{hours}} = \frac{20.0}{60} = 0.3333\text{ hours}$$

#### Step 7: Attendant Idle Probability ($P_0$)
$$P_0 = 1 - \rho = 1 - 0.80 = 0.200 \quad (20.0\%)$$

### 4. Practical Interpretation
* A driver entering the station can expect to wait **16.0 minutes** in line before reaching the fuel pump.
* The driver will spend a total turnaround duration of **20.0 minutes** on the station premises.
* On average, an observer will see **3.2 vehicles waiting** in the driveway and **4.0 total vehicles** on site.
* An arriving vehicle has a **20% probability** of finding the pump immediately empty.

---

## Example 2: Fueling Variance Sensitivity (M/G/1 Model)

### 1. Operational Scenario
A highway fuel station receives Poisson arrivals at rate $\lambda = 10.0\text{ veh/hr}$ ($E[A] = 6.0\text{ min}$). Fueling takes an average of $E[S] = 4.0\text{ min}$ ($\mu = 15.0\text{ veh/hr}$). Because customer vehicles range from compact cars to large commercial trucks, fueling times exhibit a variance of $\text{Var}(S) = 4.0\text{ min}^2$ ($\sigma_S = 2.0\text{ min}$).

### 2. Input Data
* $E[A] = 6.0\text{ min} \implies \lambda = 10.0\text{ veh/hr}$
* $E[S] = 4.0\text{ min} \implies \mu = 15.0\text{ veh/hr}$
* $\text{Var}(S) = 4.0\text{ min}^2$

### 3. Step-by-Step Derivation

#### Step 1: Traffic Intensity ($\rho$)
$$\rho = \frac{\lambda}{\mu} = \frac{10.0}{15.0} = 0.667$$
* **Evaluation**: Stable ($66.7\%$ attendant utilization).

#### Step 2: Time Scaling & Second Moment ($E[S^2]$)
$$E[S]_{\text{hours}} = \frac{4.0}{60} = 0.0667\text{ hours}$$
$$\text{Var}(S)_{\text{hours}^2} = \frac{4.0}{3600} = 0.001111\text{ hours}^2$$
$$E[S^2] = \text{Var}(S) + (E[S])^2 = 0.001111 + (0.0667)^2 = 0.001111 + 0.004444 = 0.005556\text{ hours}^2$$

#### Step 3: Pollaczek–Khinchine Waiting Time ($W_q$)
$$W_{q,\text{hours}} = \frac{\lambda \cdot E[S^2]}{2(1 - \rho)} = \frac{10.0 \times 0.005556}{2(1 - 0.6667)} = \frac{0.05556}{0.6667} = 0.0833\text{ hours}$$
$$W_{q,\text{min}} = 0.0833 \times 60 = 5.0\text{ minutes}$$

#### Step 4: System Queue Lengths (Little’s Law)
$$L_q = \lambda \cdot W_{q,\text{hours}} = 10.0 \times 0.0833 = 0.83\text{ vehicles}$$
$$W_{\text{min}} = W_{q,\text{min}} + E[S]_{\text{min}} = 5.0 + 4.0 = 9.0\text{ minutes}$$
$$L = \lambda \cdot W_{\text{hours}} = 10.0 \times \frac{9.0}{60} = 1.50\text{ vehicles}$$

### 4. Comparison with Zero-Variance (Deterministic $M/D/1$)
If the station installed an automated robot dispenser with constant 4.0-minute fueling ($\text{Var}(S) = 0$):
$$E[S^2] = (0.0667)^2 = 0.004444\text{ hours}^2$$
$$W_{q,\text{hours}} = \frac{10.0 \times 0.004444}{2(1 - 0.6667)} = \frac{0.04444}{0.6667} = 0.0667\text{ hours} \implies W_{q,\text{min}} = 4.0\text{ minutes}$$
* **Insight**: Eliminating fueling variance reduces waiting delay by 20% (from 5.0 min to 4.0 min), proving that service consistency directly improves customer experience.

---

## Example 3: General Distribution Traffic (G/G/1 Model)

### 1. Operational Scenario
An urban fuel station is situated downstream of a coordinated traffic signal. Because vehicles arrive in regulated platoons, arrival variability is low ($\sigma_A = 2.5\text{ min}$ for $E[A] = 5.0\text{ min}$). Attendant fueling times have mean $E[S] = 4.0\text{ min}$ with standard deviation $\sigma_S = 2.0\text{ min}$.

### 2. Input Data
* $E[A] = 5.0\text{ min} \implies \lambda = 12.0\text{ veh/hr}$
* $E[S] = 4.0\text{ min} \implies \mu = 15.0\text{ veh/hr}$
* $\sigma_A = 2.5\text{ min}$
* $\sigma_S = 2.0\text{ min}$

### 3. Step-by-Step Derivation

#### Step 1: Coefficients of Variation ($C_a$ and $C_s$)
$$C_a = \frac{\sigma_A}{E[A]} = \frac{2.5}{5.0} = 0.50 \implies C_a^2 = 0.25$$
$$C_s = \frac{\sigma_S}{E[S]} = \frac{2.0}{4.0} = 0.50 \implies C_s^2 = 0.25$$
$$\text{Variance Factor} = \frac{C_a^2 + C_s^2}{2} = \frac{0.25 + 0.25}{2} = 0.250$$

#### Step 2: Kingman’s Heavy-Traffic Approximation
$$\rho = \frac{12.0}{15.0} = 0.80$$
$$W_{q,\text{min}} \approx \left(\frac{\rho}{1 - \rho}\right) \times \left(\frac{C_a^2 + C_s^2}{2}\right) \times E[S]_{\text{min}}$$
$$W_{q,\text{min}} \approx \left(\frac{0.80}{1 - 0.80}\right) \times 0.250 \times 4.0 = \left(\frac{0.80}{0.20}\right) \times 1.0 = 4.0 \times 1.0 = 4.0\text{ minutes}$$
$$W_{q,\text{hours}} = \frac{4.0}{60} = 0.0667\text{ hours}$$

#### Step 3: Queue & System Measures
$$L_q = \lambda \cdot W_{q,\text{hours}} = 12.0 \times 0.0667 = 0.80\text{ vehicles}$$
$$W_{\text{min}} = W_{q,\text{min}} + E[S] = 4.0 + 4.0 = 8.0\text{ minutes}$$
$$L = \lambda \cdot W_{\text{hours}} = 12.0 \times \frac{8.0}{60} = 1.60\text{ vehicles}$$

### 4. Practical Interpretation
* Under an exponential M/M/1 model (where $C_a = 1.0, C_s = 1.0$), queue delay was 16.0 minutes (Example 1).
* Under G/G/1 with regulated arrival and service streams ($C_a = 0.5, C_s = 0.5$), queue delay drops to **4.0 minutes**—a 75% reduction in waiting time solely attributable to lower stochastic variability!

---

## Example 4: The Empirical PSO Real Dataset Case (Instability Demonstration)

### 1. Operational Scenario
Field researchers observed 300 vehicles at a Pakistan State Oil (PSO) retail station in August 2026. The raw empirical averages were:
* Mean inter-arrival time: **1.60 minutes**
* Mean attendant fueling duration: **4.52 minutes**

### 2. Input Data
* $E[A] = 1.60\text{ min} \implies \lambda = \frac{60}{1.60} = 37.50\text{ veh/hr}$
* $E[S] = 4.52\text{ min} \implies \mu = \frac{60}{4.52} = 13.27\text{ veh/hr}$

### 3. Step-by-Step Derivation

#### Step 1: Traffic Intensity Check
$$\rho = \frac{\lambda}{\mu} = \frac{37.50}{13.27} \approx 2.826$$

#### Step 2: Stability Assessment
* **Condition Check**: $\rho = 2.826 \gg 1.0$.
* **Mathematical State**: **UNSTABLE SINGLE-SERVER SYSTEM**.
* Inflow demand exceeds single-attendant throughput by $(2.826 - 1.0) \times 100 = 182.6\%$.

#### Step 3: Output Evaluation
$$\text{Denominator } (1 - \rho) = 1 - 2.826 = -1.826 < 0$$
$$L_q \to \infty, \quad W_q \to \infty$$
* The calculator returns `null` for numerical metrics and renders **`∞`** on the display cards.

### 4. Practical Academic Conclusion
* A single fuel attendant would experience continuous queue overflow, accumulating an additional $(\lambda - \mu) = 37.50 - 13.27 = 24.23$ queued cars every hour.
* The physical PSO station actually exhibited an average waiting time of **4.42 minutes**, which conclusively proves that the station was operating **at least 3 to 4 dispensers in parallel** ($c \ge 3$). This demonstration validates the mathematical limits of single-server queueing theory.

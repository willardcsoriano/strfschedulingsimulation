# ⏱️ SRTF-100Job-Stochastic-Analysis

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
![Status](https://img.shields.io/badge/status-active-success.svg)

## Project Overview

This project provides a **web-based simulation and statistical analysis** of the **Shortest Remaining Time First (SRTF)** CPU scheduling algorithm. The simulation evaluates SRTF performance when handling a **large, randomized workload of 100 jobs**, focusing on:

- **Average Waiting Time (AWT)**
- **Average Turnaround Time (ATT)**

SRTF is a **preemptive algorithm** that always executes the process with the **shortest remaining burst time**, making it one of the most optimal algorithms for reducing waiting time.

🔗 **Live Demo:** https://willardcsoriano.github.io/SRTF-100Job-Stochastic-Analysis/

---

## 📖 Table of Contents
- [Simulation Parameters](#simulation-parameters)  
- [Key Features](#key-features)  
- [How It Works](#how-it-works)  
- [Installation](#installation)  
- [Usage](#usage)  
- [Example Output](#example-output)  
- [Technologies Used](#technologies-used)  
- [Project Structure](#project-structure)  
- [License](#license)  

---

## 📊 Simulation Parameters

**Job Count:** 100 randomized processes  
**Burst Time (BT):** 1–10 time units  
**Arrival Time (AT):** 1–7 time units  
**Preemption:** Enabled (SRTF behavior)  

Each simulation run produces a unique dataset, making the tool useful for stochastic performance analysis.

---

## ✨ Key Features

- **Automated Large-Scale Job Generation**  
  Generates 100 jobs per run with randomized arrival and burst times.

- **Accurate SRTF Preemptive Logic**  
  The scheduler always selects the job with the shortest remaining burst time.

- **Full Metric Computation**  
  For every job:
  - Completion Time (CT)  
  - Turnaround Time (TAT)  
  - Waiting Time (WT)  
  - Averages for WT and TAT across all jobs  

- **Interactive Data Table**  
  Sortable columns: Job ID, AT, BT, CT, TAT, WT.

- **Dynamic Gantt Chart Visualization**  
  Shows execution order, preemptions, and idle times.

- **Explanatory Panels**  
  Includes algorithm walkthrough and column definitions.

---

## 🧠 How It Works

The SRTF engine performs a time-driven simulation:

1. At each unit of time `t`, all jobs with `AT ≤ t` enter the **ready queue**.
2. The algorithm selects the job with the **minimum remaining burst time**.
3. Execution proceeds for 1 unit.  
4. If a new job arrives with a shorter remaining time, the current job is **preempted**.
5. The Gantt Chart logs all CPU activity (including idle periods).
6. After all jobs finish, the system computes the final statistics.

---

## ⚙️ Installation

Clone the repository:

```bash
git clone https://github.com/willardcsoriano/SRTF-100Job-Stochastic-Analysis.git
cd SRTF-100Job-Stochastic-Analysis
```

Then simply open `index.html` in a browser, or run a lightweight local server:

```bash
# Python 3
python -m http.server 8000
```

Visit:  
`http://localhost:8000`

---

## 🚀 Usage

1. Open the web interface.  
2. Click **“Run 100-Job Simulation”**.  
3. The following will appear:
   - Job table with all computed metrics  
   - Average Waiting Time & Turnaround Time  
   - Gantt Chart of CPU execution  
4. Optionally enable **Explanations** for a detailed breakdown of:
   - Column definitions  
   - SRTF logic  
   - Real-world relevance  

Each click generates a **new randomized dataset**.

---

## 📈 Example Output

A typical result displays:

- **Avg. Waiting Time (e.g., ~7.82)**  
- **Avg. Turnaround Time (e.g., ~13.21)**  
- **Complete Gantt Chart** showing preemptions  
- **100-row results table**

> Output varies each run because job parameters are random.

---

## 🛠️ Technologies Used

- **HTML5** – Structure  
- **CSS / TailwindCSS** – Styling + Responsive layout  
- **JavaScript (ES Modules)** – Simulation logic  
- **MathJax** – TeX-style math rendering  
- **GitHub Pages** – Deployment  

---

## 📁 Project Structure

```
SRTF-100Job-Stochastic-Analysis/
│
├── index.html
├── favicon.ico
├── README.md
│
├── css/
│   └── styles.css
│
└── js/
    ├── main.js
    │
    ├── core/
    │   ├── metrics.js
    │   └── srtf.js
    │
    ├── models/
    │   └── Process.js
    │
    └── ui/
        ├── domEvents.js
        ├── ganttRenderer.js
        ├── summaryRenderer.js
        └── tableRenderer.js
```

---

## 📜 License

This project is licensed under the **MIT License**.  
See the full license text in the [LICENSE](LICENSE) file.

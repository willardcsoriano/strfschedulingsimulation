# ⏱️ SRTF-100Job-Stochastic-Analysis

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
![Status](https://img.shields.io/badge/status-active-success.svg)

## Project Overview

This is a **web-based simulation and statistical analysis** of the **Shortest Remaining Time First (SRTF)** CPU scheduling algorithm. The primary goal is to assess the average performance metrics (Average Waiting Time and Average Turnaround Time) when scheduling a **large, randomized load of 100 jobs**.

SRTF is a **preemptive** algorithm designed to minimize average waiting time by always executing the process with the shortest time *remaining* until completion.

🔗 **Live Demo:** [SRTF Scheduling Simulation](https://willardcsoriano.github.io/strfschedulingsimulation/)

---

## 📖 Table of Contents

- [Simulation Parameters](#-simulation-parameters)
- [Key Features](#-key-features)
- [How It Works](#-how-it-works)
- [Installation](#-installation)
- [Usage](#-usage)
- [Example Output](#-example-output)
- [Contributing](#-contributing)
- [License](#-license)

---

## 📊 Simulation Parameters

The simulation adheres to the following constraints for generating the 100 jobs:

* **Total Jobs:** 100
* **Burst Time (BT):** Randomly generated between **1 and 10** time units.
* **Arrival Time (AT):** Randomly generated between **1 and 7** time units.

---

## ✨ Key Features

* **Large-Scale Simulation:** Automatically generates and processes **100 randomized jobs** for meaningful statistical analysis.
* **Core SRTF Logic:** Implements the **preemptive** Shortest Remaining Time First (SRTF) algorithm.
* **Metric Calculation:** Computes **Completion Time (CT)**, **Turnaround Time (TAT)**, and **Waiting Time (WT)** for every job, culminating in the overall **Average Waiting Time** and **Average Turnaround Time**.
* **Data Presentation:** Displays results in a clean, comprehensive, and **sortable table**.
* **Sorting Options:** Supports dynamic sorting by Job ID, Arrival Time, Burst Time, Completion Time, Turnaround Time, and Waiting Time.

---

## 🧠 How It Works

The simulation runs time-step by time-step:

1.  At each time unit $t$, the algorithm checks the **Ready Queue** for all jobs that have arrived (where $AT \le t$).
2.  The job currently in the Ready Queue with the **minimum Remaining Burst Time** is selected to run.
3.  If a new job arrives at time $t$ that has a shorter remaining burst time than the currently running job, the running job is **preempted** (interrupted).
4.  The Gantt Chart visualizes the sequence of execution and preemption across the entire timeline. 

---

## ⚙️ Installation

To run this simulation locally, clone the repository and navigate to the project directory:

```bash
git clone [https://github.com/willardcsoriano/SRTF-100Job-Stochastic-Analysis.git](https://github.com/willardcsoriano/SRTF-100Job-Stochastic-Analysis.git)
cd SRTF-100Job-Stochastic-Analysis

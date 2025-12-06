// ==========================
// Process Class
// ==========================
// This class represents a single “process” (job) in the CPU scheduling simulation.
// Each process has:
//  - pid: process ID number
//  - bt: burst time (how long it requires the CPU)
//  - art: arrival time (when it enters the system)
class Process {
    constructor(pid, bt, art) {
        this.pid = pid;    // Unique Process ID
        this.bt = bt;      // Burst Time (execution time required)
        this.art = art;    // Arrival Time (when the job enters the queue)
    }
}

// ===================================================
// Global Arrays used for storing simulation results
// ===================================================
let globalProc = [];   // Stores all randomly generated processes
let globalResults = []; // Stores the final table of process results
let globalGantt = [];  // Stores entries for the Gantt chart visualization


// ==========================================================================
// FUNCTION: findWaitingTime()
// PURPOSE: Computes waiting times using the SRTF (Shortest Remaining Time First) algorithm.
// Also generates the Gantt chart data (execution timeline).
//
// NOTE: This function performs the actual SRTF scheduling simulation.
// ==========================================================================
function findWaitingTime(proc, n, wt) {
    
    // rt[] will store *remaining time* for each process
    let rt = new Array(n);
    for (let i = 0; i < n; i++) rt[i] = proc[i].bt;

    let complete = 0;   // Number of processes finished
    let t = 0;          // Current time
    globalGantt = [];   // Reset Gantt chart storage

    while (complete !== n) {

        let minm = Number.MAX_VALUE;  // Track smallest remaining time found
        let shortest = -1;            // Index of shortest job available
        let check = false;            // Indicates that at least 1 process is ready

        // ----------------------
        // Find the shortest job
        // ----------------------
        for (let j = 0; j < n; j++) {
            if ((proc[j].art <= t) && (rt[j] < minm) && rt[j] > 0) {
                minm = rt[j];
                shortest = j;
                check = true;
            }
        }

        // ------------------------------------------------------------------
        // If NO job is ready at the current time -> CPU is idle (no process)
        // ------------------------------------------------------------------
        if (check === false) {
            // Record idle time in Gantt chart
            if (globalGantt.length === 0 || globalGantt[globalGantt.length - 1].pid !== -1) {
                 globalGantt.push({ pid: -1, start: t, end: t + 1 });
            } else {
                 globalGantt[globalGantt.length - 1].end++;
            }
            t++; 
            continue;
        }

        // -------------------------------------------------
        // Execute the shortest process for ONE time unit
        // -------------------------------------------------
        rt[shortest]--;   // Reduce remaining time

        const currentPid = proc[shortest].pid;

        // Log this execution segment in Gantt chart
        if (globalGantt.length === 0 || globalGantt[globalGantt.length - 1].pid !== currentPid) {
            globalGantt.push({ pid: currentPid, start: t, end: t + 1 });
        } else {
            globalGantt[globalGantt.length - 1].end++;
        }

        // -----------------------------------------------------
        // If process finishes at this moment, calculate WT
        // -----------------------------------------------------
        if (rt[shortest] === 0) {
            complete++;
            let finish_time = t + 1;

            // WT = CT - BT - AT
            wt[shortest] = finish_time - proc[shortest].bt - proc[shortest].art;

            // Negative WT means the process never had to wait
            if (wt[shortest] < 0) wt[shortest] = 0;
        }

        t++; // Move time forward
    }
}


// ==========================================================================
// FUNCTION: findTurnAroundTime()
// PURPOSE: TAT = BT + WT for each process
// ==========================================================================
function findTurnAroundTime(proc, n, wt, tat) {
    for (let i = 0; i < n; i++) {
        tat[i] = proc[i].bt + wt[i];
    }
}


// ==========================================================================
// FUNCTION: findavgTime()
// PURPOSE: Overall function that:
//   1. calculates waiting time
//   2. calculates turnaround time
//   3. calculates completion time
//   4. stores results into globalResults
//   5. displays output on webpage
// ==========================================================================
function findavgTime(proc, n) {
    
    let wt = new Array(n).fill(0);
    let tat = new Array(n).fill(0);

    // Perform SRTF simulation
    findWaitingTime(proc, n, wt);

    // Compute Turnaround time
    findTurnAroundTime(proc, n, wt, tat);

    // Build final dataset for display
    globalResults = proc.map((p, i) => ({
        pid: p.pid,
        art: p.art,
        bt: p.bt,
        wt: wt[i],
        tat: tat[i],
        ct: tat[i] + p.art // Completion time formula
    }));
    
    // Render results in HTML
    displayResults(globalResults);
}


// ==========================================================================
// FUNCTION: displayResults()
// PURPOSE: Create and inject HTML showing:
//   ✔ Summary statistics
//   ✔ Gantt chart
//   ✔ Full table of all processes
// ==========================================================================
function displayResults(results) {
    const resultsDiv = document.getElementById('results');

    // ---- Compute statistics for summary cards ----
    const total_wt = results.reduce((sum, p) => sum + p.wt, 0);
    const total_tat = results.reduce((sum, p) => sum + p.tat, 0);
    const avgWT = total_wt / results.length;
    const avgTAT = total_tat / results.length;

    let htmlContent = "";

    // -------------------------------------------
    // SUMMARY CARD
    // -------------------------------------------
    htmlContent += `
        <div class="bg-primary text-white p-6 rounded-lg shadow-xl mb-8">
            <h2 class="text-2xl font-bold mb-4 text-center">Summary Statistics</h2>

            <div class="flex justify-around">
                <div class="text-center">
                    <p class="text-4xl font-extrabold">${avgWT.toFixed(2)}</p>
                    <p class="text-lg">Avg. Waiting Time (WT)</p>
                </div>

                <div class="text-center">
                    <p class="text-4xl font-extrabold">${avgTAT.toFixed(2)}</p>
                    <p class="text-lg">Avg. Turnaround Time (TAT)</p>
                </div>
            </div>
        </div>
    `;

    // -------------------------------------------
    // GANTT CHART SECTION
    // -------------------------------------------
    htmlContent += `
        <div class="bg-white shadow-xl rounded-lg p-6 mb-8">
            <h2 class="text-xl font-semibold text-gray-700 mb-4">Gantt Chart (First 20 Time Units)</h2>
            ${createGanttChartHTML()}
        </div>
    `;

    // -------------------------------------------
    // FULL TABLE OF PROCESSES
    // -------------------------------------------
    htmlContent += `
        <div class="bg-white shadow-xl rounded-lg p-6 overflow-x-auto">
            <h2 class="text-xl font-semibold text-gray-700 mb-4">Detailed Process Table</h2>

            <div class="max-h-96 overflow-y-auto">
            <table class="w-full text-sm text-left text-gray-500">
                <thead class="bg-gray-50 sticky-header">
                    <tr>
                        <th class="px-6 py-3 cursor-pointer" onclick="sortResults('Job')">Job</th>
                        <th class="px-6 py-3 cursor-pointer" onclick="sortResults('Arrival')">Arrival</th>
                        <th class="px-6 py-3 cursor-pointer" onclick="sortResults('Burst')">Burst</th>
                        <th class="px-6 py-3 cursor-pointer" onclick="sortResults('Completion')">Completion</th>
                        <th class="px-6 py-3 cursor-pointer" onclick="sortResults('Turnaround')">TAT</th>
                        <th class="px-6 py-3 cursor-pointer" onclick="sortResults('Waiting')">WT</th>
                    </tr>
                </thead>

                <tbody>
    `;

    // Add each row in the results table
    results.forEach((p, index) => {
        const rowColor = index % 2 === 0 ? "bg-white" : "bg-gray-50";
        htmlContent += `
            <tr class="${rowColor} border-b text-center">
                <td class="px-6 py-2">P${p.pid}</td>
                <td class="px-6 py-2">${p.art}</td>
                <td class="px-6 py-2">${p.bt}</td>
                <td class="px-6 py-2">${p.ct}</td>
                <td class="px-6 py-2 font-semibold">${p.tat}</td>
                <td class="px-6 py-2 text-secondary font-semibold">${p.wt}</td>
            </tr>
        `;
    });

    htmlContent += `
                </tbody>
            </table>
            </div>
        </div>
    `;

    // Inject everything into webpage
    resultsDiv.innerHTML = htmlContent;
}



// ==========================================================================
// FUNCTION: createGanttChartHTML()
// PURPOSE: Builds the visual Gantt chart using globalGantt[] data
// ==========================================================================
function createGanttChartHTML() {
    const MAX_TIME = 20; // Only show first 20 time units for readability

    let ganttChartHTML = '<div class="gantt-chart-container">';
    ganttChartHTML += '<div class="gantt-chart">';

    // Predefined colors for processes
    const colors = [
        'bg-red-500', 'bg-emerald-500', 'bg-indigo-500',
        'bg-yellow-500', 'bg-purple-500', 'bg-pink-500',
        'bg-teal-500', 'bg-cyan-500', 'bg-orange-500'
    ];

    let totalTimeBlocks = 0;

    // Generate each bar segment
    globalGantt.forEach(block => {
        if (block.start < MAX_TIME) {
            const duration = Math.min(block.end, MAX_TIME) - block.start;
            if (duration <= 0) return;

            const widthPercent = (duration / MAX_TIME) * 100;

            let blockClass = "";
            let label = "";

            if (block.pid === -1) {
                blockClass = "bg-gray-400"; // idle time
                label = "Idle";
            } else {
                const colorIndex = (block.pid - 1) % colors.length;
                blockClass = colors[colorIndex];
                label = `P${block.pid}`;
            }

            ganttChartHTML += `
                <div class="gantt-block ${blockClass}" style="width: ${widthPercent}%;">
                    <span>${label} (${duration})</span>
                </div>
            `;
        }
    });

    ganttChartHTML += '</div>'; // end gantt-chart

    // Time Axis
    ganttChartHTML += '<div class="time-axis">';
    ganttChartHTML += `<div class="time-label" style="transform: translateX(50%);">0</div>`;

    globalGantt.forEach(block => {
        if (block.start < MAX_TIME) {
            const duration = Math.min(block.end, MAX_TIME) - block.start;
            const widthPercent = (duration / MAX_TIME) * 100;
            const endTime = Math.min(block.end, MAX_TIME);

            ganttChartHTML += `<div class="time-label" style="width:${widthPercent}%"></div>`;
            ganttChartHTML += `<div class="time-label" style="transform: translateX(50%);">${endTime}</div>`;
        }
    });

    ganttChartHTML += '</div></div>';

    return ganttChartHTML;
}


// ==========================================================================
// FUNCTION: simulateSRTF()
// PURPOSE: Creates 100 random processes and starts simulation
// ==========================================================================
function simulateSRTF() {

    const numJobs = 100;
    globalProc = [];

    // Generate 100 random processes
    for (let i = 0; i < numJobs; i++) {
        const burstTime = Math.floor(Math.random() * 10) + 1; // 1–10
        const arrivalTime = Math.floor(Math.random() * 7) + 1; // 1–7
        globalProc.push(new Process(i + 1, burstTime, arrivalTime));
    }

    // Sort by arrival time (SRTF requires this)
    globalProc.sort((a, b) => a.art - b.art);

    // Begin simulation
    findavgTime(globalProc, globalProc.length);
}


// ==========================================================================
// FUNCTION: sortResults()
// PURPOSE: Sort table by selected column
// ==========================================================================
function sortResults(criteria) {
    
    let sortedResults = [...globalResults];
    let key;

    // Determine which property to sort by
    if (criteria === 'Job') key = 'pid';
    else if (criteria === 'Arrival') key = 'art';
    else if (criteria === 'Burst') key = 'bt';
    else if (criteria === 'Completion') key = 'ct';
    else if (criteria === 'Turnaround') key = 'tat';
    else if (criteria === 'Waiting') key = 'wt';

    sortedResults.sort((a, b) => a[key] - b[key]);

    displayResults(sortedResults);
}


// ==========================================================================
// ADD BEHAVIOR TO "Show Explanations" BUTTON
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {

    const toggleButton = document.getElementById('toggleExplanations');
    const explanationsDiv = document.getElementById('explanations');

    toggleButton.addEventListener('click', () => {
        
        explanationsDiv.classList.toggle('hidden');

        // Update button text
        toggleButton.textContent = explanationsDiv.classList.contains('hidden')
            ? 'Show Explanations'
            : 'Hide Explanations';
    });
});

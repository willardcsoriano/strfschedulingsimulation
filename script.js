class Process {
    constructor(pid, bt, art) {
        this.pid = pid;    // Process ID
        this.bt = bt;      // Burst Time
        this.art = art;    // Arrival Time
    }
}

// Global storage for the simulation data
let globalProc = [];
let globalResults = [];
let globalGantt = []; // Stores the execution log for the Gantt chart

/**
 * Finds the waiting time for all processes and generates the Gantt log.
 * (Core simulation logic remains identical to your previous code)
 */
function findWaitingTime(proc, n, wt) {
    let rt = new Array(n);
    for (let i = 0; i < n; i++) rt[i] = proc[i].bt;
    
    let complete = 0, t = 0;
    
    globalGantt = [];

    while (complete !== n) {
        let minm = Number.MAX_VALUE;
        let shortest = -1; 
        let check = false;

        // Find the process with the shortest remaining time
        for (let j = 0; j < n; j++) {
            if ((proc[j].art <= t) && (rt[j] < minm) && rt[j] > 0) {
                minm = rt[j];
                shortest = j;
                check = true;
            }
        }

        // CPU Idle or no process ready
        if (check === false) {
            // Log idle time
            if (globalGantt.length === 0 || globalGantt[globalGantt.length - 1].pid !== -1) {
                 globalGantt.push({ pid: -1, start: t, end: t + 1 });
            } else {
                 globalGantt[globalGantt.length - 1].end++;
            }
            t++;
            continue;
        }

        // Execute the shortest job for one unit of time
        rt[shortest]--;
        
        // Log the execution for Gantt
        const currentPid = proc[shortest].pid;
        if (globalGantt.length === 0 || globalGantt[globalGantt.length - 1].pid !== currentPid) {
            globalGantt.push({ pid: currentPid, start: t, end: t + 1 });
        } else {
            globalGantt[globalGantt.length - 1].end++;
        }

        // Check if the process completed
        if (rt[shortest] === 0) {
            complete++;
            let finish_time = t + 1; 
            
            // Calculate Waiting Time (WT = CT - BT - AT)
            wt[shortest] = finish_time - proc[shortest].bt - proc[shortest].art;
            if (wt[shortest] < 0) wt[shortest] = 0; 
        }
        
        t++;
    }
}

function findTurnAroundTime(proc, n, wt, tat) {
    // TAT = BT + WT
    for (let i = 0; i < n; i++) tat[i] = proc[i].bt + wt[i];
}

function findavgTime(proc, n) {
    let wt = new Array(n).fill(0), tat = new Array(n).fill(0);
    
    findWaitingTime(proc, n, wt);
    findTurnAroundTime(proc, n, wt, tat);

    globalResults = proc.map((p, i) => ({
        pid: p.pid,
        art: p.art,
        bt: p.bt,
        wt: wt[i],
        tat: tat[i],
        ct: tat[i] + p.art, // Completion Time
    }));
    
    displayResults(globalResults);
}

/**
 * Renders the simulation results with Tailwind styling.
 */
function displayResults(results) {
    const resultsDiv = document.getElementById('results');
    
    // 1. Calculate and display Summary Statistics
    const total_wt = results.reduce((sum, p) => sum + p.wt, 0);
    const total_tat = results.reduce((sum, p) => sum + p.tat, 0);
    const avgWT = total_wt / results.length;
    const avgTAT = total_tat / results.length;
    
    let htmlContent = '';

    // Summary Card
    htmlContent += `
        <div class="bg-primary text-white p-6 rounded-lg shadow-xl mb-8">
            <h2 class="text-2xl font-bold mb-4 text-center">Summary Statistics</h2>
            <div class="flex justify-around">
                <div class="text-center">
                    <p class="text-4xl font-extrabold">${avgWT.toFixed(2)}</p>
                    <p class="text-lg font-medium mt-1">Avg. Waiting Time (WT)</p>
                </div>
                <div class="text-center">
                    <p class="text-4xl font-extrabold">${avgTAT.toFixed(2)}</p>
                    <p class="text-lg font-medium mt-1">Avg. Turnaround Time (TAT)</p>
                </div>
            </div>
        </div>
    `;

    // 2. Gantt Chart
    htmlContent += `
        <div class="bg-white shadow-xl rounded-lg p-6 mb-8">
            <h2 class="text-xl font-semibold text-gray-700 mb-4 border-b pb-2 border-gray-200">Gantt Chart (First 20 Time Units)</h2>
            <p class="text-sm text-gray-500 mb-4">Visualizing Preemption: Time Unit width is fixed at 20px.</p>
            ${createGanttChartHTML()}
        </div>
    `;
    
    // 3. Detailed Table Container
    htmlContent += `
        <div class="bg-white shadow-xl rounded-lg p-6 overflow-x-auto">
            <h2 class="text-xl font-semibold text-gray-700 mb-4 border-b pb-2 border-gray-200">Detailed Process Table (All 100 Jobs)</h2>
            <div class="max-h-96 overflow-y-auto"> <table class="w-full text-sm text-left text-gray-500">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 sticky-header">
                        <tr>
                            <th scope="col" class="px-6 py-3 cursor-pointer" onclick="sortResults('Job')">Job (PID)</th>
                            <th scope="col" class="px-6 py-3 cursor-pointer" onclick="sortResults('Arrival')">Arrival Time (AT)</th>
                            <th scope="col" class="px-6 py-3 cursor-pointer" onclick="sortResults('Burst')">Burst Time (BT)</th>
                            <th scope="col" class="px-6 py-3 cursor-pointer" onclick="sortResults('Completion')">Completion Time (CT)</th>
                            <th scope="col" class="px-6 py-3 cursor-pointer" onclick="sortResults('Turnaround')">Turnaround Time (TAT)</th>
                            <th scope="col" class="px-6 py-3 cursor-pointer" onclick="sortResults('Waiting')">Waiting Time (WT)</th>
                        </tr>
                    </thead>
                    <tbody>
    `;

    results.forEach((p, index) => {
        const rowColor = index % 2 === 0 ? 'bg-white' : 'bg-gray-50';
        htmlContent += `
            <tr class="${rowColor} border-b hover:bg-gray-100 text-center">
                <th scope="row" class="px-6 py-2 font-medium text-gray-900 whitespace-nowrap">P${p.pid}</th>
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

    resultsDiv.innerHTML = htmlContent;
}

/**
 * Creates and returns the HTML structure for the Gantt chart (using Tailwind colors).
 */
function createGanttChartHTML() {
    // We are scaling the chart to show the first 20 time units
    const MAX_TIME = 20; 

    // The entire chart width will represent 100% of the container space.
    // We'll calculate the bar widths as a percentage of the MAX_TIME.
    
    let ganttChartHTML = '<div class="gantt-chart-container overflow-x-auto">';
    ganttChartHTML += '<div class="gantt-chart">';
    
    // Tailwind Color Classes for processes
    const colors = [
        'bg-red-500', 'bg-emerald-500', 'bg-indigo-500', 'bg-yellow-500', 'bg-purple-500', 
        'bg-pink-500', 'bg-teal-500', 'bg-cyan-500', 'bg-orange-500', 'bg-lime-500'
    ];
    
    let totalTimeBlocks = 0;

    // 1. Generate Gantt Blocks
    globalGantt.forEach(block => {
        if (block.start < MAX_TIME) {
            const duration = Math.min(block.end, MAX_TIME) - block.start;
            if (duration <= 0) return; 

            // Calculate width as a percentage of MAX_TIME
            const widthPercent = (duration / MAX_TIME) * 100;
            totalTimeBlocks += duration;

            let blockClass = '';
            let blockContent = '';

            if (block.pid === -1) {
                blockClass = 'bg-idle'; // Idle time
                blockContent = 'Idle';
            } else {
                const colorIndex = (block.pid - 1) % colors.length;
                blockClass = colors[colorIndex];
                blockContent = `P${block.pid}`;
            }
            
            // Set the width using percentage
            ganttChartHTML += `<div class="gantt-block ${blockClass}" style="width: ${widthPercent.toFixed(2)}%;">
                                    <span class="px-2">${blockContent} (${duration})</span>
                               </div>`;
        }
    });

    ganttChartHTML += '</div>'; // End gantt-chart

    // 2. Generate Time Axis
    ganttChartHTML += '<div class="time-axis">';
    
    // We want the labels to be positioned correctly at the end of each block's time
    let cumulativePercent = 0;
    
    // Start with time 0 label
    ganttChartHTML += `<div class="time-label" style="width: 0; transform: translateX(50%);">0</div>`;

    globalGantt.forEach(block => {
        if (block.start < MAX_TIME) {
            const duration = Math.min(block.end, MAX_TIME) - block.start;
            if (duration <= 0) return;

            const widthPercent = (duration / MAX_TIME) * 100;
            const endTime = Math.min(block.end, MAX_TIME);
            
            // The time label needs to appear at the end of the block.
            // Create a spacer block for the duration of the current process execution.
            ganttChartHTML += `<div class="time-label" style="width: ${widthPercent.toFixed(2)}%;"></div>`;
            
            // Place the time marker (only if it's not the final end time of the chart)
            if (endTime <= MAX_TIME) {
                // The time marker itself occupies no width but is positioned at the right edge of the spacer.
                // We use transform: translateX(50%) to visually center the marker and number over the division line.
                ganttChartHTML += `<div class="time-label" style="width: 0; transform: translateX(50%);">${endTime}</div>`;
            }
        }
    });

    ganttChartHTML += '</div></div>'; // End time-axis and gantt-chart-container
    
    // If no blocks were added (e.g., all arrival times are > 20), add a message
    if (totalTimeBlocks === 0) {
        return `<p class="text-center text-gray-500 italic py-4">No activity shown in the first ${MAX_TIME} time units.</p>`;
    }

    return ganttChartHTML;
}

function simulateSRTF() {
    const numJobs = 100;
    globalProc = [];
    for (let i = 0; i < numJobs; i++) {
        const burstTime = Math.floor(Math.random() * 10) + 1;
        const arrivalTime = Math.floor(Math.random() * 7) + 1;
        globalProc.push(new Process(i + 1, burstTime, arrivalTime));
    }
    
    // Sort processes by Arrival Time to start the simulation correctly
    globalProc.sort((a, b) => a.art - b.art); 
    
    findavgTime(globalProc, globalProc.length);
}

function sortResults(criteria) {
    let sortedResults = [...globalResults];
    let key;
    
    if (criteria === 'Job') key = 'pid';
    else if (criteria === 'Arrival') key = 'art';
    else if (criteria === 'Burst') key = 'bt';
    else if (criteria === 'Completion') key = 'ct';
    else if (criteria === 'Turnaround') key = 'tat';
    else if (criteria === 'Waiting') key = 'wt';
    
    // Simple ascending sort for demonstration
    sortedResults.sort((a, b) => a[key] - b[key]);

    // Re-display the sorted data (this re-renders the table)
    displayResults(sortedResults);
}

// --- UI EVENT LISTENERS ---
document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('toggleExplanations');
    const explanationsDiv = document.getElementById('explanations');
    
    // Toggle the visibility of the explanations section
    toggleButton.addEventListener('click', () => {
        explanationsDiv.classList.toggle('hidden');
        if (explanationsDiv.classList.contains('hidden')) {
            toggleButton.textContent = 'Show Explanations';
        } else {
            toggleButton.textContent = 'Hide Explanations';
        }
    });
});
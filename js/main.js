// main.js

import { Process } from "./models/Process.js";
import { runSRTF } from "./core/srtf.js";
import { calculateAverages } from "./core/metrics.js";

import { renderGantt } from "./ui/ganttRenderer.js";
import { renderTable } from "./ui/tableRenderer.js";
import { renderSummary } from "./ui/summaryRenderer.js";
import { attachDOMEvents } from "./ui/domEvents.js";


// ===============================================================
// Generate random processes
// ===============================================================
function generateRandomProcesses(count = 100) {
    const processes = [];

    for (let i = 0; i < count; i++) {
        const bt = Math.floor(Math.random() * 10) + 1; // 1–10
        const art = Math.floor(Math.random() * 7) + 1; // 1–7
        processes.push(new Process(i + 1, bt, art));
    }

    // Sort by arrival time
    processes.sort((a, b) => a.art - b.art);

    return processes;
}


// ===============================================================
// Render EVERYTHING into #results
// ===============================================================
function renderAll(results, gantt) {
    const resultsDiv = document.getElementById("results");

    // Compute averages
    const averages = calculateAverages(results);

    // Build UI sections
    const summaryHTML = renderSummary(averages);
    const ganttHTML = `
        <div class="bg-white shadow-xl rounded-lg p-6 mb-8">
            <h2 class="text-xl font-semibold text-gray-700 mb-4">
                Gantt Chart (First 20 Time Units)
            </h2>
            ${renderGantt(gantt)}
        </div>
    `;
    const tableHTML = renderTable(results);

    // Inject final UI
    resultsDiv.innerHTML = summaryHTML + ganttHTML + tableHTML;
}


// ===============================================================
// MAIN SIMULATION ENTRY POINT
// ===============================================================
function simulate() {
    const processes = generateRandomProcesses(100);

    // Run SRTF core logic
    const { results, gantt } = runSRTF(processes);

    // Render results
    renderAll(results, gantt);

    // Save current results into window for sorting callbacks
    window._currentResults = results;
}


// ===============================================================
// Sort table when header buttons are clicked
// (The tableRenderer calls window.sortResults())
// ===============================================================
function sortResults(criteria) {
    if (!window._currentResults) return;

    const sorted = [...window._currentResults];

    const keyMap = {
        Job: "pid",
        Arrival: "art",
        Burst: "bt",
        Completion: "ct",
        Turnaround: "tat",
        Waiting: "wt",
    };

    const key = keyMap[criteria];
    sorted.sort((a, b) => a[key] - b[key]);

    // Render sorted results (Gantt chart stays same)
    renderAll(sorted, []); // No Gantt rerender needed for sorting
}


// ===============================================================
// Attach all button events on DOM ready
// ===============================================================
attachDOMEvents({
    onRunSimulation: simulate,
    onSort: sortResults
});


// Optional: auto-run simulation on load
// simulate();

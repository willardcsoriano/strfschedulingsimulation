// js/core/srtf.js

/**
 * Run the SRTF scheduling simulation.
 * @param {Process[]} processes 
 * @returns {Object} { results, gantt }
 */
export function runSRTF(processes) {
    
    const n = processes.length;
    const remaining = processes.map(p => p.bt);   // Remaining burst times
    const waiting = Array(n).fill(0);
    const turnaround = Array(n).fill(0);

    let complete = 0;
    let t = 0;
    const gantt = [];

    while (complete !== n) {
        let shortest = -1;
        let minRemaining = Number.MAX_VALUE;
        let anyReady = false;

        // -----------------------------------------------------
        // Find shortest remaining-time job available at time t
        // -----------------------------------------------------
        for (let i = 0; i < n; i++) {
            if (processes[i].art <= t && remaining[i] > 0) {
                anyReady = true;
                if (remaining[i] < minRemaining) {
                    minRemaining = remaining[i];
                    shortest = i;
                }
            }
        }

        // -------------------------------------
        // No job ready → CPU idle
        // -------------------------------------
        if (!anyReady) {
            pushGanttBlock(gantt, -1, t, t + 1);
            t++;
            continue;
        }

        // ----------------------------
        // Execute selected process
        // ----------------------------
        remaining[shortest]--;
        const pid = processes[shortest].pid;

        pushGanttBlock(gantt, pid, t, t + 1);

        // ----------------------------
        // Process finishes now
        // ----------------------------
        if (remaining[shortest] === 0) {
            complete++;
            const finishTime = t + 1;

            waiting[shortest] = finishTime - processes[shortest].bt - processes[shortest].art;
            if (waiting[shortest] < 0) waiting[shortest] = 0;

            turnaround[shortest] = processes[shortest].bt + waiting[shortest];
        }

        t++;
    }

    // ---------------------------------------------------------
    // Build structured result objects
    // ---------------------------------------------------------
    const results = processes.map((p, i) => ({
        pid: p.pid,
        art: p.art,
        bt: p.bt,
        wt: waiting[i],
        tat: turnaround[i],
        ct: processes[i].art + turnaround[i]
    }));

    return { results, gantt };
}


/**
 * Push or extend a Gantt block in-place.
 */
function pushGanttBlock(gantt, pid, start, end) {
    const last = gantt[gantt.length - 1];

    if (!last || last.pid !== pid) {
        gantt.push({ pid, start, end });
    } else {
        last.end = end;
    }
}

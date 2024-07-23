class Process {
    constructor(pid, bt, art) {
        this.pid = pid;    // Process ID
        this.bt = bt;      // Burst Time
        this.art = art;    // Arrival Time
    }
}

let globalProc = [];
let globalResults = [];

function findWaitingTime(proc, n, wt) {
    let rt = new Array(n);
    for (let i = 0; i < n; i++) rt[i] = proc[i].bt;
    let complete = 0, t = 0, minm = Number.MAX_VALUE;
    let shortest = 0, finish_time;
    let check = false;
    
    while (complete != n) {
        for (let j = 0; j < n; j++) {
            if ((proc[j].art <= t) && (rt[j] < minm) && rt[j] > 0) {
                minm = rt[j];
                shortest = j;
                check = true;
            }
        }
        if (check == false) {
            t++;
            continue;
        }
        rt[shortest]--;
        minm = rt[shortest];
        if (minm == 0) minm = Number.MAX_VALUE;
        if (rt[shortest] == 0) {
            complete++;
            check = false;
            finish_time = t + 1;
            wt[shortest] = finish_time - proc[shortest].bt - proc[shortest].art;
            if (wt[shortest] < 0) wt[shortest] = 0;
        }
        t++;
    }
}

function findTurnAroundTime(proc, n, wt, tat) {
    for (let i = 0; i < n; i++) tat[i] = proc[i].bt + wt[i];
}

function findavgTime(proc, n) {
    let wt = new Array(n), tat = new Array(n);
    let total_wt = 0, total_tat = 0;
    findWaitingTime(proc, n, wt);
    findTurnAroundTime(proc, n, wt, tat);

    globalResults = proc.map((p, i) => ({
        ...p,
        wt: wt[i],
        tat: tat[i],
        ct: tat[i] + p.art,
    }));
    
    displayResults(globalResults);
}

function displayResults(results) {
    let resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '<h2>Simulation Results</h2>';
    let table = document.createElement('table');
    table.innerHTML = `
        <tr>
            <th onclick="sortResults('Job')">Job</th>
            <th onclick="sortResults('Arrival')">Arrival Time</th>
            <th onclick="sortResults('Burst')">Burst Time</th>
            <th onclick="sortResults('Completion')">Completion Time</th>
            <th onclick="sortResults('Turnaround')">Turnaround Time</th>
            <th onclick="sortResults('Waiting')">Waiting Time</th>
        </tr>
    `;
    for (let i = 0; i < results.length; i++) {
        let row = document.createElement('tr');
        row.innerHTML = `
            <td>${results[i].pid}</td>
            <td>${results[i].art}</td>
            <td>${results[i].bt}</td>
            <td>${results[i].ct}</td>
            <td>${results[i].tat}</td>
            <td>${results[i].wt}</td>
        `;
        table.appendChild(row);
    }
    resultsDiv.appendChild(table);

    let total_wt = results.reduce((sum, p) => sum + p.wt, 0);
    let total_tat = results.reduce((sum, p) => sum + p.tat, 0);
    let avgWT = total_wt / results.length;
    let avgTAT = total_tat / results.length;
    resultsDiv.innerHTML += `<p>Average waiting time = ${avgWT.toFixed(2)}</p>`;
    resultsDiv.innerHTML += `<p>Average turn around time = ${avgTAT.toFixed(2)}</p>`;
}

function simulateSRTF() {
    const numJobs = 100;
    globalProc = [];
    for (let i = 0; i < numJobs; i++) {
        const burstTime = Math.floor(Math.random() * 10) + 1;
        const arrivalTime = Math.floor(Math.random() * 7) + 1;
        globalProc.push(new Process(i + 1, burstTime, arrivalTime));
    }
    findavgTime(globalProc, globalProc.length);
}

function sortResults(criteria) {
    let sortedResults = [...globalResults];
    if (criteria === 'Job') {
        sortedResults.sort((a, b) => a.pid - b.pid);
    } else if (criteria === 'Arrival') {
        sortedResults.sort((a, b) => a.art - b.art);
    } else if (criteria === 'Burst') {
        sortedResults.sort((a, b) => a.bt - b.bt);
    } else if (criteria === 'Completion') {
        sortedResults.sort((a, b) => a.ct - b.ct);
    } else if (criteria === 'Turnaround') {
        sortedResults.sort((a, b) => a.tat - b.tat);
    } else if (criteria === 'Waiting') {
        sortedResults.sort((a, b) => a.wt - b.wt);
    }
    displayResults(sortedResults);
}

// js/models/Process.js
export class Process {
    constructor(pid, bt, art) {
        this.pid = pid;    // Process ID
        this.bt = bt;      // Burst Time
        this.art = art;    // Arrival Time
    }
}

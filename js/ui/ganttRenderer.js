// js/ui/ganttRenderer.js

export function renderGantt(ganttData, maxTime = 20) {
    let html = `
        <div class="gantt-chart-container">
            <div class="gantt-chart">
    `;

    const colors = [
        'bg-red-500', 'bg-emerald-500', 'bg-indigo-500',
        'bg-yellow-500', 'bg-purple-500', 'bg-pink-500',
        'bg-teal-500', 'bg-cyan-500', 'bg-orange-500'
    ];

    // Render blocks
    ganttData.forEach(block => {
        if (block.start < maxTime) {
            const duration = Math.min(block.end, maxTime) - block.start;
            if (duration <= 0) return;

            const widthPercent = (duration / maxTime) * 100;

            let blockClass, label;

            if (block.pid === -1) {
                blockClass = "bg-gray-400";
                label = "Idle";
            } else {
                blockClass = colors[(block.pid - 1) % colors.length];
                label = `P${block.pid}`;
            }

            html += `
                <div class="gantt-block ${blockClass}" style="width:${widthPercent}%;">
                    <span>${label} (${duration})</span>
                </div>
            `;
        }
    });

    html += `
            </div>
            <div class="time-axis">
                <div class="time-label" style="transform: translateX(50%);">0</div>
    `;

    // Render time labels
    ganttData.forEach(block => {
        if (block.start < maxTime) {
            const duration = Math.min(block.end, maxTime) - block.start;
            const widthPercent = (duration / maxTime) * 100;
            const endTime = Math.min(block.end, maxTime);

            html += `
                <div class="time-label" style="width:${widthPercent}%"></div>
                <div class="time-label" style="transform: translateX(50%);">${endTime}</div>
            `;
        }
    });

    html += `
            </div>
        </div>
    `;

    return html;
}

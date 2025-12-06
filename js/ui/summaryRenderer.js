// js/ui/summaryRenderer.js

export function renderSummary({ avgWT, avgTAT }) {
    return `
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
}

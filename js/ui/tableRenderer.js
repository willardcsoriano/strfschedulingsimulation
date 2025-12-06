// js/ui/tableRenderer.js

export function renderTable(results, sortHandlerName = "sortResults") {
    let rows = results
        .map((p, index) => {
            const rowColor = index % 2 === 0 ? "bg-white" : "bg-gray-50";
            return `
                <tr class="${rowColor} border-b text-center">
                    <td class="px-6 py-2">P${p.pid}</td>
                    <td class="px-6 py-2">${p.art}</td>
                    <td class="px-6 py-2">${p.bt}</td>
                    <td class="px-6 py-2">${p.ct}</td>
                    <td class="px-6 py-2 font-semibold">${p.tat}</td>
                    <td class="px-6 py-2 text-secondary font-semibold">${p.wt}</td>
                </tr>
            `;
        })
        .join("");

    return `
        <div class="bg-white shadow-xl rounded-lg p-6 overflow-x-auto">
            <h2 class="text-xl font-semibold text-gray-700 mb-4">Detailed Process Table</h2>

            <div class="max-h-96 overflow-y-auto">

            <table class="w-full text-sm text-left text-gray-500">
                <thead class="bg-gray-50 sticky-header">
                    <tr>
                        <th class="px-6 py-3 cursor-pointer" onclick="${sortHandlerName}('Job')">Job</th>
                        <th class="px-6 py-3 cursor-pointer" onclick="${sortHandlerName}('Arrival')">Arrival</th>
                        <th class="px-6 py-3 cursor-pointer" onclick="${sortHandlerName}('Burst')">Burst</th>
                        <th class="px-6 py-3 cursor-pointer" onclick="${sortHandlerName}('Completion')">Completion</th>
                        <th class="px-6 py-3 cursor-pointer" onclick="${sortHandlerName}('Turnaround')">TAT</th>
                        <th class="px-6 py-3 cursor-pointer" onclick="${sortHandlerName}('Waiting')">WT</th>
                    </tr>
                </thead>

                <tbody>
                    ${rows}
                </tbody>
            </table>

            </div>
        </div>
    `;
}

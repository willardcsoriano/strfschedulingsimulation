// /core/metrics.js

/**
 * Compute average WT and TAT.
 * @param {Array} results - array of process result objects
 */
export function calculateAverages(results) {
    const totalWT = results.reduce((sum, p) => sum + p.wt, 0);
    const totalTAT = results.reduce((sum, p) => sum + p.tat, 0);

    return {
        avgWT: totalWT / results.length,
        avgTAT: totalTAT / results.length
    };
}

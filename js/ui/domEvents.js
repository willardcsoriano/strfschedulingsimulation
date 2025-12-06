// js/ui/domEvents.js

export function attachDOMEvents({ onRunSimulation, onSort }) {

    // Run Simulation Button
    const runBtn = document.getElementById("runSimulationButton");
    if (runBtn) {
        runBtn.onclick = () => onRunSimulation();
    }

    // Toggle Explanations
    const toggleBtn = document.getElementById("toggleExplanations");
    const expDiv = document.getElementById("explanations");

    if (toggleBtn && expDiv) {
        toggleBtn.onclick = () => {
            expDiv.classList.toggle("hidden");
            toggleBtn.textContent = expDiv.classList.contains("hidden")
                ? "Show Explanations"
                : "Hide Explanations";
        };
    }

    // Sorting (the table calls window.sortResults)
    window.sortResults = onSort;
}

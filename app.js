/**
 * System Leave & Time-Off Scripting Controller Engine
 */

document.addEventListener("DOMContentLoaded", function() {
    
    // 1. DATE SELECTION TIME DELTAS CALCULATOR
    const startInput = document.getElementById("startDate");
    const endInput = document.getElementById("endDate");
    const calculationDisplay = document.getElementById("daysCalculated");

    function processDateIntervalMetrics() {
        const startVal = startInput.value;
        const endVal = endInput.value;

        if (!startVal || !endVal) {
            calculationDisplay.innerText = "Calculated: 0 operational units";
            return;
        }

        const start = new Date(startVal);
        const end = new Date(endVal);

        if (end < start) {
            calculationDisplay.innerText = "Error: End date bounds precede start sequence.";
            calculationDisplay.style.color = "#F43F5E";
            return;
        }

        calculationDisplay.style.color = "#64748B"; 
        
        let timeDifference = end.getTime() - start.getTime();
        let totalDaysCalculated = Math.ceil(timeDifference / (1000 * 3600 * 24)) + 1;
        let workingDaysCount = 0;

        for (let i = 0; i < totalDaysCalculated; i++) {
            let inspectionDate = new Date(start);
            inspectionDate.setDate(start.getDate() + i);
            let dayIndex = inspectionDate.getDay();
            
            if (dayIndex !== 0 && dayIndex !== 6) { // 0 = Sunday, 6 = Saturday
                workingDaysCount++;
            }
        }

        calculationDisplay.innerText = `Calculated: ${workingDaysCount} operational units`;
    }

    startInput.addEventListener("change", processDateIntervalMetrics);
    endInput.addEventListener("change", processDateIntervalMetrics);

    // 2. EMPLOYEE REQUEST FORM TRANSMISSION ACTION
    const leaveForm = document.getElementById("leaveApplicationForm");
    leaveForm.addEventListener("submit", function(event) {
        event.preventDefault();
        
        const leaveSelectionType = document.getElementById("leaveType").value;
        alert(`Leave transaction initialized! Request category [${leaveSelectionType}] has been cataloged in the review log processing registry.`);
        
        leaveForm.reset();
        calculationDisplay.innerText = "Calculated: 0 operational units";
    });

    // 3. ADMINISTRATIVE APPROVAL ROUTING WORKFLOW
    const tableBody = document.getElementById("requestsTableBody");
    const countBadge = document.getElementById("requestCountBadge");

    tableBody.addEventListener("click", function(event) {
        const targetBtn = event.target.closest(".btn-action");
        if (!targetBtn) return;

        const row = targetBtn.closest(".request-row");
        const employeeName = row.querySelector(".profile-info-text strong").innerText;
        const supervisorComment = row.querySelector(".table-comment-input").value.trim();

        if (targetBtn.classList.contains("approve-action-btn")) {
            alert(`[LOG STATE: APPROVED] Verified workflow allocation request for: ${employeeName}.${supervisorComment ? ` Audit Comment: "${supervisorComment}"` : ""}`);
        } else if (targetBtn.classList.contains("reject-action-btn")) {
            alert(`[LOG STATE: REJECTED] Terminated allocation request parameters for: ${employeeName}.${supervisorComment ? ` Audit Comment: "${supervisorComment}"` : ""}`);
        }

        // Animate row removal out of viewport cleanly
        row.style.opacity = "0";
        row.style.transform = "translateX(30px)";
        row.style.transition = "all 0.35s ease";

        setTimeout(() => {
            row.remove();
            
            let currentBadgeCount = parseInt(countBadge.innerText);
            if (currentBadgeCount > 0) {
                currentBadgeCount--;
                countBadge.innerText = currentBadgeCount;
                if (currentBadgeCount === 0) {
                    countBadge.style.display = "none";
                }
            }
        }, 350);
    });
});
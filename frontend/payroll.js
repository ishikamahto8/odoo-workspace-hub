/**
 * System Payroll & Salary Management Client Script Engine
 */
document.addEventListener("DOMContentLoaded", function() {

    // 1. ADMIN ACTIONS LOGIC (RUN PAYROLL POPUP CALCULATION SYSTEM)
    const runPayrollBtn = document.getElementById("runPayrollBtn");
    if (runPayrollBtn) {
        runPayrollBtn.addEventListener("click", function() {
            const processToken = confirm(
                "[PAYROLL EXECUTION TERMINAL]\n\n" +
                "Are you sure you want to execute batch calculation logs across all active team entries for this lifecycle matrix?"
            );
            
            if (processToken) {
                alert(" Ledger generation completed! Records updated successfully across the administrative control panels layout.");
            }
        });
    }

    // 2. ADMIN TABLE ROW DRAWER TRIGGERS
    const updateButtons = document.querySelectorAll(".update-struct-btn");
    updateButtons.forEach(button => {
        button.addEventListener("click", function() {
            const targetedRow = this.closest("tr");
            const targetEmployee = targetedRow.querySelector(".meta-info strong").innerText;
            
            alert(
                `[COMPENSATION DRAWER MODAL]\n\n` +
                `Opening comprehensive details parameters configuration map for: ${targetEmployee}`
            );
        });
    });

    // 3. PERSONAL EARNINGS DETAILS SECURITY BLOTTER MASKS (EMPLOYEE VIEW SHIELD)
    const earningsToggle = document.querySelector(".breakdown-card-module .icon-toggle");
    if (earningsToggle) {
        earningsToggle.addEventListener("click", function() {
            const parentBlock = this.closest(".breakdown-card-module");
            const numbersList = parentBlock.querySelectorAll(".metric-row strong");
            
            const isCurrentlyMasked = this.classList.contains("fa-eye-slash") || this.classList.contains("far");
            
            numbersList.forEach(element => {
                if (isCurrentlyMasked) {
                    element.setAttribute("data-stored-amount", element.innerText);
                    element.innerText = "••••••";
                } else {
                    const originalData = element.getAttribute("data-stored-amount");
                    if (originalData) element.innerText = originalData;
                }
            });

            if (isCurrentlyMasked) {
                this.className = "fas fa-eye icon-toggle";
            } else {
                this.className = "far fa-eye-slash icon-toggle";
            }
        });
    }
});
const payrollUser = JSON.parse(localStorage.getItem("hrmsUser") || "{}");
const payrollIsAdmin = payrollUser.role === "hr";
const payrollDashboard = payrollIsAdmin ? "index_dashboard_admin.html" : "index_dashboard_employee.html";
const payrollRows = [
    ["Rahul Sharma", "63000", "57800"],
    ["Priya Verma", "59000", "54100"],
    ["Amit Patel", "82000", "75400"]
];

document.querySelector("#dashboardLink").href = payrollDashboard;
document.querySelector("#navDashboard").href = payrollDashboard;
document.querySelector("#roleLabel").textContent = payrollIsAdmin ? "Admin / HR" : "Employee";
document.querySelector("#userName").textContent = payrollUser.name || (payrollIsAdmin ? "HR Officer" : "Employee");
document.querySelector("#adminPayroll").style.display = payrollIsAdmin ? "block" : "none";
document.querySelector("#payrollRows").innerHTML = payrollRows.map((row) => (
    `<tr><td>${row[0]}</td><td>${row[1]}</td><td>${row[2]}</td><td><button class="update-btn" type="button">Update</button></td></tr>`
)).join("");
document.querySelector("#menuBtn").addEventListener("click", () => document.querySelector("#sidebar").classList.toggle("is-open"));
document.querySelector("#logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("hrmsUser");
    window.location.href = "index_signin.html";
});

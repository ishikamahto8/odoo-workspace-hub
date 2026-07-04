const currentUser = JSON.parse(localStorage.getItem("hrmsUser") || "{}");
const isAdmin = currentUser.role === "hr";
const dashboardUrl = isAdmin ? "index_dashboard_admin.html" : "index_dashboard_employee.html";
let editing = false;

document.querySelector("#dashboardLink").href = dashboardUrl;
document.querySelector("#navDashboard").href = dashboardUrl;
document.querySelector("#roleLabel").textContent = isAdmin ? "Admin / HR" : "Employee";
document.querySelector("#userName").textContent = currentUser.name || (isAdmin ? "HR Officer" : "Rahul Sharma");
document.querySelector("#profileName").textContent = currentUser.name || (isAdmin ? "HR Officer" : "Rahul Sharma");

function setEditMode(enabled) {
    editing = enabled;
    document.querySelector("#editBtn").textContent = enabled ? "Save profile" : "Edit profile";
    document.querySelectorAll(".employee-edit").forEach((field) => {
        field.disabled = !enabled;
    });
    document.querySelectorAll("[data-admin-only]").forEach((field) => {
        field.disabled = !(enabled && isAdmin);
    });
}

document.querySelector("#editBtn").addEventListener("click", () => setEditMode(!editing));
document.querySelector("#photoBtn").addEventListener("click", () => document.querySelector("#photoInput").click());
document.querySelector("#photoInput").addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        document.querySelector("#profilePhoto").src = URL.createObjectURL(file);
    }
});
document.querySelector("#menuBtn").addEventListener("click", () => document.querySelector("#sidebar").classList.toggle("is-open"));
document.querySelector("#logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("hrmsUser");
    window.location.href = "index_signin.html";
});

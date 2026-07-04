const attendanceUser = JSON.parse(localStorage.getItem("hrmsUser") || "{}");
const attendanceIsAdmin = attendanceUser.role === "hr";
const attendanceDashboard = attendanceIsAdmin ? "index_dashboard_admin.html" : "index_dashboard_employee.html";
const attendanceData = [
    ["Jul 1, 2026", "09:04", "18:02", "Present"],
    ["Jul 2, 2026", "09:18", "18:05", "Present"],
    ["Jul 3, 2026", "10:10", "14:20", "Half-day"],
    ["Jul 4, 2026", "--", "--", "Leave"]
];

document.querySelector("#dashboardLink").href = attendanceDashboard;
document.querySelector("#navDashboard").href = attendanceDashboard;
document.querySelector("#roleLabel").textContent = attendanceIsAdmin ? "Admin / HR" : "Employee";
document.querySelector("#userName").textContent = attendanceUser.name || (attendanceIsAdmin ? "HR Officer" : "Employee");

function updateAttendanceClock() {
    document.querySelector("#clock").textContent = new Date().toLocaleTimeString("en-IN");
}

function renderAttendanceRows() {
    document.querySelector("#attendanceRows").innerHTML = attendanceData.map((row) => (
        `<tr><td>${row[0]}</td><td>${row[1]}</td><td>${row[2]}</td><td><span class="status-pill">${row[3]}</span></td></tr>`
    )).join("");
}

document.querySelector("#checkInBtn").addEventListener("click", () => {
    document.querySelector("#statusText").textContent = "Checked in";
    document.querySelector("#statusDot").classList.add("is-active");
    document.querySelector("#checkInBtn").disabled = true;
    document.querySelector("#checkOutBtn").disabled = false;
});
document.querySelector("#checkOutBtn").addEventListener("click", () => {
    document.querySelector("#statusText").textContent = "Checked out";
    document.querySelector("#statusDot").classList.remove("is-active");
    document.querySelector("#checkOutBtn").disabled = true;
});
document.querySelector("#menuBtn").addEventListener("click", () => document.querySelector("#sidebar").classList.toggle("is-open"));
document.querySelector("#logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("hrmsUser");
    window.location.href = "index_signin.html";
});
updateAttendanceClock();
renderAttendanceRows();
setInterval(updateAttendanceClock, 1000);

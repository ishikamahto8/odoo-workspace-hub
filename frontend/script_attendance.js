const API_BASE = "http://localhost:5000/api";
const token = localStorage.getItem("hrmsToken");
const attendanceUser = JSON.parse(localStorage.getItem("hrmsUser") || "{}");
if(!token) window.location.href = "index_signin.html";

const attendanceIsAdmin = attendanceUser.role === "hr";
const attendanceDashboard = attendanceIsAdmin ? "index_dashboard_admin.html" : "index_dashboard_employee.html";

document.querySelector("#dashboardLink").href = attendanceDashboard;
document.querySelector("#navDashboard").href = attendanceDashboard;
document.querySelector("#roleLabel").textContent = attendanceIsAdmin ? "Admin / HR" : "Employee";
document.querySelector("#userName").textContent = attendanceUser.name || (attendanceIsAdmin ? "HR Officer" : "Employee");

function updateAttendanceClock() {
    document.querySelector("#clock").textContent = new Date().toLocaleTimeString("en-IN");
}

async function loadAttendanceData() {
    try {
        const url = attendanceIsAdmin ? `${API_BASE}/attendance` : `${API_BASE}/attendance/me`;
        const res = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
        const data = await res.json();
        if(res.ok) {
            const rows = data.attendance.map(row => {
                const d = new Date(row.date).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" });
                const ci = row.check_in ? new Date(row.check_in).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "--";
                const co = row.check_out ? new Date(row.check_out).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "--";
                
                const firstCol = attendanceIsAdmin && row.first_name ? `${row.first_name} ${row.last_name}` : d;
                return `<tr><td>${firstCol}</td><td>${ci}</td><td>${co}</td><td><span class="status-pill">${row.status}</span></td></tr>`;
            });
            document.querySelector("#attendanceRows").innerHTML = rows.join("");
        }
    } catch(e) { console.error(e); }
}

document.querySelector("#checkInBtn").addEventListener("click", async () => {
    try {
        const res = await fetch(`${API_BASE}/attendance/checkin`, { 
            method: 'POST', 
            headers: { 'Authorization': `Bearer ${token}` } 
        });
        if(res.ok) {
            document.querySelector("#statusText").textContent = "Checked in";
            document.querySelector("#statusDot").classList.add("is-active");
            document.querySelector("#checkInBtn").disabled = true;
            document.querySelector("#checkOutBtn").disabled = false;
            loadAttendanceData();
        } else {
            const data = await res.json();
            alert(data.error);
        }
    } catch(e) { console.error(e); }
});

document.querySelector("#checkOutBtn").addEventListener("click", async () => {
    try {
        const res = await fetch(`${API_BASE}/attendance/checkout`, { 
            method: 'POST', 
            headers: { 'Authorization': `Bearer ${token}` } 
        });
        if(res.ok) {
            document.querySelector("#statusText").textContent = "Checked out";
            document.querySelector("#statusDot").classList.remove("is-active");
            document.querySelector("#checkOutBtn").disabled = true;
            loadAttendanceData();
        } else {
            const data = await res.json();
            alert(data.error);
        }
    } catch(e) { console.error(e); }
});

document.querySelector("#menuBtn").addEventListener("click", () => document.querySelector("#sidebar").classList.toggle("is-open"));
document.querySelector("#logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("hrmsToken");
    localStorage.removeItem("hrmsUser");
    window.location.href = "index_signin.html";
});

updateAttendanceClock();
loadAttendanceData();
setInterval(updateAttendanceClock, 1000);

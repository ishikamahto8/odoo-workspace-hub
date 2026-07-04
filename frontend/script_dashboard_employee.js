const API_BASE = "http://localhost:5000/api";
const token = localStorage.getItem("hrmsToken");
const user = JSON.parse(localStorage.getItem("hrmsUser") || "{}");

if (!token || user.role !== "employee") {
    window.location.href = "index_signin.html";
}

const displayName = user.name || "Employee";
const sidebar = document.querySelector("#sidebar");
const checkInBtn = document.querySelector("#checkInBtn");
const checkOutBtn = document.querySelector("#checkOutBtn");
const attendanceStatus = document.querySelector("#attendanceStatus");
const statusDot = document.querySelector("#statusDot");
const liveClock = document.querySelector("#liveClock");

document.querySelector("#employeeName").textContent = displayName;
document.querySelector("#welcomeName").textContent = `Welcome back, ${displayName}`;
document.querySelector("#todayLabel").textContent = new Date().toLocaleDateString("en-IN", {
    weekday: "short", day: "numeric", month: "short", year: "numeric"
});

function updateClock() {
    liveClock.textContent = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

async function loadAttendanceWeek() {
    try {
        const response = await fetch(`${API_BASE}/attendance/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (!response.ok) throw new Error("Failed to load attendance");
        
        const recent = data.attendance.slice(0, 5);
        document.querySelector("#weekList").innerHTML = recent.map((row) => {
            const dayStr = new Date(row.date).toLocaleDateString("en-IN", { weekday: "short" });
            let hoursStr = "--";
            if (row.check_in && row.check_out) {
                const diffMs = new Date(row.check_out) - new Date(row.check_in);
                const hrs = Math.floor(diffMs / 3600000);
                const mins = Math.floor((diffMs % 3600000) / 60000);
                hoursStr = `${hrs}h ${mins}m`;
            }
            return `
            <div class="week-row">
                <strong>${dayStr}</strong>
                <span>${row.status}</span>
                <strong>${hoursStr}</strong>
            </div>`;
        }).join("");

        const todayStr = new Date().toISOString().split("T")[0];
        const todayRecord = data.attendance.find(a => a.date.startsWith(todayStr));
        if (todayRecord) {
            if (todayRecord.check_out) {
                const time = new Date(todayRecord.check_out).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
                attendanceStatus.textContent = `Checked out at ${time}`;
                statusDot.classList.remove("is-active");
                checkInBtn.disabled = true;
                checkOutBtn.disabled = true;
            } else {
                const time = new Date(todayRecord.check_in).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
                attendanceStatus.textContent = `Checked in at ${time}`;
                statusDot.classList.add("is-active");
                checkInBtn.disabled = true;
                checkOutBtn.disabled = false;
            }
        } else {
            attendanceStatus.textContent = "Not checked in yet";
            statusDot.classList.remove("is-active");
            checkInBtn.disabled = false;
            checkOutBtn.disabled = true;
        }
    } catch (e) {
        console.error(e);
        document.querySelector("#weekList").innerHTML = `<div class="week-row">Error loading data</div>`;
    }
}

function logout() {
    localStorage.removeItem("hrmsToken");
    localStorage.removeItem("hrmsUser");
    window.location.href = "index_signin.html";
}

checkInBtn.addEventListener("click", async () => {
    try {
        const response = await fetch(`${API_BASE}/attendance/checkin`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (response.ok) {
            loadAttendanceWeek();
        } else {
            alert(data.error);
        }
    } catch(e) { console.error(e); }
});

checkOutBtn.addEventListener("click", async () => {
    try {
        const response = await fetch(`${API_BASE}/attendance/checkout`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (response.ok) {
            loadAttendanceWeek();
        } else {
            alert(data.error);
        }
    } catch(e) { console.error(e); }
});

document.querySelector("#menuBtn").addEventListener("click", () => sidebar.classList.toggle("is-open"));
document.querySelector("#logoutBtn").addEventListener("click", logout);
document.querySelector("#quickLogoutBtn").addEventListener("click", logout);

updateClock();
setInterval(updateClock, 1000);
loadAttendanceWeek();

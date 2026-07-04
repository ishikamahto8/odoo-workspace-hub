const user = JSON.parse(localStorage.getItem("hrmsUser") || "{}");
const displayName = user.name || "Rahul Sharma";
const sidebar = document.querySelector("#sidebar");
const checkInBtn = document.querySelector("#checkInBtn");
const checkOutBtn = document.querySelector("#checkOutBtn");
const attendanceStatus = document.querySelector("#attendanceStatus");
const statusDot = document.querySelector("#statusDot");
const liveClock = document.querySelector("#liveClock");

const weekRows = [
    { day: "Mon", status: "Present", hours: "8h 12m" },
    { day: "Tue", status: "Present", hours: "8h 04m" },
    { day: "Wed", status: "Half-day", hours: "4h 18m" },
    { day: "Thu", status: "Present", hours: "8h 01m" },
    { day: "Fri", status: "Leave", hours: "--" }
];

document.querySelector("#employeeName").textContent = displayName;
document.querySelector("#welcomeName").textContent = `Welcome back, ${displayName}`;
document.querySelector("#todayLabel").textContent = new Date().toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric"
});

function updateClock() {
    liveClock.textContent = new Date().toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });
}

function renderWeek() {
    document.querySelector("#weekList").innerHTML = weekRows.map((row) => `
        <div class="week-row">
            <strong>${row.day}</strong>
            <span>${row.status}</span>
            <strong>${row.hours}</strong>
        </div>
    `).join("");
}

function logout() {
    localStorage.removeItem("hrmsUser");
    window.location.href = "index_signin.html";
}

checkInBtn.addEventListener("click", () => {
    const time = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    attendanceStatus.textContent = `Checked in at ${time}`;
    statusDot.classList.add("is-active");
    checkInBtn.disabled = true;
    checkOutBtn.disabled = false;
});

checkOutBtn.addEventListener("click", () => {
    const time = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    attendanceStatus.textContent = `Checked out at ${time}`;
    statusDot.classList.remove("is-active");
    checkOutBtn.disabled = true;
});

document.querySelector("#menuBtn").addEventListener("click", () => {
    sidebar.classList.toggle("is-open");
});

document.querySelector("#logoutBtn").addEventListener("click", logout);
document.querySelector("#quickLogoutBtn").addEventListener("click", logout);

updateClock();
renderWeek();
setInterval(updateClock, 1000);

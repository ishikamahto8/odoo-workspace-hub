const employees = [
    { id: "EMP101", name: "Rahul Sharma", title: "Software Engineer", dept: "Development", status: "Present", access: "Employee" },
    { id: "EMP102", name: "Priya Verma", title: "UI/UX Designer", dept: "Design", status: "Leave", access: "Employee" },
    { id: "EMP103", name: "Amit Patel", title: "Product Manager", dept: "Management", status: "Present", access: "Employee" },
    { id: "EMP104", name: "Neha Gupta", title: "QA Engineer", dept: "Development", status: "Absent", access: "Employee" },
    { id: "EMP105", name: "Sanya Iyer", title: "HR Specialist", dept: "Human Resources", status: "Present", access: "Admin / HR" }
];

let leaveRequests = [
    { id: 1, name: "Priya Verma", type: "Sick Leave", range: "Jul 8 - Jul 10" },
    { id: 2, name: "Amit Patel", type: "Paid Leave", range: "Jul 14 - Jul 18" },
    { id: 3, name: "Rahul Sharma", type: "Unpaid Leave", range: "Jul 21" }
];

const user = JSON.parse(localStorage.getItem("hrmsUser") || "{}");
const tableBody = document.querySelector("#employeeTable");
const approvalList = document.querySelector("#approvalList");
const searchInput = document.querySelector("#employeeSearch");
const sidebar = document.querySelector("#sidebar");

document.querySelector("#adminName").textContent = user.name || "HR Officer";
document.querySelector("#todayLabel").textContent = new Date().toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric"
});

function renderMetrics() {
    document.querySelector("#employeeCount").textContent = employees.length;
    document.querySelector("#presentCount").textContent = employees.filter((employee) => employee.status === "Present").length;
    document.querySelector("#pendingLeaveCount").textContent = leaveRequests.length;
}

function renderEmployees(list) {
    tableBody.innerHTML = list.map((employee) => `
        <tr>
            <td>
                <div class="employee-cell">
                    <img class="avatar" src="https://i.pravatar.cc/96?u=${employee.id}" alt="${employee.name}">
                    <div>
                        <strong>${employee.name}</strong><br>
                        <small>${employee.title}</small>
                    </div>
                </div>
            </td>
            <td>${employee.dept}</td>
            <td><span class="status-pill status-${employee.status.toLowerCase()}">${employee.status}</span></td>
            <td>${employee.access}</td>
        </tr>
    `).join("");
}

function renderApprovals() {
    if (!leaveRequests.length) {
        approvalList.innerHTML = `<div class="approval-card"><strong>No pending requests</strong><p>The leave queue is clear.</p></div>`;
        renderMetrics();
        return;
    }

    approvalList.innerHTML = leaveRequests.map((request) => `
        <article class="approval-card">
            <div>
                <strong>${request.name}</strong>
                <p>${request.type} · ${request.range}</p>
            </div>
            <div class="approval-actions">
                <button class="approve-btn" type="button" data-action="approve" data-id="${request.id}">Approve</button>
                <button class="reject-btn" type="button" data-action="reject" data-id="${request.id}">Reject</button>
            </div>
        </article>
    `).join("");
    renderMetrics();
}

searchInput.addEventListener("input", () => {
    const term = searchInput.value.trim().toLowerCase();
    const filtered = employees.filter((employee) => {
        return employee.name.toLowerCase().includes(term) ||
            employee.dept.toLowerCase().includes(term) ||
            employee.title.toLowerCase().includes(term);
    });
    renderEmployees(filtered);
});

approvalList.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-id]");
    if (!button) {
        return;
    }

    leaveRequests = leaveRequests.filter((request) => request.id !== Number(button.dataset.id));
    renderApprovals();
});

document.querySelector("#menuBtn").addEventListener("click", () => {
    sidebar.classList.toggle("is-open");
});

document.querySelector("#logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("hrmsUser");
    window.location.href = "index_signin.html";
});

renderMetrics();
renderEmployees(employees);
renderApprovals();

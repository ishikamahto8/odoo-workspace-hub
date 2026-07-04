const API_BASE = "http://localhost:5000/api";
const token = localStorage.getItem("hrmsToken");
const user = JSON.parse(localStorage.getItem("hrmsUser") || "{}");

if (!token || user.role !== "hr") {
    window.location.href = "index_signin.html";
}

let employees = [];
let leaveRequests = [];

const tableBody = document.querySelector("#employeeTable");
const approvalList = document.querySelector("#approvalList");
const searchInput = document.querySelector("#employeeSearch");
const sidebar = document.querySelector("#sidebar");

document.querySelector("#adminName").textContent = user.name || "HR Officer";
document.querySelector("#todayLabel").textContent = new Date().toLocaleDateString("en-IN", {
    weekday: "short", day: "numeric", month: "short", year: "numeric"
});

function renderMetrics() {
    document.querySelector("#employeeCount").textContent = employees.length;
    document.querySelector("#pendingLeaveCount").textContent = leaveRequests.length;
    // Real present count would require filtering actual attendance data here
}

function renderEmployees(list) {
    tableBody.innerHTML = list.map((employee) => `
        <tr>
            <td>
                <div class="employee-cell">
                    <img class="avatar" src="${employee.profile_picture_url || `https://i.pravatar.cc/96?u=${employee.id}`}" alt="${employee.first_name || 'User'}">
                    <div>
                        <strong>${employee.first_name || 'No Name'} ${employee.last_name || ''}</strong><br>
                        <small>${employee.job_details?.title || 'Employee'}</small>
                    </div>
                </div>
            </td>
            <td>${employee.job_details?.department || 'N/A'}</td>
            <td><span class="status-pill status-present">Active</span></td>
            <td>${employee.role}</td>
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
                <strong>Employee ID: ${request.user_id}</strong>
                <p>${request.type} · ${new Date(request.start_date).toLocaleDateString()} to ${new Date(request.end_date).toLocaleDateString()}</p>
            </div>
            <div class="approval-actions">
                <button class="approve-btn" type="button" data-action="approve" data-id="${request.id}">Approve</button>
                <button class="reject-btn" type="button" data-action="reject" data-id="${request.id}">Reject</button>
            </div>
        </article>
    `).join("");
    renderMetrics();
}

async function loadAdminData() {
    try {
        const profRes = await fetch(`${API_BASE}/profiles`, { headers: { 'Authorization': `Bearer ${token}` } });
        const profData = await profRes.json();
        if (profRes.ok) {
            employees = profData.profiles;
            renderEmployees(employees);
            renderMetrics();
        }

        const leaveRes = await fetch(`${API_BASE}/leaves`, { headers: { 'Authorization': `Bearer ${token}` } });
        const leaveData = await leaveRes.json();
        if (leaveRes.ok) {
            leaveRequests = leaveData.leaveRequests || [];
            renderApprovals();
        }
    } catch (e) {
        console.error("Error loading admin data", e);
    }
}

searchInput.addEventListener("input", () => {
    const term = searchInput.value.trim().toLowerCase();
    const filtered = employees.filter((employee) => {
        const name = `${employee.first_name} ${employee.last_name}`.toLowerCase();
        const dept = (employee.job_details?.department || "").toLowerCase();
        const title = (employee.job_details?.title || "").toLowerCase();
        return name.includes(term) || dept.includes(term) || title.includes(term);
    });
    renderEmployees(filtered);
});

approvalList.addEventListener("click", async (event) => {
    const button = event.target.closest("button[data-id]");
    if (!button) return;
    
    const leaveId = button.dataset.id;
    const action = button.dataset.action; 
    const status = action === 'approve' ? 'Approved' : 'Rejected';

    try {
        const res = await fetch(`${API_BASE}/leaves/${leaveId}/review`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ status })
        });
        if (res.ok) {
            leaveRequests = leaveRequests.filter((request) => request.id !== Number(leaveId));
            renderApprovals();
        } else {
            const data = await res.json();
            alert(data.error);
        }
    } catch(e) { console.error(e); }
});

document.querySelector("#menuBtn").addEventListener("click", () => sidebar.classList.toggle("is-open"));
document.querySelector("#logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("hrmsToken");
    localStorage.removeItem("hrmsUser");
    window.location.href = "index_signin.html";
});

loadAdminData();

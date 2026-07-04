const timeoffUser = JSON.parse(localStorage.getItem("hrmsUser") || "{}");
const timeoffIsAdmin = timeoffUser.role === "hr";
const timeoffDashboard = timeoffIsAdmin ? "index_dashboard_admin.html" : "index_dashboard_employee.html";
let requests = [
    { id: 1, name: "Priya Verma", type: "Sick", dates: "Jul 8 - Jul 10" },
    { id: 2, name: "Amit Patel", type: "Paid", dates: "Jul 14 - Jul 18" }
];

document.querySelector("#dashboardLink").href = timeoffDashboard;
document.querySelector("#navDashboard").href = timeoffDashboard;
document.querySelector("#roleLabel").textContent = timeoffIsAdmin ? "Admin / HR" : "Employee";
document.querySelector("#userName").textContent = timeoffUser.name || (timeoffIsAdmin ? "HR Officer" : "Employee");
document.querySelector("#adminQueue").style.display = timeoffIsAdmin ? "block" : "none";

function renderRequests() {
    document.querySelector("#requestList").innerHTML = requests.length ? requests.map((request) => `
        <article class="request-card">
            <strong>${request.name}</strong>
            <p>${request.type} leave: ${request.dates}</p>
            <div class="request-actions">
                <button class="approve-btn" data-id="${request.id}" type="button">Approve</button>
                <button class="reject-btn" data-id="${request.id}" type="button">Reject</button>
            </div>
        </article>
    `).join("") : `<article class="request-card"><strong>No pending requests</strong><p>The leave queue is clear.</p></article>`;
}

document.querySelector("#leaveForm").addEventListener("submit", (event) => {
    event.preventDefault();
    alert("Leave request submitted.");
    event.currentTarget.reset();
});
document.querySelector("#requestList").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-id]");
    if (!button) return;
    requests = requests.filter((request) => request.id !== Number(button.dataset.id));
    renderRequests();
});
document.querySelector("#menuBtn").addEventListener("click", () => document.querySelector("#sidebar").classList.toggle("is-open"));
document.querySelector("#logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("hrmsUser");
    window.location.href = "index_signin.html";
});
renderRequests();

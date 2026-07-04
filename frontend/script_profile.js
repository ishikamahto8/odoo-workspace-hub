const API_BASE = "http://localhost:5000/api";
const token = localStorage.getItem("hrmsToken");
const currentUser = JSON.parse(localStorage.getItem("hrmsUser") || "{}");
if(!token) window.location.href = "index_signin.html";

const isAdmin = currentUser.role === "hr";
const dashboardUrl = isAdmin ? "index_dashboard_admin.html" : "index_dashboard_employee.html";
let editing = false;

document.querySelector("#dashboardLink").href = dashboardUrl;
document.querySelector("#navDashboard").href = dashboardUrl;
document.querySelector("#roleLabel").textContent = isAdmin ? "Admin / HR" : "Employee";
document.querySelector("#userName").textContent = currentUser.name || "Employee";
document.querySelector("#profileName").textContent = currentUser.name || "Employee";

async function loadProfile() {
    try {
        const res = await fetch(`${API_BASE}/profile/me`, { headers: { 'Authorization': `Bearer ${token}` } });
        const data = await res.json();
        if(res.ok && data.profile) {
            const phoneInput = document.querySelector('input[type="tel"]') || document.querySelector('#phone');
            if (phoneInput) phoneInput.value = data.profile.phone || '';
            
            const addrInput = document.querySelector('textarea') || document.querySelector('#address');
            if (addrInput) addrInput.value = data.profile.address || '';
        }
    } catch(e) { console.error(e); }
}

async function saveProfile() {
    const phoneInput = document.querySelector('input[type="tel"]') || document.querySelector('#phone');
    const addrInput = document.querySelector('textarea') || document.querySelector('#address');
    
    try {
        await fetch(`${API_BASE}/profile/me`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({
                phone: phoneInput ? phoneInput.value : undefined,
                address: addrInput ? addrInput.value : undefined
            })
        });
    } catch(e) { console.error(e); }
}

function setEditMode(enabled) {
    if (editing && !enabled) {
        saveProfile();
    }
    
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
    localStorage.removeItem("hrmsToken");
    localStorage.removeItem("hrmsUser");
    window.location.href = "index_signin.html";
});

loadProfile();

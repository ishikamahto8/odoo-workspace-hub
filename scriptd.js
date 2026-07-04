// --- SAMPLE DATA ---
const employees = [
    { id: "EMP101", name: "Rahul Sharma", role: "Software Engineer", dept: "Development", status: "present", email: "rahul@company.com", phone: "+91 98765 43210", manager: "Simran Kaur", location: "Bangalore" },
    { id: "EMP102", name: "Priya Verma", role: "UI/UX Designer", dept: "Design", status: "leave", email: "priya@company.com", phone: "+91 98765 43211", manager: "Simran Kaur", location: "Remote" },
    { id: "EMP103", name: "Amit Patel", role: "Product Manager", dept: "Management", status: "present", email: "amit@company.com", phone: "+91 98765 43212", manager: "Rajesh Singh", location: "Mumbai" },
    { id: "EMP104", name: "Neha Gupta", role: "QA Engineer", dept: "Development", status: "absent", email: "neha@company.com", phone: "+91 98765 43213", manager: "Rahul Sharma", location: "Bangalore" },
    { id: "EMP105", name: "Vikram Sait", role: "DevOps Engineer", dept: "IT Operations", status: "present", email: "vikram@company.com", phone: "+91 98765 43214", manager: "Simran Kaur", location: "Hyderabad" },
    { id: "EMP106", name: "Sanya Iyer", role: "HR Specialist", dept: "Human Resources", status: "present", email: "sanya@company.com", phone: "+91 98765 43215", manager: "Rajesh Singh", location: "Mumbai" }
];

// --- DOM ELEMENTS ---
const employeeGrid = document.getElementById('employeeGrid');
const employeeSearch = document.getElementById('employeeSearch');
const profileAvatar = document.getElementById('profileAvatar');
const profileDropdown = document.getElementById('profileDropdown');
const attendanceDot = document.getElementById('attendanceDot');
const attendanceText = document.getElementById('attendanceText');
const checkInBtn = document.getElementById('checkInBtn');
const checkOutBtn = document.getElementById('checkOutBtn');
const checkInLog = document.getElementById('checkInLog');
const checkOutLog = document.getElementById('checkOutLog');
const liveTimeDisplay = document.getElementById('liveTime');
const activityList = document.getElementById('activityList');

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    renderEmployees(employees);
    updateTime();
    setInterval(updateTime, 1000);
    document.getElementById('currentDate').innerText = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
});

// --- RENDER EMPLOYEES ---
function renderEmployees(data) {
    employeeGrid.innerHTML = '';
    data.forEach(emp => {
        const card = document.createElement('div');
        card.className = 'card emp-card';
        card.innerHTML = `
            <span class="status-dot-top ${emp.status}"></span>
            <img src="https://i.pravatar.cc/150?u=${emp.id}" alt="${emp.name}" class="avatar">
            <h4>${emp.name}</h4>
            <p class="emp-role">${emp.role}</p>
            <p>${emp.dept}</p>
        `;
        card.onclick = () => openProfileModal(emp);
        employeeGrid.appendChild(card);
    });
}

// --- SEARCH FILTER ---
employeeSearch.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = employees.filter(emp => 
        emp.name.toLowerCase().includes(term) || 
        emp.role.toLowerCase().includes(term) ||
        emp.dept.toLowerCase().includes(term)
    );
    renderEmployees(filtered);
});

// --- DROPDOWN LOGIC ---
profileAvatar.onclick = (e) => {
    e.stopPropagation();
    profileDropdown.classList.toggle('show');
};

window.onclick = () => {
    profileDropdown.classList.remove('show');
};

// --- ATTENDANCE LOGIC ---
function updateTime() {
    const now = new Date();
    liveTimeDisplay.innerText = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

checkInBtn.onclick = () => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    attendanceText.innerText = "Checked In";
    attendanceDot.classList.add('active');
    checkInLog.innerText = `Check In: ${time}`;
    checkInBtn.disabled = true;
    checkOutBtn.disabled = false;
    addActivity(`You checked in at ${time}`);
};

checkOutBtn.onclick = () => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    attendanceText.innerText = "Checked Out";
    attendanceDot.classList.remove('active');
    checkOutLog.innerText = `Check Out: ${time}`;
    checkOutBtn.disabled = true;
    addActivity(`You checked out at ${time}`);
};

// --- MODAL LOGIC: EMPLOYEE DETAILS ---
const empModal = document.getElementById('employeeModal');
const empModalBody = document.getElementById('empModalBody');

function openProfileModal(emp) {
    // If string passed (from Quick Actions), find the object or create dummy
    if(typeof emp === 'string') {
        emp = { name: "Simran Kaur", role: "HR Manager", id: "ADMIN01", email: "simran@hrms.com", phone: "+91 99999 88888", dept: "HR", manager: "Director", location: "Bangalore", status: "present" };
    }

    empModalBody.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://i.pravatar.cc/150?u=${emp.id}" class="avatar" style="width: 100px; height: 100px;">
            <h2 style="margin-top: 10px;">${emp.name}</h2>
            <p style="color: var(--bright-blue); font-weight: 600;">${emp.role}</p>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 14px;">
            <p><strong>Employee ID:</strong><br>${emp.id}</p>
            <p><strong>Department:</strong><br>${emp.dept}</p>
            <p><strong>Email:</strong><br>${emp.email}</p>
            <p><strong>Phone:</strong><br>${emp.phone}</p>
            <p><strong>Manager:</strong><br>${emp.manager}</p>
            <p><strong>Location:</strong><br>${emp.location}</p>
            <p><strong>Status:</strong><br><span style="text-transform: capitalize;">${emp.status}</span></p>
        </div>
    `;
    empModal.style.display = 'flex';
}

document.getElementById('closeEmpModal').onclick = () => empModal.style.display = 'none';

// --- MODAL LOGIC: LEAVE REQUEST ---
const leaveModal = document.getElementById('leaveModal');
const applyLeaveBtn = document.getElementById('applyLeaveBtn');
const leaveForm = document.getElementById('leaveForm');

applyLeaveBtn.onclick = () => leaveModal.style.display = 'flex';
document.getElementById('closeLeaveModal').onclick = () => leaveModal.style.display = 'none';
document.getElementById('cancelLeave').onclick = () => leaveModal.style.display = 'none';

leaveForm.onsubmit = (e) => {
    e.preventDefault();
    const type = document.getElementById('leaveType').value;
    alert(`Leave request for ${type} submitted successfully!`);
    addActivity(`You applied for ${type}`);
    leaveForm.reset();
    leaveModal.style.display = 'none';
};

// --- HELPER FUNCTIONS ---
function addActivity(text) {
    const li = document.createElement('li');
    li.innerHTML = `
        <div class="activity-info">
            <p>${text}</p>
            <small>Just now</small>
        </div>
    `;
    activityList.prepend(li);
}

document.getElementById('logoutBtn').onclick = () => {
    if(confirm("Are you sure you want to log out?")) {
        alert("Logging out...");
        window.location.reload();
    }
};

document.getElementById('viewProfileBtn').onclick = () => openProfileModal('Simran Kaur');

// Close modals on overlay click
window.addEventListener('click', (e) => {
    if (e.target == empModal) empModal.style.display = 'none';
    if (e.target == leaveModal) leaveModal.style.display = 'none';
});
const API_BASE = "http://localhost:5000/api";
const signinForm = document.querySelector("#signinForm");
const errorBanner = document.querySelector("#signinError");
const passwordInput = document.querySelector("#password");
const togglePassword = document.querySelector("#togglePassword");

togglePassword.addEventListener("click", () => {
    const isHidden = passwordInput.type === "password";
    passwordInput.type = isHidden ? "text" : "password";
    togglePassword.textContent = isHidden ? "Hide" : "Show";
    togglePassword.setAttribute("aria-label", isHidden ? "Hide password" : "Show password");
});

signinForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    errorBanner.hidden = true;

    const email = signinForm.email.value.trim().toLowerCase();
    const password = signinForm.password.value;
    const fields = [...signinForm.querySelectorAll(".field")];

    fields.forEach((field) => field.classList.remove("is-invalid"));

    if (!signinForm.email.validity.valid) {
        signinForm.email.closest(".field").classList.add("is-invalid");
    }

    if (!password) {
        signinForm.password.closest(".field").classList.add("is-invalid");
    }

    if (!signinForm.checkValidity()) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/auth/signin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();

        if (!response.ok) {
            errorBanner.textContent = data.error || "Invalid credentials. Please try again.";
            errorBanner.hidden = false;
            signinForm.email.closest(".field").classList.add("is-invalid");
            signinForm.password.closest(".field").classList.add("is-invalid");
            return;
        }

        const name = (data.user.profile && data.user.profile.first_name) ? `${data.user.profile.first_name} ${data.user.profile.last_name}` : data.user.email;
        const role = data.user.role === "HR" ? "hr" : "employee";

        localStorage.setItem("hrmsToken", data.token);
        localStorage.setItem("hrmsUser", JSON.stringify({ email: data.user.email, role: role, name: name, id: data.user.id }));
        
        window.location.href = role === "hr" ? "index_dashboard_admin.html" : "index_dashboard_employee.html";
    } catch (error) {
        errorBanner.textContent = "Network error. Ensure the backend server is running on port 5000.";
        errorBanner.hidden = false;
    }
});

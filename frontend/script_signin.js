const signinForm = document.querySelector("#signinForm");
const errorBanner = document.querySelector("#signinError");
const passwordInput = document.querySelector("#password");
const togglePassword = document.querySelector("#togglePassword");

const demoUsers = [
    { email: "hr@skyhigh.test", password: "password123", role: "hr", name: "Ananya Rao" },
    { email: "employee@skyhigh.test", password: "password123", role: "employee", name: "Rahul Sharma" }
];

togglePassword.addEventListener("click", () => {
    const isHidden = passwordInput.type === "password";
    passwordInput.type = isHidden ? "text" : "password";
    togglePassword.textContent = isHidden ? "Hide" : "Show";
    togglePassword.setAttribute("aria-label", isHidden ? "Hide password" : "Show password");
});

signinForm.addEventListener("submit", (event) => {
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

    const user = demoUsers.find((item) => item.email === email && item.password === password);

    if (!user) {
        errorBanner.hidden = false;
        signinForm.email.closest(".field").classList.add("is-invalid");
        signinForm.password.closest(".field").classList.add("is-invalid");
        return;
    }

    localStorage.setItem("hrmsUser", JSON.stringify({ email: user.email, role: user.role, name: user.name }));
    window.location.href = user.role === "hr" ? "index_dashboard_admin.html" : "index_dashboard_employee.html";
});

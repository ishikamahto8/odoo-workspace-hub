const signupForm = document.querySelector("#signupForm");
const successBanner = document.querySelector("#signupSuccess");

signupForm.addEventListener("submit", (event) => {
    event.preventDefault();
    successBanner.hidden = true;

    const fields = [...signupForm.querySelectorAll(".field")];
    fields.forEach((field) => field.classList.remove("is-invalid"));

    fields.forEach((field) => {
        const control = field.querySelector("input, select");
        if (control && !control.validity.valid) {
            field.classList.add("is-invalid");
        }
    });

    if (!signupForm.checkValidity()) {
        return;
    }

    const role = signupForm.role.value;
    const name = role === "hr" ? "HR Officer" : "Employee";

    localStorage.setItem("hrmsUser", JSON.stringify({
        employeeId: signupForm.employeeId.value.trim(),
        email: signupForm.email.value.trim().toLowerCase(),
        role,
        name
    }));

    successBanner.hidden = false;

    window.setTimeout(() => {
        window.location.href = role === "hr" ? "index_dashboard_admin.html" : "index_dashboard_employee.html";
    }, 700);
});

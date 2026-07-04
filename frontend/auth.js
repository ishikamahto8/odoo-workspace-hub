/**
 * Authentication and Authorization Controller
 * Handles client-side identity validation and role scope routing
 */

document.addEventListener("DOMContentLoaded", function () {
    // 1. PASSWORD VISIBILITY TOGGLE MECHANISM
    const togglePasswordIcons = document.querySelectorAll(".toggle-password");
    
    togglePasswordIcons.forEach(icon => {
        icon.addEventListener("click", function () {
            // Find the input field relative to the eye icon wrapper
            const passwordInput = this.parentElement.querySelector("input");
            
            if (passwordInput.type === "password") {
                passwordInput.type = "text";
                this.classList.remove("far", "fa-eye");
                this.classList.add("fas", "fa-eye-slash");
            } else {
                passwordInput.type = "password";
                this.classList.remove("fas", "fa-eye-slash");
                this.classList.add("far", "fa-eye");
            }
        });
    });

    // 2. FORM INTERCEPTION & LOGIC DISPATCHERS
    const forms = document.querySelectorAll("form");
    
    forms.forEach(form => {
        form.addEventListener("submit", function (event) {
            // Stop standard HTML page redirection so JavaScript can validate first
            event.preventDefault(); 
            
            // Check if we are processing the Sign In page or Sign Up page
            const isSignUpForm = document.getElementById("orgRole") !== null;

            if (isSignUpForm) {
                handleSignUp(this);
            } else {
                handleSignIn(this);
            }
        });
    });
});

/**
 * Validates credentials and simulates an active AuthN process
 */
function handleSignIn(formElement) {
    const emailInput = document.getElementById("loginEmail").value.trim();
    const passwordInput = document.getElementById("loginPassword").value;
    const errorBanner = document.querySelector(".error-banner");

    // Hide error banner initially on form submit
    if (errorBanner) errorBanner.style.display = "none";

    // Simple interactive demo check:
    // If password matches the placeholder mask or is left blank, throw mock interface error
    if (passwordInput === "••••••••••••" || passwordInput.length < 4) {
        if (errorBanner) {
            errorBanner.querySelector("span").innerText = "AuthN Validation Failure: Invalid passcode configuration string.";
            errorBanner.style.display = "flex";
        }
        return;
    }

    // Success Simulation: Save standard consumer role permission token state
    localStorage.setItem("userAuthorizationRole", "standard");
    
    // Redirect cleanly via code runtime
    window.location.href = "dashboard.html";
}

/**
 * Processes registration vectors and binds Role-Based Access Control permissions (AuthZ)
 */
function handleSignUp(formElement) {
    const tenantId = document.getElementById("tenantId").value.trim();
    const regEmail = document.getElementById("regEmail").value.trim();
    const selectedRole = document.getElementById("orgRole").value;
    const regPassword = document.getElementById("regPassword").value;
    const infoBanner = document.querySelector(".info-banner");

    // Basic structural code validation framework
    if (!selectedRole) {
        alert("Please assign a valid authorization role scope tier.");
        return;
    }

    if (regPassword.length < 8) {
        alert("Password does not meet entropy configuration rules (Minimum 8 characters required).");
        return;
    }

    // Capture dynamic role choice from the dropdown selection box (AuthZ Setup)
    // Stores the selection safely in browser local storage memory
    localStorage.setItem("userAuthorizationRole", selectedRole);

    alert(`Identity initialized successfully under role scope: ${selectedRole.toUpperCase()}. Redirecting...`);
    
    // Authorization successful, push to local workspace
    window.location.href = "dashboard.html";
}
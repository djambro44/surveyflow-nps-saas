// SurveyFlow - Main JavaScript

// Modal functionality
function openModal(type) {
    const modal = document.getElementById(type + 'Modal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
}

function closeModal(type) {
    const modal = document.getElementById(type + 'Modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore scrolling
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const signupModal = document.getElementById('signupModal');
    const loginModal = document.getElementById('loginModal');
    
    if (event.target === signupModal) {
        closeModal('signup');
    }
    if (event.target === loginModal) {
        closeModal('login');
    }
}

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal('signup');
        closeModal('login');
    }
});

// Form validation and submission
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    return password.length >= 8;
}

function showFormError(inputId, message) {
    const input = document.getElementById(inputId);
    const existingError = input.parentNode.querySelector('.error-message');
    
    if (existingError) {
        existingError.remove();
    }
    
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.style.color = '#e74c3c';
    errorElement.style.fontSize = '0.9rem';
    errorElement.style.marginTop = '5px';
    errorElement.textContent = message;
    
    input.parentNode.appendChild(errorElement);
    input.style.borderColor = '#e74c3c';
}

function clearFormErrors(form) {
    const errors = form.querySelectorAll('.error-message');
    errors.forEach(error => error.remove());
    
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => {
        input.style.borderColor = '#e1e5e9';
    });
}

// Signup form handling
document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signupForm');
    const loginForm = document.getElementById('loginForm');
    
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            clearFormErrors(signupForm);
            
            const email = document.getElementById('signupEmail').value.trim();
            const password = document.getElementById('signupPassword').value;
            const company = document.getElementById('companyName').value.trim();
            
            let isValid = true;
            
            // Validate email
            if (!email) {
                showFormError('signupEmail', 'Email is required');
                isValid = false;
            } else if (!validateEmail(email)) {
                showFormError('signupEmail', 'Please enter a valid email address');
                isValid = false;
            }
            
            // Validate password
            if (!password) {
                showFormError('signupPassword', 'Password is required');
                isValid = false;
            } else if (!validatePassword(password)) {
                showFormError('signupPassword', 'Password must be at least 8 characters long');
                isValid = false;
            }
            
            // Validate company name
            if (!company) {
                showFormError('companyName', 'Company name is required');
                isValid = false;
            }
            
            if (isValid) {
                // Show loading state
                const submitBtn = signupForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Creating Account...';
                submitBtn.disabled = true;
                
                // Simulate API call (replace with actual API call later)
                setTimeout(() => {
                    console.log('Signup data:', { email, password, company });
                    
                    // Reset button
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    
                    // Show success message
                    alert('Account created successfully! Welcome to SurveyFlow.');
                    closeModal('signup');
                    
                    // Clear form
                    signupForm.reset();
                }, 1500);
            }
        });
    }
    
    // Login form handling
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            clearFormErrors(loginForm);
            
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value;
            
            let isValid = true;
            
            // Validate email
            if (!email) {
                showFormError('loginEmail', 'Email is required');
                isValid = false;
            } else if (!validateEmail(email)) {
                showFormError('loginEmail', 'Please enter a valid email address');
                isValid = false;
            }
            
            // Validate password
            if (!password) {
                showFormError('loginPassword', 'Password is required');
                isValid = false;
            }
            
            if (isValid) {
                // Show loading state
                const submitBtn = loginForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Logging in...';
                submitBtn.disabled = true;
                
                // Simulate API call (replace with actual API call later)
                setTimeout(() => {
                    console.log('Login data:', { email, password });
                    
                    // Reset button
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    
                    // Show success message
                    alert('Login successful! Redirecting to dashboard...');
                    closeModal('login');
                    
                    //

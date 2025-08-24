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
// Expose modal functions globally for HTML event handlers
window.openModal = openModal;
window.closeModal = closeModal;

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

// Firebase Auth and Firestore integration
import { auth, db } from './firebase.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";

document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signupForm');
    const loginForm = document.getElementById('loginForm');

    if (signupForm) {
        signupForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            clearFormErrors(signupForm);
            const email = document.getElementById('signupEmail').value.trim();
            const password = document.getElementById('signupPassword').value;
            const company = document.getElementById('companyName').value.trim();
            let isValid = true;
            if (!email) {
                showFormError('signupEmail', 'Email is required');
                isValid = false;
            } else if (!validateEmail(email)) {
                showFormError('signupEmail', 'Please enter a valid email address');
                isValid = false;
            }
            if (!password) {
                showFormError('signupPassword', 'Password is required');
                isValid = false;
            } else if (!validatePassword(password)) {
                showFormError('signupPassword', 'Password must be at least 8 characters long');
                isValid = false;
            }
            if (!company) {
                showFormError('companyName', 'Company name is required');
                isValid = false;
            }
            if (isValid) {
                const submitBtn = signupForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Creating Account...';
                submitBtn.disabled = true;
                try {
                    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                    // Save company name to Firestore under users collection
                    await setDoc(doc(db, "users", userCredential.user.uid), {
                        email: email,
                        company: company,
                        createdAt: new Date().toISOString()
                    });
                    alert('Account created successfully! Welcome to SurveyFlow.');
                    closeModal('signup');
                    signupForm.reset();
                } catch (error) {
                    showFormError('signupEmail', error.message);
                }
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            clearFormErrors(loginForm);
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value;
            let isValid = true;
            if (!email) {
                showFormError('loginEmail', 'Email is required');
                isValid = false;
            } else if (!validateEmail(email)) {
                showFormError('loginEmail', 'Please enter a valid email address');
                isValid = false;
            }
            if (!password) {
                showFormError('loginPassword', 'Password is required');
                isValid = false;
            }
            if (isValid) {
                const submitBtn = loginForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Logging in...';
                submitBtn.disabled = true;
                try {
                    const userCredential = await signInWithEmailAndPassword(auth, email, password);
                    alert('Login successful! Redirecting to dashboard...');
                    closeModal('login');
                    loginForm.reset();
                } catch (error) {
                    showFormError('loginEmail', error.message);
                }
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }
});

// Main JavaScript file for Smart Syllabus Tracker

// DOM Elements
const body = document.body;
const navLinks = document.querySelectorAll('nav a');
const sections = document.querySelectorAll('section');
const authTabs = document.querySelectorAll('.auth-tab');
const authForms = document.querySelectorAll('.auth-form');
const roleSelectors = document.querySelectorAll('.role-selector input[type="radio"]');
const studentFields = document.querySelector('.student-fields');
const facultyFields = document.querySelector('.faculty-fields');

// Initialize Firebase (will be configured later)
let firebaseConfig = {};

// Initialize Firebase when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Firebase with your config
    // firebase.initializeApp(firebaseConfig);
    
    // Initialize UI components
    initNavigation();
    initAuthTabs();
    initRoleSelectors();
    
    // Check if user is already logged in
    checkAuthState();
});

// Navigation functionality
function initNavigation() {
    if (!navLinks) return;
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Only handle navigation for section links
            if (this.getAttribute('data-section')) {
                e.preventDefault();
                const targetSection = this.getAttribute('data-section');
                
                // Remove active class from all links and add to clicked link
                navLinks.forEach(link => link.classList.remove('active'));
                this.classList.add('active');
                
                // Hide all sections and show target section
                sections.forEach(section => {
                    section.style.display = 'none';
                });
                
                document.getElementById(targetSection).style.display = 'block';
            }
        });
    });
    
    // Set default active section
    const defaultSection = document.querySelector('nav a[data-section]');
    if (defaultSection) {
        defaultSection.click();
    }
}

// Authentication tabs functionality
function initAuthTabs() {
    if (!authTabs || !authForms) return;
    
    authTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            
            // Update active tab
            authTabs.forEach(tab => tab.classList.remove('active'));
            this.classList.add('active');
            
            // Show target form
            authForms.forEach(form => {
                form.classList.remove('active');
                if (form.id === target) {
                    form.classList.add('active');
                }
            });
        });
    });
    
    // Set default active tab
    if (authTabs.length > 0) {
        authTabs[0].click();
    }
}

// Role selector functionality
function initRoleSelectors() {
    if (!roleSelectors || !studentFields || !facultyFields) return;
    
    roleSelectors.forEach(radio => {
        radio.addEventListener('change', function() {
            const role = this.value;
            
            if (role === 'student') {
                studentFields.style.display = 'block';
                facultyFields.style.display = 'none';
            } else if (role === 'faculty') {
                studentFields.style.display = 'none';
                facultyFields.style.display = 'block';
            }
        });
    });
    
    // Set default role fields
    const defaultRole = document.querySelector('.role-selector input[type="radio"]:checked');
    if (defaultRole) {
        defaultRole.dispatchEvent(new Event('change'));
    } else if (roleSelectors.length > 0) {
        roleSelectors[0].checked = true;
        roleSelectors[0].dispatchEvent(new Event('change'));
    }
}

// Check authentication state
function checkAuthState() {
    // This will be implemented with Firebase Auth
    // firebase.auth().onAuthStateChanged(user => {
    //     if (user) {
    //         // User is signed in
    //         console.log('User is signed in:', user.uid);
    //         // Redirect to appropriate dashboard based on user role
    //         getUserRole(user.uid).then(role => {
    //             if (role === 'student') {
    //                 window.location.href = 'student-dashboard.html';
    //             } else if (role === 'faculty') {
    //                 window.location.href = 'faculty-dashboard.html';
    //             }
    //         });
    //     } else {
    //         // User is signed out
    //         console.log('User is signed out');
    //     }
    // });
}

// Get user role from Firestore
function getUserRole(userId) {
    // This will be implemented with Firebase Firestore
    // return firebase.firestore().collection('users').doc(userId).get()
    //     .then(doc => {
    //         if (doc.exists) {
    //             return doc.data().role;
    //         } else {
    //             console.log('No such user document!');
    //             return null;
    //         }
    //     })
    //     .catch(error => {
    //         console.error('Error getting user role:', error);
    //         return null;
    //     });
    
    // Temporary mock implementation
    return Promise.resolve('student');
}

// Login functionality
function login(email, password) {
    // This will be implemented with Firebase Auth
    // return firebase.auth().signInWithEmailAndPassword(email, password)
    //     .then(userCredential => {
    //         // Signed in
    //         const user = userCredential.user;
    //         console.log('User logged in:', user.uid);
    //         return user;
    //     })
    //     .catch(error => {
    //         console.error('Login error:', error.code, error.message);
    //         throw error;
    //     });
    
    // Temporary mock implementation
    console.log('Mock login with:', email, password);
    return Promise.resolve({ uid: 'mock-user-id' });
}

// Register functionality
function register(email, password, role, additionalData) {
    // This will be implemented with Firebase Auth and Firestore
    // return firebase.auth().createUserWithEmailAndPassword(email, password)
    //     .then(userCredential => {
    //         // Signed up
    //         const user = userCredential.user;
    //         console.log('User registered:', user.uid);
    //         
    //         // Save additional user data to Firestore
    //         return firebase.firestore().collection('users').doc(user.uid).set({
    //             email: email,
    //             role: role,
    //             ...additionalData,
    //             createdAt: firebase.firestore.FieldValue.serverTimestamp()
    //         }).then(() => {
    //             console.log('User data saved to Firestore');
    //             return user;
    //         });
    //     })
    //     .catch(error => {
    //         console.error('Registration error:', error.code, error.message);
    //         throw error;
    //     });
    
    // Temporary mock implementation
    console.log('Mock register with:', email, password, role, additionalData);
    return Promise.resolve({ uid: 'mock-user-id' });
}

// Logout functionality
function logout() {
    // This will be implemented with Firebase Auth
    // return firebase.auth().signOut()
    //     .then(() => {
    //         console.log('User signed out');
    //         window.location.href = 'index.html';
    //     })
    //     .catch(error => {
    //         console.error('Logout error:', error);
    //     });
    
    // Temporary mock implementation
    console.log('Mock logout');
    window.location.href = 'index.html';
    return Promise.resolve();
}

// Google Sign-in functionality
function signInWithGoogle() {
    // This will be implemented with Firebase Auth
    // const provider = new firebase.auth.GoogleAuthProvider();
    // return firebase.auth().signInWithPopup(provider)
    //     .then(result => {
    //         // The signed-in user info
    //         const user = result.user;
    //         console.log('Google sign-in successful:', user.uid);
    //         
    //         // Check if user exists in Firestore
    //         return firebase.firestore().collection('users').doc(user.uid).get()
    //             .then(doc => {
    //                 if (!doc.exists) {
    //                     // New user, redirect to role selection
    //                     window.location.href = 'role-selection.html';
    //                 } else {
    //                     // Existing user, redirect to appropriate dashboard
    //                     const role = doc.data().role;
    //                     if (role === 'student') {
    //                         window.location.href = 'student-dashboard.html';
    //                     } else if (role === 'faculty') {
    //                         window.location.href = 'faculty-dashboard.html';
    //                     }
    //                 }
    //                 return user;
    //             });
    //     })
    //     .catch(error => {
    //         console.error('Google sign-in error:', error.code, error.message);
    //         throw error;
    //     });
    
    // Temporary mock implementation
    console.log('Mock Google sign-in');
    return Promise.resolve({ uid: 'mock-google-user-id' });
}

// Event listeners for login button
// Check if login button handler is already defined in auth.js
if (typeof window.loginBtnInitialized === 'undefined') {
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            const loginForm = document.getElementById('login-form');
            const email = loginForm.querySelector('input[type="email"]').value;
            const password = loginForm.querySelector('input[type="password"]').value;
            
            // Show loading state
            const originalBtnText = this.textContent;
            this.disabled = true;
            this.textContent = 'Signing in...';
            
            login(email, password)
                .then(user => {
                    console.log('Login successful');
                    // Redirect will be handled by checkAuthState
                })
                .catch(error => {
                    alert('Login failed: ' + error.message);
                    
                    // Reset button
                    this.disabled = false;
                    this.textContent = originalBtnText;
                });
        });
        window.loginBtnInitialized = true;
    }
}

// Event listeners for registration form
const registerForm = document.getElementById('register-form');
if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = this.querySelector('input[type="email"]').value;
        const password = this.querySelector('input[type="password"]').value;
        const role = document.querySelector('.role-selector input[type="radio"]:checked').value;
        
        let additionalData = {};
        
        if (role === 'student') {
            additionalData = {
                studentId: this.querySelector('#student-id').value,
                program: this.querySelector('#program').value,
                semester: this.querySelector('#semester').value
            };
        } else if (role === 'faculty') {
            additionalData = {
                facultyId: this.querySelector('#faculty-id').value,
                department: this.querySelector('#department').value
            };
        }
        
        register(email, password, role, additionalData)
            .then(user => {
                console.log('Registration successful');
                // Redirect will be handled by checkAuthState
            })
            .catch(error => {
                alert('Registration failed: ' + error.message);
            });
    });
}

// Event listener for Google sign-in button
const googleSignInBtn = document.querySelector('.google-signin');
if (googleSignInBtn) {
    googleSignInBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        signInWithGoogle()
            .then(user => {
                console.log('Google sign-in successful');
                // Redirect will be handled by the signInWithGoogle function
            })
            .catch(error => {
                alert('Google sign-in failed: ' + error.message);
            });
    });
}

// Event listener for logout button
const logoutBtn = document.querySelector('.logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        logout();
    });
}
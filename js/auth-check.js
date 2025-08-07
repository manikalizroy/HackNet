// Authentication check for protected pages

// This script checks if a user is authenticated and redirects accordingly
// It should be included on all protected pages (dashboards, syllabus pages)

document.addEventListener('DOMContentLoaded', () => {
    // Check if Firebase is initialized
    if (typeof firebase !== 'undefined' && firebase.apps.length > 0) {
        // Set up auth state listener
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                // User is signed in
                console.log('User is authenticated:', user.uid);
                
                // Get user data from Firestore
                getUserRoleAndRedirect(user.uid);
            } else {
                // User is not signed in, redirect to login page
                console.log('User is not authenticated, redirecting to login');
                window.location.href = 'login.html';
            }
        });
    } else {
        console.error('Firebase is not initialized');
        // Fallback to login page if Firebase is not available
        window.location.href = 'login.html';
    }
});

// Get user role and redirect to appropriate dashboard if needed
function getUserRoleAndRedirect(userId) {
    // Get current page
    const currentPage = window.location.pathname.split('/').pop();
    
    // Check if we're already on the correct page
    if (currentPage === 'student-dashboard.html' || currentPage === 'faculty-dashboard.html') {
        return; // Already on a dashboard page
    }
    
    // Get user role from Firestore
    firebase.firestore().collection('users').doc(userId).get()
        .then(doc => {
            if (doc.exists) {
                const userData = doc.data();
                const role = userData.role;
                
                // Store user data in session storage
                sessionStorage.setItem('userData', JSON.stringify({
                    id: doc.id,
                    ...userData
                }));
                
                // Redirect based on role if not on the correct page
                if (role === 'student' && currentPage !== 'student-dashboard.html') {
                    window.location.href = 'student-dashboard.html';
                } else if (role === 'faculty' && currentPage !== 'faculty-dashboard.html') {
                    window.location.href = 'faculty-dashboard.html';
                }
            } else {
                console.log('No user data found');
            }
        })
        .catch(error => {
            console.error('Error getting user data:', error);
        });
}
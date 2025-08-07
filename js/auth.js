// Firebase Auth - Role Based Login/Register + Forgot Password + Google Login

// === REGISTER ===
document.getElementById("register-btn").addEventListener("click", () => {
    const name = document.getElementById("register-name").value.trim();
    const email = document.getElementById("register-email").value.trim();
    const password = document.getElementById("register-password").value;
    const confirmPassword = document.getElementById("register-confirm-password").value;
    const role = document.querySelector('input[name="reg-role"]:checked').value;

    if (!name || !email || !password || !confirmPassword) {
        return alert("Please fill all required fields.");
    }

    if (password !== confirmPassword) {
        return alert("Passwords do not match.");
    }

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            const userId = user.uid;
            const db = firebase.firestore();

            // Prepare data to store in Firestore
            let userData = {
                name: name,
                email: email,
                role: role,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            };

            if (role === "student") {
                userData.studentId = document.getElementById("student-id").value.trim();
                userData.program = document.getElementById("program").value;
                userData.semester = document.getElementById("semester").value;
            } else if (role === "faculty") {
                userData.facultyId = document.getElementById("faculty-id").value.trim();
                userData.department = document.getElementById("department").value;
            }

            // Save user data in Firestore
            db.collection("users").doc(userId).set(userData)
                .then(() => {
                    alert("Registration successful!");
                    window.location.href = "login.html";
                })
                .catch((error) => {
                    console.error("Error saving user data:", error);
                    alert("Error saving user data.");
                });
        })
        .catch((error) => {
            alert("Error: " + error.message);
        });
});


// === LOGIN ===
document.getElementById("login-btn").addEventListener("click", () => {
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;
    const selectedRole = document.querySelector('input[name="role"]:checked').value;

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            const userId = user.uid;
            const db = firebase.firestore();

            // Fetch user role from Firestore to verify
            db.collection("users").doc(userId).get()
                .then((doc) => {
                    if (doc.exists) {
                        const storedRole = doc.data().role;
                        if (storedRole === selectedRole) {
                            if (storedRole === "student") {
                                window.location.href = "student-dashboard.html";
                            } else if (storedRole === "faculty") {
                                window.location.href = "faculty-dashboard.html";
                            }
                        } else {
                            firebase.auth().signOut();
                            alert("Role mismatch! Please select the correct role.");
                        }
                    } else {
                        alert("User data not found.");
                    }
                })
                .catch((error) => {
                    console.error("Error fetching user data:", error);
                    alert("Failed to verify user role.");
                });
        })
        .catch((error) => {
            alert("Login failed: " + error.message);
        });
});


// === FORGOT PASSWORD ===
document.getElementById("forgot-password-link").addEventListener("click", (e) => {
    e.preventDefault();
    const email = prompt("Enter your email for password reset:");

    if (email) {
        firebase.auth().sendPasswordResetEmail(email)
            .then(() => {
                alert("Password reset email sent. Please check your inbox.");
            })
            .catch((error) => {
                alert("Error: " + error.message);
            });
    }
});


// === GOOGLE LOGIN (Optional) ===
document.getElementById("google-login").addEventListener("click", () => {
    const provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider)
        .then((result) => {
            const user = result.user;
            const db = firebase.firestore();

            // Check if user data already exists
            db.collection("users").doc(user.uid).get()
                .then((doc) => {
                    if (doc.exists) {
                        const role = doc.data().role;
                        if (role === "student") {
                            window.location.href = "student-dashboard.html";
                        } else if (role === "faculty") {
                            window.location.href = "faculty-dashboard.html";
                        } else {
                            alert("Role not defined. Contact admin.");
                        }
                    } else {
                        // New user - ask to complete profile
                        alert("New user. Please complete your profile.");
                        // Optionally redirect to profile setup page
                        // window.location.href = "complete-profile.html";
                    }
                });
        })
        .catch((error) => {
            alert("Google login failed: " + error.message);
        });
});

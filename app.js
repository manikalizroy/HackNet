// DOM Elements
const authContainer = document.getElementById('auth-container');
const dashboard = document.getElementById('dashboard');
const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const logoutBtn = document.getElementById('logout-btn');
const topicsContainer = document.getElementById('topics-container');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const courseNameElement = document.getElementById('course-name');
const adminPanel = document.getElementById('admin-panel');
const newTopicInput = document.getElementById('new-topic');
const topicDateInput = document.getElementById('topic-date');
const addTopicBtn = document.getElementById('add-topic-btn');
const alertBtn = document.getElementById('alert-btn');

// Initialize Firebase
const auth = firebase.auth();
const firestore = firebase.firestore();

// Current course reference
let currentCourseRef = null;

// Login event
loginBtn.addEventListener('click', () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  auth.signInWithEmailAndPassword(email, password)
    .catch(error => {
      alert(`Login failed: ${error.message}`);
    });
});

// Signup event
signupBtn.addEventListener('click', () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  auth.createUserWithEmailAndPassword(email, password)
    .then(cred => {
      return firestore.collection('users').doc(cred.user.uid).set({
        email: email,
        role: 'teacher'
      });
    })
    .catch(error => {
      alert(`Signup failed: ${error.message}`);
    });
});

// Logout event
logoutBtn.addEventListener('click', () => {
  auth.signOut();
  alert('You have been logged out.');
});

// Add topic event
addTopicBtn.addEventListener('click', () => {
  const title = newTopicInput.value.trim();
  if (!title) return;

  const scheduledDate = topicDateInput.value ? new Date(topicDateInput.value) : null;

  if (!currentCourseRef) {
    alert('No course selected');
    return;
  }

  currentCourseRef.collection('topics').add({
    title: title,
    isCompleted: false,
    scheduledDate: scheduledDate ? firebase.firestore.Timestamp.fromDate(scheduledDate) : null,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    newTopicInput.value = '';
    topicDateInput.value = '';
  }).catch(error => {
    alert(`Error adding topic: ${error.message}`);
  });
});

// Alert button event
alertBtn.addEventListener('click', () => {
  checkAlerts();
});

// Auth state change listener
auth.onAuthStateChanged(user => {
  if (user) {
    authContainer.classList.add('hidden');
    dashboard.classList.remove('hidden');

    firestore.collection('users').doc(user.uid).get()
      .then(doc => {
        if (!doc.exists) {
          throw new Error('User document not found');
        }

        const userData = doc.data();
        adminPanel.classList.toggle('hidden', userData.role !== 'teacher');
        loadUserCourse(user.uid, userData.role);
      })
      .catch(error => {
        console.error('Error loading user data:', error);
        auth.signOut();
      });
  } else {
    authContainer.classList.remove('hidden');
    dashboard.classList.add('hidden');
    adminPanel.classList.add('hidden');
    currentCourseRef = null;
  }
});

// Load the user's course
function loadUserCourse(userId, role) {
  let courseQuery = role === 'teacher'
    ? firestore.collection('courses').where('instructorId', '==', userId)
    : firestore.collection('courses').limit(1);

  courseQuery.get()
    .then(snapshot => {
      if (snapshot.empty) {
        return createDemoCourse(userId);
      }

      const courseDoc = snapshot.docs[0];
      currentCourseRef = courseDoc.ref;
      courseNameElement.textContent = courseDoc.data().name;
      loadTopics(role);
    })
    .catch(error => {
      console.error('Error loading course:', error);
    });
}

// Create a demo course
function createDemoCourse(userId) {
  return firestore.collection('courses').add({
    name: "Introduction to Web Development",
    instructorId: userId,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  })
    .then(docRef => {
      currentCourseRef = docRef;
      courseNameElement.textContent = "Introduction to Web Development";

      const batch = firestore.batch();
      const topics = [
        { title: "HTML Basics", scheduledDate: new Date() },
        { title: "CSS Fundamentals", scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
        { title: "JavaScript Essentials", scheduledDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) }
      ];

      topics.forEach(topic => {
        const topicRef = docRef.collection('topics').doc();
        batch.set(topicRef, {
          ...topic,
          isCompleted: false,
          scheduledDate: firebase.firestore.Timestamp.fromDate(topic.scheduledDate),
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      });

      return batch.commit();
    })
    .then(() => {
      loadTopics('teacher');
    })
    .catch(error => {
      console.error('Error creating demo course:', error);
    });
}

// Load topics for current course
function loadTopics(role) {
  if (!currentCourseRef) return;

  topicsContainer.innerHTML = '';

  currentCourseRef.collection('topics')
    .orderBy('createdAt')
    .onSnapshot(snapshot => {
      let completedCount = 0;
      topicsContainer.innerHTML = '';

      snapshot.forEach(doc => {
        const topic = doc.data();
        const topicId = doc.id;
        const scheduledDate = topic.scheduledDate?.toDate();

        const topicElement = document.createElement('div');
        topicElement.className = 'topic-item';
        if (topic.isCompleted) {
          topicElement.classList.add('topic-completed');
          completedCount++;
        }

        topicElement.innerHTML = `
          <div class="topic-info">
            <div class="topic-title">${topic.title}</div>
            ${scheduledDate ? `<div class="topic-date">Scheduled: ${scheduledDate.toLocaleDateString()}</div>` : ''}
          </div>
          <input type="checkbox" data-id="${topicId}" ${topic.isCompleted ? 'checked' : ''} ${role === 'student' ? 'disabled' : ''}>
        `;

        topicsContainer.appendChild(topicElement);

        if (role !== 'student') {
          topicElement.querySelector('input').addEventListener('change', (e) => {
            currentCourseRef.collection('topics').doc(topicId).update({
              isCompleted: e.target.checked,
              updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
          });
        }
      });

      const totalTopics = snapshot.size;
      const progress = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;
      progressBar.style.width = `${progress}%`;
      progressText.textContent = `${progress}% Complete`;

      if (role === 'teacher') checkAlerts();
    }, error => {
      console.error("Error loading topics:", error);
    });
}

// Check for topics behind schedule
function checkAlerts() {
  if (!currentCourseRef) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let hasAlerts = false;

  document.querySelectorAll('.topic-item').forEach(item => {
    const checkbox = item.querySelector('input');
    const isCompleted = checkbox.checked;
    const dateElement = item.querySelector('.topic-date');

    if (dateElement && !isCompleted) {
      const dateText = dateElement.textContent.replace('Scheduled: ', '');
      const scheduledDate = new Date(dateText);
      scheduledDate.setHours(0, 0, 0, 0);

      if (scheduledDate < today) {
        item.classList.add('alert');
        hasAlerts = true;
      } else {
        item.classList.remove('alert');
      }
    }
  });

  alert(hasAlerts ? 'Some topics are behind schedule!' : 'All topics are on track!');
}

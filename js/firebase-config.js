// Firebase configuration for Smart Syllabus Tracker

// Firebase configuration object
// Replace these values with your actual Firebase project configuration
window.firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

// Initialize Firebase
function initializeFirebase() {
  // Check if Firebase is already initialized
  if (!firebase.apps.length) {
    firebase.initializeApp(window.firebaseConfig);
  }
  
  // Initialize Firebase services
  const auth = firebase.auth();
  const db = firebase.firestore();
  const storage = firebase.storage();
  
  // Enable Firestore offline persistence if supported
  db.enablePersistence()
    .catch((err) => {
      if (err.code === 'failed-precondition') {
        // Multiple tabs open, persistence can only be enabled in one tab at a time
        console.log('Persistence failed: Multiple tabs open');
      } else if (err.code === 'unimplemented') {
        // The current browser does not support all of the features required for persistence
        console.log('Persistence not supported by this browser');
      }
    });
  
  return { auth, db, storage };
}

// Initialize Firebase when the page loads
document.addEventListener('DOMContentLoaded', () => {
  initializeFirebase();
  console.log('Firebase initialized from firebase-config.js');
});

// Firebase collections references
function getFirebaseCollections() {
  const db = firebase.firestore();
  
  return {
    users: db.collection('users'),
    students: db.collection('students'),
    faculty: db.collection('faculty'),
    courses: db.collection('courses'),
    syllabi: db.collection('syllabi'),
    progress: db.collection('progress'),
    notifications: db.collection('notifications')
  };
}

// Get current user data from Firestore
async function getCurrentUserData() {
  const auth = firebase.auth();
  const db = firebase.firestore();
  
  if (!auth.currentUser) {
    return null;
  }
  
  const uid = auth.currentUser.uid;
  
  try {
    // Get user document
    const userDoc = await db.collection('users').doc(uid).get();
    
    if (!userDoc.exists) {
      console.log('No user data found');
      return null;
    }
    
    const userData = userDoc.data();
    
    // Get role-specific data
    if (userData.role === 'student') {
      const studentDoc = await db.collection('students').doc(uid).get();
      if (studentDoc.exists) {
        return { ...userData, ...studentDoc.data() };
      }
    } else if (userData.role === 'faculty') {
      const facultyDoc = await db.collection('faculty').doc(uid).get();
      if (facultyDoc.exists) {
        return { ...userData, ...facultyDoc.data() };
      }
    }
    
    return userData;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
}

// Get student progress for a specific syllabus
async function getStudentProgress(studentId, syllabusId) {
  const db = firebase.firestore();
  
  try {
    const progressDoc = await db.collection('progress')
      .where('studentId', '==', studentId)
      .where('syllabusId', '==', syllabusId)
      .limit(1)
      .get();
    
    if (progressDoc.empty) {
      // No progress record found, create a new one
      return createNewProgressRecord(studentId, syllabusId);
    }
    
    return progressDoc.docs[0].data();
  } catch (error) {
    console.error('Error getting student progress:', error);
    return null;
  }
}

// Create a new progress record for a student and syllabus
async function createNewProgressRecord(studentId, syllabusId) {
  const db = firebase.firestore();
  
  try {
    // Get syllabus data to initialize progress
    const syllabusDoc = await db.collection('syllabi').doc(syllabusId).get();
    
    if (!syllabusDoc.exists) {
      console.error('Syllabus not found');
      return null;
    }
    
    const syllabusData = syllabusDoc.data();
    
    // Initialize progress data
    const progressData = {
      studentId,
      syllabusId,
      courseId: syllabusData.courseId,
      lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
      overallProgress: 0,
      topicsProgress: {}
    };
    
    // Initialize progress for each topic and subtopic
    if (syllabusData.topics) {
      syllabusData.topics.forEach(topic => {
        progressData.topicsProgress[topic.id] = {
          completed: false,
          subtopics: {}
        };
        
        if (topic.subtopics) {
          topic.subtopics.forEach(subtopic => {
            progressData.topicsProgress[topic.id].subtopics[subtopic.id] = {
              completed: false
            };
          });
        }
      });
    }
    
    // Add progress record to Firestore
    const progressRef = await db.collection('progress').add(progressData);
    
    // Return the created progress data with ID
    return { id: progressRef.id, ...progressData };
  } catch (error) {
    console.error('Error creating progress record:', error);
    return null;
  }
}

// Update student progress for a topic or subtopic
async function updateStudentProgress(progressId, topicId, subtopicId = null, completed) {
  const db = firebase.firestore();
  
  try {
    const progressRef = db.collection('progress').doc(progressId);
    const progressDoc = await progressRef.get();
    
    if (!progressDoc.exists) {
      console.error('Progress record not found');
      return false;
    }
    
    const progressData = progressDoc.data();
    
    // Update the specific topic or subtopic
    if (subtopicId) {
      // Update subtopic
      if (!progressData.topicsProgress[topicId] ||
          !progressData.topicsProgress[topicId].subtopics) {
        console.error('Topic or subtopics not found in progress data');
        return false;
      }
      
      progressData.topicsProgress[topicId].subtopics[subtopicId] = {
        completed: completed
      };
      
      // Check if all subtopics are completed
      const allSubtopicsCompleted = Object.values(progressData.topicsProgress[topicId].subtopics)
        .every(subtopic => subtopic.completed);
      
      // Update topic completion status based on subtopics
      progressData.topicsProgress[topicId].completed = allSubtopicsCompleted;
    } else {
      // Update topic
      if (!progressData.topicsProgress[topicId]) {
        console.error('Topic not found in progress data');
        return false;
      }
      
      progressData.topicsProgress[topicId].completed = completed;
      
      // Update all subtopics to match topic status
      if (progressData.topicsProgress[topicId].subtopics) {
        Object.keys(progressData.topicsProgress[topicId].subtopics).forEach(subId => {
          progressData.topicsProgress[topicId].subtopics[subId].completed = completed;
        });
      }
    }
    
    // Calculate overall progress
    const totalTopics = Object.keys(progressData.topicsProgress).length;
    const completedTopics = Object.values(progressData.topicsProgress)
      .filter(topic => topic.completed)
      .length;
    
    progressData.overallProgress = totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0;
    progressData.lastUpdated = firebase.firestore.FieldValue.serverTimestamp();
    
    // Update progress record in Firestore
    await progressRef.update({
      [`topicsProgress.${topicId}${subtopicId ? `.subtopics.${subtopicId}` : ''}.completed`]: completed,
      overallProgress: progressData.overallProgress,
      lastUpdated: progressData.lastUpdated
    });
    
    return true;
  } catch (error) {
    console.error('Error updating progress:', error);
    return false;
  }
}

// Get all syllabi for a course
async function getCourseSyllabi(courseId) {
  const db = firebase.firestore();
  
  try {
    const syllabiSnapshot = await db.collection('syllabi')
      .where('courseId', '==', courseId)
      .get();
    
    if (syllabiSnapshot.empty) {
      return [];
    }
    
    return syllabiSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting course syllabi:', error);
    return [];
  }
}

// Get all courses for a faculty member
async function getFacultyCourses(facultyId) {
  const db = firebase.firestore();
  
  try {
    const coursesSnapshot = await db.collection('courses')
      .where('facultyId', '==', facultyId)
      .get();
    
    if (coursesSnapshot.empty) {
      return [];
    }
    
    return coursesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting faculty courses:', error);
    return [];
  }
}

// Get all courses for a student
async function getStudentCourses(studentId) {
  const db = firebase.firestore();
  
  try {
    const enrollmentsSnapshot = await db.collection('enrollments')
      .where('studentId', '==', studentId)
      .get();
    
    if (enrollmentsSnapshot.empty) {
      return [];
    }
    
    // Get course IDs from enrollments
    const courseIds = enrollmentsSnapshot.docs.map(doc => doc.data().courseId);
    
    // Get course details
    const courses = [];
    
    for (const courseId of courseIds) {
      const courseDoc = await db.collection('courses').doc(courseId).get();
      
      if (courseDoc.exists) {
        courses.push({
          id: courseDoc.id,
          ...courseDoc.data()
        });
      }
    }
    
    return courses;
  } catch (error) {
    console.error('Error getting student courses:', error);
    return [];
  }
}

// Create or update a syllabus
async function saveSyllabus(syllabusData, syllabusId = null) {
  const db = firebase.firestore();
  const auth = firebase.auth();
  
  if (!auth.currentUser) {
    console.error('User not authenticated');
    return null;
  }
  
  try {
    // Add timestamp and user info
    const dataToSave = {
      ...syllabusData,
      lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
      lastUpdatedBy: auth.currentUser.uid
    };
    
    // If creating a new syllabus, add created timestamp
    if (!syllabusId) {
      dataToSave.createdAt = firebase.firestore.FieldValue.serverTimestamp();
      dataToSave.createdBy = auth.currentUser.uid;
    }
    
    let savedSyllabusId;
    
    if (syllabusId) {
      // Update existing syllabus
      await db.collection('syllabi').doc(syllabusId).update(dataToSave);
      savedSyllabusId = syllabusId;
    } else {
      // Create new syllabus
      const syllabusRef = await db.collection('syllabi').add(dataToSave);
      savedSyllabusId = syllabusRef.id;
    }
    
    return savedSyllabusId;
  } catch (error) {
    console.error('Error saving syllabus:', error);
    return null;
  }
}

// Export Firebase functions
window.firebaseService = {
  initializeFirebase,
  getFirebaseCollections,
  getCurrentUserData,
  getStudentProgress,
  updateStudentProgress,
  getCourseSyllabi,
  getFacultyCourses,
  getStudentCourses,
  saveSyllabus
};
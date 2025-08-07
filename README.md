# Smart Syllabus Tracker

A web-based application for tracking and managing course syllabi for students and faculty members.

## Overview

Smart Syllabus Tracker is a comprehensive web application that allows students to track their progress through course syllabi and enables faculty members to create, edit, and manage syllabi for their courses. The application provides an intuitive interface for both students and faculty, with role-specific dashboards and features.

## Features

### For Students

- **User Authentication**: Secure login and registration with email/password or Google authentication
- **Dashboard**: Overview of enrolled courses, completed topics, upcoming deadlines, and overall progress
- **Progress Tracking**: Mark topics and subtopics as completed to track progress through syllabi
- **Course Management**: View all enrolled courses and their associated syllabi
- **Notifications**: Receive updates about syllabus changes and upcoming deadlines

### For Faculty

- **User Authentication**: Secure login and registration with email/password or Google authentication
- **Dashboard**: Overview of active courses, total students, syllabus updates, and average student progress
- **Syllabus Management**: Create, edit, and publish syllabi for courses
- **Course Management**: Manage courses and their associated syllabi
- **Student Progress Monitoring**: View student progress through syllabi

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Responsive Design**: Mobile-friendly interface that works on all devices

## Project Structure

```
├── index.html              # Main entry point
├── login.html              # Authentication page
├── student-dashboard.html  # Dashboard for students
├── faculty-dashboard.html  # Dashboard for faculty
├── syllabus.html           # Syllabus view/edit page
├── css/
│   └── style.css          # Main stylesheet
├── js/
│   ├── app.js             # Main application logic
│   ├── auth.js            # Authentication logic
│   ├── dashboard.js       # Dashboard functionality
│   ├── syllabus.js        # Syllabus functionality
│   └── firebase-config.js # Firebase configuration
└── images/                # Image assets
```

## Setup and Installation

1. Clone the repository or download the source code
2. Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
3. Enable Authentication (Email/Password and Google providers)
4. Create a Firestore database with the following collections:
   - users
   - students
   - faculty
   - courses
   - syllabi
   - progress
   - notifications
5. Update the Firebase configuration in `js/firebase-config.js` with your project's configuration
6. Deploy the application to Firebase Hosting or any web server

## Firebase Data Structure

### Users Collection
```
users/
  {userId}/
    email: string
    displayName: string
    photoURL: string
    role: "student" | "faculty"
    createdAt: timestamp
    lastLogin: timestamp
```

### Students Collection
```
students/
  {userId}/
    studentId: string
    program: string
    semester: number
    enrolledCourses: array
    department: string
```

### Faculty Collection
```
faculty/
  {userId}/
    facultyId: string
    department: string
    position: string
    courses: array
```

### Courses Collection
```
courses/
  {courseId}/
    code: string
    title: string
    description: string
    facultyId: string
    semester: number
    year: number
    department: string
    enrolledStudents: array
```

### Syllabi Collection
```
syllabi/
  {syllabusId}/
    courseId: string
    title: string
    code: string
    instructor: string
    description: string
    objectives: array
    topics: array
    assessment: array
    materials: array
    createdAt: timestamp
    createdBy: string
    lastUpdated: timestamp
    lastUpdatedBy: string
```

### Progress Collection
```
progress/
  {progressId}/
    studentId: string
    syllabusId: string
    courseId: string
    overallProgress: number
    topicsProgress: object
    lastUpdated: timestamp
```

### Notifications Collection
```
notifications/
  {notificationId}/
    userId: string
    type: string
    title: string
    message: string
    read: boolean
    createdAt: timestamp
    relatedId: string
```

## Usage

### Student Workflow

1. Register or log in as a student
2. View the dashboard to see enrolled courses and progress
3. Select a course to view its syllabus
4. Mark topics and subtopics as completed to track progress
5. Receive notifications about syllabus updates

### Faculty Workflow

1. Register or log in as a faculty member
2. View the dashboard to see active courses and student progress
3. Create or edit syllabi for courses
4. Monitor student progress through syllabi
5. Update syllabi as needed

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For any questions or support, please contact [your-email@example.com](mailto:your-email@example.com).
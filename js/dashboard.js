// Dashboard functionality for Smart Syllabus Tracker

// DOM Elements
const progressBars = document.querySelectorAll('.progress-bar');
const courseCards = document.querySelectorAll('.course-card');
const syllabusItems = document.querySelectorAll('.syllabus-item');
const syllabusCheckboxes = document.querySelectorAll('.syllabus-item input[type="checkbox"]');
const filterButtons = document.querySelectorAll('.filter-btn');
const searchInput = document.querySelector('.search-input');
const notificationBell = document.querySelector('.notification-bell');
const notificationDropdown = document.querySelector('.notification-dropdown');
const sidebarToggle = document.querySelector('.sidebar-toggle');
const sidebar = document.querySelector('.sidebar');

// Initialize dashboard when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize UI components
    initProgressBars();
    initCourseCards();
    initSyllabusItems();
    initFilters();
    initSearch();
    initNotifications();
    initSidebar();
    
    // Load user data and dashboard content
    loadDashboardData();
});

// Initialize progress bars with animation
function initProgressBars() {
    if (!progressBars) return;
    
    progressBars.forEach(progressBar => {
        const targetWidth = progressBar.getAttribute('data-progress') + '%';
        
        // Animate progress bar width
        setTimeout(() => {
            progressBar.style.width = targetWidth;
        }, 100);
    });
}

// Initialize course cards with click events
function initCourseCards() {
    if (!courseCards) return;
    
    courseCards.forEach(card => {
        card.addEventListener('click', function() {
            const courseId = this.getAttribute('data-course-id');
            if (courseId) {
                window.location.href = `syllabus.html?id=${courseId}`;
            }
        });
    });
}

// Initialize syllabus items with checkbox events
function initSyllabusItems() {
    if (!syllabusCheckboxes) return;
    
    syllabusCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const itemId = this.getAttribute('data-item-id');
            const isCompleted = this.checked;
            
            // Update syllabus item status
            updateSyllabusItemStatus(itemId, isCompleted);
            
            // Update parent item if all children are checked
            const parentItem = this.closest('.syllabus-item');
            if (parentItem) {
                const parentId = parentItem.getAttribute('data-item-id');
                updateParentItemStatus(parentId);
            }
            
            // Update progress bars
            updateProgressBars();
        });
    });
}

// Initialize filter buttons
function initFilters() {
    if (!filterButtons) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Apply filter to items
            applySyllabusFilter(filter);
        });
    });
}

// Initialize search functionality
function initSearch() {
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        
        // Apply search filter to items
        applySearchFilter(searchTerm);
    });
}

// Initialize notification functionality
function initNotifications() {
    if (!notificationBell || !notificationDropdown) return;
    
    notificationBell.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Toggle notification dropdown
        notificationDropdown.classList.toggle('show');
        
        // Mark notifications as read
        if (notificationDropdown.classList.contains('show')) {
            markNotificationsAsRead();
        }
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!notificationDropdown.contains(e.target) && !notificationBell.contains(e.target)) {
            notificationDropdown.classList.remove('show');
        }
    });
}

// Initialize sidebar toggle functionality
function initSidebar() {
    if (!sidebarToggle || !sidebar) return;
    
    sidebarToggle.addEventListener('click', function() {
        sidebar.classList.toggle('collapsed');
        document.body.classList.toggle('sidebar-collapsed');
    });
}

// Load dashboard data from Firebase
function loadDashboardData() {
    // Get user data from session storage
    const userDataString = sessionStorage.getItem('userData');
    if (!userDataString) {
        console.log('No user data found in session storage');
        return;
    }
    
    const userData = JSON.parse(userDataString);
    console.log('User data loaded:', userData);
    
    // Update user profile information
    updateUserProfile(userData);
    
    // Load appropriate data based on user role
    if (userData.role === 'student') {
        loadStudentDashboard(userData);
    } else if (userData.role === 'faculty') {
        loadFacultyDashboard(userData);
    }
}

// Update user profile information in the UI
function updateUserProfile(userData) {
    const userNameElements = document.querySelectorAll('.user-name');
    const userRoleElements = document.querySelectorAll('.user-role');
    const userEmailElements = document.querySelectorAll('.user-email');
    const userAvatarElements = document.querySelectorAll('.user-avatar');
    
    // Set user name
    userNameElements.forEach(el => {
        if (el) el.textContent = userData.displayName || userData.email.split('@')[0];
    });
    
    // Set user role with proper capitalization
    userRoleElements.forEach(el => {
        if (el) el.textContent = userData.role.charAt(0).toUpperCase() + userData.role.slice(1);
    });
    
    // Set user email
    userEmailElements.forEach(el => {
        if (el) el.textContent = userData.email;
    });
    
    // Set user avatar
    userAvatarElements.forEach(el => {
        if (!el) return;
        
        if (userData.photoURL) {
            el.src = userData.photoURL;
            el.alt = userData.displayName || userData.email.split('@')[0];
        } else {
            // Set default avatar with initials
            const initials = (userData.displayName || userData.email.split('@')[0]).charAt(0).toUpperCase();
            el.style.display = 'none';
            // If there's a parent element for the avatar that can show initials
            const parent = el.parentElement;
            if (parent && parent.classList.contains('avatar-container')) {
                parent.setAttribute('data-initials', initials);
                parent.classList.add('avatar-initials');
            }
        }
    });
}

// Load student dashboard data
function loadStudentDashboard(userData) {
    // This would normally fetch data from Firebase
    // For now, we'll use mock data
    
    // Update enrolled courses count
    const enrolledCoursesElement = document.querySelector('.enrolled-courses-count');
    if (enrolledCoursesElement) {
        enrolledCoursesElement.textContent = '5';
    }
    
    // Update completed topics count
    const completedTopicsElement = document.querySelector('.completed-topics-count');
    if (completedTopicsElement) {
        completedTopicsElement.textContent = '32';
    }
    
    // Update upcoming deadlines count
    const upcomingDeadlinesElement = document.querySelector('.upcoming-deadlines-count');
    if (upcomingDeadlinesElement) {
        upcomingDeadlinesElement.textContent = '3';
    }
    
    // Update overall progress
    const overallProgressElement = document.querySelector('.overall-progress-count');
    if (overallProgressElement) {
        overallProgressElement.textContent = '68%';
    }
    
    // Update overall progress bar
    const overallProgressBar = document.querySelector('.overall-progress .progress-bar');
    if (overallProgressBar) {
        overallProgressBar.style.width = '68%';
    }
    
    // Load course list
    loadStudentCourses();
    
    // Load recent updates
    loadRecentUpdates();
    
    // Load upcoming schedule
    loadUpcomingSchedule();
}

// Load faculty dashboard data
function loadFacultyDashboard(userData) {
    // This would normally fetch data from Firebase
    // For now, we'll use mock data
    
    // Update active courses count
    const activeCoursesElement = document.querySelector('.active-courses-count');
    if (activeCoursesElement) {
        activeCoursesElement.textContent = '4';
    }
    
    // Update total students count
    const totalStudentsElement = document.querySelector('.total-students-count');
    if (totalStudentsElement) {
        totalStudentsElement.textContent = '120';
    }
    
    // Update syllabus updates count
    const syllabusUpdatesElement = document.querySelector('.syllabus-updates-count');
    if (syllabusUpdatesElement) {
        syllabusUpdatesElement.textContent = '8';
    }
    
    // Update average progress
    const averageProgressElement = document.querySelector('.average-progress-count');
    if (averageProgressElement) {
        averageProgressElement.textContent = '72%';
    }
    
    // Update average progress bar
    const averageProgressBar = document.querySelector('.average-progress .progress-bar');
    if (averageProgressBar) {
        averageProgressBar.style.width = '72%';
    }
    
    // Load course list
    loadFacultyCourses();
    
    // Load recent activity
    loadRecentActivity();
    
    // Load student progress overview
    loadStudentProgressOverview();
}

// Load student courses
function loadStudentCourses() {
    const courseListElement = document.querySelector('.course-list');
    if (!courseListElement) return;
    
    // Mock course data
    const courses = [
        {
            id: 'cs101',
            code: 'CS101',
            title: 'Introduction to Computer Science',
            instructor: 'Dr. John Smith',
            progress: 85,
            nextTopic: 'Arrays and Linked Lists',
            nextDate: '2023-10-15'
        },
        {
            id: 'math201',
            code: 'MATH201',
            title: 'Calculus II',
            instructor: 'Dr. Sarah Johnson',
            progress: 72,
            nextTopic: 'Integration by Parts',
            nextDate: '2023-10-12'
        },
        {
            id: 'eng102',
            code: 'ENG102',
            title: 'Academic Writing',
            instructor: 'Prof. Michael Brown',
            progress: 60,
            nextTopic: 'Research Methodology',
            nextDate: '2023-10-18'
        },
        {
            id: 'phy201',
            code: 'PHY201',
            title: 'Physics for Engineers',
            instructor: 'Dr. Emily Chen',
            progress: 45,
            nextTopic: 'Electromagnetism',
            nextDate: '2023-10-14'
        },
        {
            id: 'cs202',
            code: 'CS202',
            title: 'Data Structures and Algorithms',
            instructor: 'Prof. Robert Wilson',
            progress: 65,
            nextTopic: 'Graph Algorithms',
            nextDate: '2023-10-16'
        }
    ];
    
    // Clear existing content
    courseListElement.innerHTML = '';
    
    // Add courses to the list
    courses.forEach(course => {
        const courseCard = document.createElement('div');
        courseCard.className = 'course-card';
        courseCard.setAttribute('data-course-id', course.id);
        
        courseCard.innerHTML = `
            <div class="course-header">
                <h3 class="course-title">${course.code}: ${course.title}</h3>
                <span class="course-instructor">${course.instructor}</span>
            </div>
            <div class="course-progress">
                <div class="progress">
                    <div class="progress-bar" style="width: ${course.progress}%" data-progress="${course.progress}"></div>
                </div>
                <span class="progress-text">${course.progress}% Complete</span>
            </div>
            <div class="course-next">
                <p><strong>Next Topic:</strong> ${course.nextTopic}</p>
                <p><strong>Date:</strong> ${formatDate(course.nextDate)}</p>
            </div>
            <button class="btn btn-primary btn-sm view-syllabus-btn">View Syllabus</button>
        `;
        
        courseListElement.appendChild(courseCard);
        
        // Add click event to view syllabus button
        const viewSyllabusBtn = courseCard.querySelector('.view-syllabus-btn');
        viewSyllabusBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent card click event
            window.location.href = `syllabus.html?id=${course.id}`;
        });
    });
}

// Load faculty courses
function loadFacultyCourses() {
    const courseListElement = document.querySelector('.course-list');
    if (!courseListElement) return;
    
    // Mock course data
    const courses = [
        {
            id: 'cs101',
            code: 'CS101',
            title: 'Introduction to Computer Science',
            students: 35,
            avgProgress: 85,
            lastUpdated: '2023-10-08'
        },
        {
            id: 'cs202',
            code: 'CS202',
            title: 'Data Structures and Algorithms',
            students: 28,
            avgProgress: 65,
            lastUpdated: '2023-10-05'
        },
        {
            id: 'cs301',
            code: 'CS301',
            title: 'Database Systems',
            students: 32,
            avgProgress: 72,
            lastUpdated: '2023-10-07'
        },
        {
            id: 'cs401',
            code: 'CS401',
            title: 'Software Engineering',
            students: 25,
            avgProgress: 68,
            lastUpdated: '2023-10-09'
        }
    ];
    
    // Clear existing content
    courseListElement.innerHTML = '';
    
    // Add courses to the list
    courses.forEach(course => {
        const courseCard = document.createElement('div');
        courseCard.className = 'course-card';
        courseCard.setAttribute('data-course-id', course.id);
        
        courseCard.innerHTML = `
            <div class="course-header">
                <h3 class="course-title">${course.code}: ${course.title}</h3>
                <span class="course-students">${course.students} Students</span>
            </div>
            <div class="course-progress">
                <div class="progress">
                    <div class="progress-bar" style="width: ${course.avgProgress}%" data-progress="${course.avgProgress}"></div>
                </div>
                <span class="progress-text">Avg. Progress: ${course.avgProgress}%</span>
            </div>
            <div class="course-last-updated">
                <p><strong>Last Updated:</strong> ${formatDate(course.lastUpdated)}</p>
            </div>
            <div class="course-actions">
                <button class="btn btn-primary btn-sm edit-syllabus-btn">Edit Syllabus</button>
                <button class="btn btn-secondary btn-sm view-progress-btn">View Progress</button>
            </div>
        `;
        
        courseListElement.appendChild(courseCard);
        
        // Add click event to edit syllabus button
        const editSyllabusBtn = courseCard.querySelector('.edit-syllabus-btn');
        editSyllabusBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent card click event
            window.location.href = `syllabus.html?id=${course.id}&edit=true`;
        });
        
        // Add click event to view progress button
        const viewProgressBtn = courseCard.querySelector('.view-progress-btn');
        viewProgressBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent card click event
            window.location.href = `course-progress.html?id=${course.id}`;
        });
    });
}

// Load recent updates for student dashboard
function loadRecentUpdates() {
    const updatesElement = document.querySelector('.recent-updates-list');
    if (!updatesElement) return;
    
    // Mock updates data
    const updates = [
        {
            id: 1,
            course: 'CS101',
            title: 'New lecture notes added',
            message: 'Lecture notes for "Introduction to Algorithms" have been added.',
            date: '2023-10-09T14:30:00'
        },
        {
            id: 2,
            course: 'MATH201',
            title: 'Assignment deadline extended',
            message: 'The deadline for Assignment 3 has been extended to October 20.',
            date: '2023-10-08T10:15:00'
        },
        {
            id: 3,
            course: 'CS202',
            title: 'New quiz available',
            message: 'A new practice quiz on Binary Trees is now available.',
            date: '2023-10-07T16:45:00'
        },
        {
            id: 4,
            course: 'PHY201',
            title: 'Lab session rescheduled',
            message: 'The lab session for this week has been rescheduled to Friday.',
            date: '2023-10-06T09:20:00'
        },
        {
            id: 5,
            course: 'ENG102',
            title: 'New resource materials',
            message: 'Additional resource materials for the research paper have been shared.',
            date: '2023-10-05T13:10:00'
        }
    ];
    
    // Clear existing content
    updatesElement.innerHTML = '';
    
    // Add updates to the list
    updates.forEach(update => {
        const updateItem = document.createElement('div');
        updateItem.className = 'update-item';
        
        updateItem.innerHTML = `
            <div class="update-header">
                <span class="update-course">${update.course}</span>
                <span class="update-date">${formatDateTime(update.date)}</span>
            </div>
            <h4 class="update-title">${update.title}</h4>
            <p class="update-message">${update.message}</p>
        `;
        
        updatesElement.appendChild(updateItem);
    });
}

// Load recent activity for faculty dashboard
function loadRecentActivity() {
    const activityElement = document.querySelector('.recent-activity-list');
    if (!activityElement) return;
    
    // Mock activity data
    const activities = [
        {
            id: 1,
            type: 'syllabus',
            course: 'CS101',
            action: 'Updated syllabus',
            details: 'Added new topics to Week 5',
            date: '2023-10-09T15:45:00'
        },
        {
            id: 2,
            type: 'student',
            course: 'CS202',
            action: 'Student progress',
            details: '5 students completed Week 3 topics',
            date: '2023-10-09T11:30:00'
        },
        {
            id: 3,
            type: 'material',
            course: 'CS301',
            action: 'Added materials',
            details: 'Uploaded lecture slides for Database Normalization',
            date: '2023-10-08T14:20:00'
        },
        {
            id: 4,
            type: 'deadline',
            course: 'CS401',
            action: 'Updated deadline',
            details: 'Extended project proposal deadline to October 25',
            date: '2023-10-07T09:15:00'
        },
        {
            id: 5,
            type: 'feedback',
            course: 'CS101',
            action: 'Received feedback',
            details: '3 students requested clarification on Week 4 topics',
            date: '2023-10-06T16:40:00'
        }
    ];
    
    // Clear existing content
    activityElement.innerHTML = '';
    
    // Add activities to the list
    activities.forEach(activity => {
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        
        // Set icon based on activity type
        let icon = '';
        switch (activity.type) {
            case 'syllabus':
                icon = '<i class="fas fa-book"></i>';
                break;
            case 'student':
                icon = '<i class="fas fa-user-graduate"></i>';
                break;
            case 'material':
                icon = '<i class="fas fa-file-alt"></i>';
                break;
            case 'deadline':
                icon = '<i class="fas fa-calendar-alt"></i>';
                break;
            case 'feedback':
                icon = '<i class="fas fa-comment"></i>';
                break;
            default:
                icon = '<i class="fas fa-info-circle"></i>';
        }
        
        activityItem.innerHTML = `
            <div class="activity-icon">${icon}</div>
            <div class="activity-content">
                <div class="activity-header">
                    <span class="activity-course">${activity.course}</span>
                    <span class="activity-date">${formatDateTime(activity.date)}</span>
                </div>
                <h4 class="activity-action">${activity.action}</h4>
                <p class="activity-details">${activity.details}</p>
            </div>
        `;
        
        activityElement.appendChild(activityItem);
    });
}

// Load upcoming schedule for student dashboard
function loadUpcomingSchedule() {
    const scheduleElement = document.querySelector('.upcoming-schedule-list');
    if (!scheduleElement) return;
    
    // Mock schedule data
    const scheduleItems = [
        {
            id: 1,
            course: 'CS101',
            title: 'Lecture: Sorting Algorithms',
            date: '2023-10-12T10:00:00',
            location: 'Room 301'
        },
        {
            id: 2,
            course: 'MATH201',
            title: 'Assignment 3 Due',
            date: '2023-10-15T23:59:00',
            location: 'Online Submission'
        },
        {
            id: 3,
            course: 'PHY201',
            title: 'Lab Session: Circuits',
            date: '2023-10-13T14:30:00',
            location: 'Physics Lab 2'
        },
        {
            id: 4,
            course: 'CS202',
            title: 'Quiz: Binary Trees',
            date: '2023-10-16T11:00:00',
            location: 'Room 205'
        },
        {
            id: 5,
            course: 'ENG102',
            title: 'Research Paper Draft Due',
            date: '2023-10-18T23:59:00',
            location: 'Online Submission'
        }
    ];
    
    // Clear existing content
    scheduleElement.innerHTML = '';
    
    // Add schedule items to the list
    scheduleItems.forEach(item => {
        const scheduleItem = document.createElement('div');
        scheduleItem.className = 'schedule-item';
        
        // Determine if the item is today, upcoming, or past
        const itemDate = new Date(item.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        let dateClass = '';
        if (itemDate.toDateString() === today.toDateString()) {
            dateClass = 'date-today';
        } else if (itemDate < today) {
            dateClass = 'date-past';
        } else if (itemDate.toDateString() === tomorrow.toDateString()) {
            dateClass = 'date-tomorrow';
        }
        
        scheduleItem.innerHTML = `
            <div class="schedule-date ${dateClass}">
                <span class="date-day">${itemDate.getDate()}</span>
                <span class="date-month">${itemDate.toLocaleString('default', { month: 'short' })}</span>
            </div>
            <div class="schedule-content">
                <span class="schedule-course">${item.course}</span>
                <h4 class="schedule-title">${item.title}</h4>
                <p class="schedule-details">
                    <span class="schedule-time">${formatTime(item.date)}</span>
                    <span class="schedule-location">${item.location}</span>
                </p>
            </div>
        `;
        
        scheduleElement.appendChild(scheduleItem);
    });
}

// Load student progress overview for faculty dashboard
function loadStudentProgressOverview() {
    const progressElement = document.querySelector('.student-progress-overview');
    if (!progressElement) return;
    
    // Mock progress data
    const progressData = [
        { range: '0-20%', count: 5 },
        { range: '21-40%', count: 12 },
        { range: '41-60%', count: 28 },
        { range: '61-80%', count: 45 },
        { range: '81-100%', count: 30 }
    ];
    
    // Calculate total students
    const totalStudents = progressData.reduce((total, item) => total + item.count, 0);
    
    // Create progress chart (simple bar chart)
    const chartElement = document.createElement('div');
    chartElement.className = 'progress-chart';
    
    progressData.forEach(item => {
        const percentage = (item.count / totalStudents) * 100;
        
        const barContainer = document.createElement('div');
        barContainer.className = 'chart-bar-container';
        
        barContainer.innerHTML = `
            <div class="chart-label">${item.range}</div>
            <div class="chart-bar-wrapper">
                <div class="chart-bar" style="height: ${percentage}%"></div>
            </div>
            <div class="chart-value">${item.count} students</div>
        `;
        
        chartElement.appendChild(barContainer);
    });
    
    // Clear existing content
    progressElement.innerHTML = '';
    
    // Add chart to the element
    progressElement.appendChild(chartElement);
}

// Update syllabus item status
function updateSyllabusItemStatus(itemId, isCompleted) {
    // This would normally update the status in Firebase
    console.log(`Updating syllabus item ${itemId} to ${isCompleted ? 'completed' : 'incomplete'}`);
    
    // Update UI to reflect the change
    const item = document.querySelector(`.syllabus-item[data-item-id="${itemId}"]`);
    if (item) {
        if (isCompleted) {
            item.classList.add('completed');
        } else {
            item.classList.remove('completed');
        }
    }
}

// Update parent item status based on children
function updateParentItemStatus(parentId) {
    const parentItem = document.querySelector(`.syllabus-item[data-item-id="${parentId}"]`);
    if (!parentItem) return;
    
    const childItems = parentItem.querySelectorAll('.syllabus-subitem');
    if (childItems.length === 0) return;
    
    const childCheckboxes = parentItem.querySelectorAll('.syllabus-subitem input[type="checkbox"]');
    const allChecked = Array.from(childCheckboxes).every(checkbox => checkbox.checked);
    
    const parentCheckbox = parentItem.querySelector('input[type="checkbox"]');
    if (parentCheckbox) {
        parentCheckbox.checked = allChecked;
        parentCheckbox.indeterminate = !allChecked && Array.from(childCheckboxes).some(checkbox => checkbox.checked);
        
        // Update parent item status
        updateSyllabusItemStatus(parentId, allChecked);
    }
}

// Update progress bars based on completed items
function updateProgressBars() {
    // Calculate overall progress
    const allItems = document.querySelectorAll('.syllabus-item:not(.syllabus-subitem)');
    const completedItems = document.querySelectorAll('.syllabus-item.completed:not(.syllabus-subitem)');
    
    if (allItems.length === 0) return;
    
    const progress = Math.round((completedItems.length / allItems.length) * 100);
    
    // Update overall progress bar
    const overallProgressBar = document.querySelector('.overall-progress .progress-bar');
    const overallProgressText = document.querySelector('.overall-progress-count');
    
    if (overallProgressBar) {
        overallProgressBar.style.width = `${progress}%`;
    }
    
    if (overallProgressText) {
        overallProgressText.textContent = `${progress}%`;
    }
    
    // Update course progress bars
    const courseProgressBars = document.querySelectorAll('.course-progress .progress-bar');
    courseProgressBars.forEach(bar => {
        const courseId = bar.closest('[data-course-id]').getAttribute('data-course-id');
        const courseItems = document.querySelectorAll(`.syllabus-item[data-course-id="${courseId}"]:not(.syllabus-subitem)`);
        const courseCompletedItems = document.querySelectorAll(`.syllabus-item[data-course-id="${courseId}"].completed:not(.syllabus-subitem)`);
        
        if (courseItems.length === 0) return;
        
        const courseProgress = Math.round((courseCompletedItems.length / courseItems.length) * 100);
        bar.style.width = `${courseProgress}%`;
        
        const progressText = bar.closest('.course-progress').querySelector('.progress-text');
        if (progressText) {
            progressText.textContent = `${courseProgress}% Complete`;
        }
    });
}

// Apply syllabus filter
function applySyllabusFilter(filter) {
    if (!syllabusItems) return;
    
    syllabusItems.forEach(item => {
        const isCompleted = item.classList.contains('completed');
        
        switch (filter) {
            case 'all':
                item.style.display = '';
                break;
            case 'completed':
                item.style.display = isCompleted ? '' : 'none';
                break;
            case 'incomplete':
                item.style.display = !isCompleted ? '' : 'none';
                break;
        }
    });
}

// Apply search filter
function applySearchFilter(searchTerm) {
    if (!syllabusItems || !searchTerm) {
        // If no search term, show all items
        syllabusItems.forEach(item => {
            item.style.display = '';
        });
        return;
    }
    
    syllabusItems.forEach(item => {
        const title = item.querySelector('.syllabus-title').textContent.toLowerCase();
        const description = item.querySelector('.syllabus-description')?.textContent.toLowerCase() || '';
        
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}

// Mark notifications as read
function markNotificationsAsRead() {
    // This would normally update the read status in Firebase
    console.log('Marking notifications as read');
    
    // Update UI to reflect the change
    const unreadBadge = document.querySelector('.notification-badge');
    if (unreadBadge) {
        unreadBadge.style.display = 'none';
    }
    
    const unreadNotifications = document.querySelectorAll('.notification-item.unread');
    unreadNotifications.forEach(notification => {
        notification.classList.remove('unread');
    });
}

// Format date string to readable format
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

// Format date and time string to readable format
function formatDateTime(dateTimeString) {
    const date = new Date(dateTimeString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) + ' at ' + 
           date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

// Format time string to readable format
function formatTime(dateTimeString) {
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}
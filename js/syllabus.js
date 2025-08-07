// Syllabus functionality for Smart Syllabus Tracker

// DOM Elements
const syllabusContainer = document.querySelector('.syllabus-container');
const syllabusTitle = document.querySelector('.syllabus-title');
const syllabusCode = document.querySelector('.syllabus-code');
const syllabusInstructor = document.querySelector('.syllabus-instructor');
const syllabusDescription = document.querySelector('.syllabus-description');
const syllabusObjectives = document.querySelector('.syllabus-objectives');
const syllabusTopics = document.querySelector('.syllabus-topics');
const syllabusAssessment = document.querySelector('.syllabus-assessment');
const syllabusMaterials = document.querySelector('.syllabus-materials');
const editSyllabusBtn = document.querySelector('.edit-syllabus-btn');
const saveSyllabusBtn = document.querySelector('.save-syllabus-btn');
const cancelEditBtn = document.querySelector('.cancel-edit-btn');
const syllabusEditModal = document.querySelector('#syllabusEditModal');
const syllabusForm = document.querySelector('#syllabusForm');
const topicCheckboxes = document.querySelectorAll('.topic-checkbox');
const addTopicBtn = document.querySelector('.add-topic-btn');
const topicsList = document.querySelector('.topics-list');
const progressBar = document.querySelector('.progress-bar');
const progressText = document.querySelector('.progress-text');

// Initialize syllabus page when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Get syllabus ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const syllabusId = urlParams.get('id');
    const editMode = urlParams.get('edit') === 'true';
    
    if (syllabusId) {
        // Load syllabus data
        loadSyllabusData(syllabusId, editMode);
    } else {
        // No syllabus ID provided
        showError('No syllabus ID provided');
    }
    
    // Initialize event listeners
    initEventListeners();
});

// Initialize event listeners
function initEventListeners() {
    // Edit syllabus button
    if (editSyllabusBtn) {
        editSyllabusBtn.addEventListener('click', function() {
            openSyllabusEditModal();
        });
    }
    
    // Save syllabus button
    if (saveSyllabusBtn) {
        saveSyllabusBtn.addEventListener('click', function() {
            saveSyllabusChanges();
        });
    }
    
    // Cancel edit button
    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', function() {
            closeSyllabusEditModal();
        });
    }
    
    // Topic checkboxes
    if (topicCheckboxes) {
        topicCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                updateTopicStatus(this.dataset.topicId, this.checked);
                updateProgress();
            });
        });
    }
    
    // Add topic button
    if (addTopicBtn) {
        addTopicBtn.addEventListener('click', function() {
            addNewTopic();
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === syllabusEditModal) {
            closeSyllabusEditModal();
        }
    });
}

// Load syllabus data from Firebase
function loadSyllabusData(syllabusId, editMode) {
    // This would normally fetch data from Firebase
    // For now, we'll use mock data
    
    // Mock syllabus data
    const syllabusData = {
        id: syllabusId,
        code: 'CS101',
        title: 'Introduction to Computer Science',
        instructor: 'Dr. John Smith',
        description: 'This course provides an introduction to the field of computer science, covering fundamental concepts and principles of computing, programming, and problem-solving.',
        objectives: [
            'Understand basic computing concepts and terminology',
            'Learn fundamental programming principles using Python',
            'Develop problem-solving skills through algorithmic thinking',
            'Gain experience with basic data structures and algorithms',
            'Understand the software development process'
        ],
        topics: [
            {
                id: 'topic1',
                title: 'Introduction to Computing',
                description: 'Overview of computer science, history of computing, and basic computer architecture.',
                completed: true,
                subtopics: [
                    { id: 'subtopic1_1', title: 'History of Computing', completed: true },
                    { id: 'subtopic1_2', title: 'Computer Architecture Basics', completed: true },
                    { id: 'subtopic1_3', title: 'Binary Number System', completed: true }
                ]
            },
            {
                id: 'topic2',
                title: 'Programming Fundamentals',
                description: 'Introduction to programming concepts, variables, data types, and basic operations.',
                completed: true,
                subtopics: [
                    { id: 'subtopic2_1', title: 'Variables and Data Types', completed: true },
                    { id: 'subtopic2_2', title: 'Operators and Expressions', completed: true },
                    { id: 'subtopic2_3', title: 'Input and Output', completed: true }
                ]
            },
            {
                id: 'topic3',
                title: 'Control Structures',
                description: 'Conditional statements, loops, and program flow control.',
                completed: true,
                subtopics: [
                    { id: 'subtopic3_1', title: 'Conditional Statements', completed: true },
                    { id: 'subtopic3_2', title: 'Loops', completed: true },
                    { id: 'subtopic3_3', title: 'Break and Continue', completed: true }
                ]
            },
            {
                id: 'topic4',
                title: 'Functions and Modular Programming',
                description: 'Creating and using functions, parameters, return values, and scope.',
                completed: false,
                subtopics: [
                    { id: 'subtopic4_1', title: 'Function Definition and Calling', completed: true },
                    { id: 'subtopic4_2', title: 'Parameters and Return Values', completed: true },
                    { id: 'subtopic4_3', title: 'Variable Scope', completed: false }
                ]
            },
            {
                id: 'topic5',
                title: 'Data Structures',
                description: 'Lists, tuples, dictionaries, and sets in Python.',
                completed: false,
                subtopics: [
                    { id: 'subtopic5_1', title: 'Lists and Tuples', completed: true },
                    { id: 'subtopic5_2', title: 'Dictionaries', completed: false },
                    { id: 'subtopic5_3', title: 'Sets', completed: false }
                ]
            },
            {
                id: 'topic6',
                title: 'File Handling',
                description: 'Reading from and writing to files, file modes, and error handling.',
                completed: false,
                subtopics: [
                    { id: 'subtopic6_1', title: 'Opening and Closing Files', completed: false },
                    { id: 'subtopic6_2', title: 'Reading and Writing Text Files', completed: false },
                    { id: 'subtopic6_3', title: 'Error Handling', completed: false }
                ]
            },
            {
                id: 'topic7',
                title: 'Introduction to Algorithms',
                description: 'Basic algorithm concepts, searching, and sorting algorithms.',
                completed: false,
                subtopics: [
                    { id: 'subtopic7_1', title: 'Algorithm Analysis', completed: false },
                    { id: 'subtopic7_2', title: 'Searching Algorithms', completed: false },
                    { id: 'subtopic7_3', title: 'Sorting Algorithms', completed: false }
                ]
            },
            {
                id: 'topic8',
                title: 'Object-Oriented Programming',
                description: 'Classes, objects, inheritance, and polymorphism.',
                completed: false,
                subtopics: [
                    { id: 'subtopic8_1', title: 'Classes and Objects', completed: false },
                    { id: 'subtopic8_2', title: 'Inheritance', completed: false },
                    { id: 'subtopic8_3', title: 'Polymorphism', completed: false }
                ]
            }
        ],
        assessment: [
            { type: 'Assignments', weight: 30, description: '4 programming assignments throughout the semester' },
            { type: 'Quizzes', weight: 15, description: 'Weekly quizzes on lecture material' },
            { type: 'Midterm Exam', weight: 25, description: 'Covers topics 1-4' },
            { type: 'Final Project', weight: 15, description: 'Implementation of a small application' },
            { type: 'Final Exam', weight: 15, description: 'Comprehensive exam covering all topics' }
        ],
        materials: [
            { type: 'Textbook', title: 'Introduction to Computer Science using Python', author: 'John Smith', required: true },
            { type: 'Software', title: 'Python 3.9 or later', required: true },
            { type: 'Software', title: 'Visual Studio Code or PyCharm', required: false },
            { type: 'Online Resource', title: 'Course Website', url: 'https://cs101.example.edu', required: true }
        ]
    };
    
    // Populate syllabus data in the UI
    populateSyllabusData(syllabusData);
    
    // Set edit mode if specified
    if (editMode) {
        // Show edit button for faculty
        if (editSyllabusBtn) {
            editSyllabusBtn.style.display = 'block';
        }
    } else {
        // Show progress tracking for students
        initProgressTracking(syllabusData);
    }
}

// Populate syllabus data in the UI
function populateSyllabusData(data) {
    // Set syllabus header information
    if (syllabusTitle) syllabusTitle.textContent = data.title;
    if (syllabusCode) syllabusCode.textContent = data.code;
    if (syllabusInstructor) syllabusInstructor.textContent = data.instructor;
    
    // Set syllabus description
    if (syllabusDescription) syllabusDescription.textContent = data.description;
    
    // Set syllabus objectives
    if (syllabusObjectives) {
        syllabusObjectives.innerHTML = '';
        const objectivesList = document.createElement('ul');
        
        data.objectives.forEach(objective => {
            const objectiveItem = document.createElement('li');
            objectiveItem.textContent = objective;
            objectivesList.appendChild(objectiveItem);
        });
        
        syllabusObjectives.appendChild(objectivesList);
    }
    
    // Set syllabus topics
    if (syllabusTopics) {
        syllabusTopics.innerHTML = '';
        
        data.topics.forEach(topic => {
            const topicElement = createTopicElement(topic);
            syllabusTopics.appendChild(topicElement);
        });
    }
    
    // Set syllabus assessment methods
    if (syllabusAssessment) {
        syllabusAssessment.innerHTML = '';
        const assessmentTable = document.createElement('table');
        assessmentTable.className = 'assessment-table';
        
        // Create table header
        const tableHeader = document.createElement('thead');
        tableHeader.innerHTML = `
            <tr>
                <th>Type</th>
                <th>Weight</th>
                <th>Description</th>
            </tr>
        `;
        assessmentTable.appendChild(tableHeader);
        
        // Create table body
        const tableBody = document.createElement('tbody');
        
        data.assessment.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.type}</td>
                <td>${item.weight}%</td>
                <td>${item.description}</td>
            `;
            tableBody.appendChild(row);
        });
        
        assessmentTable.appendChild(tableBody);
        syllabusAssessment.appendChild(assessmentTable);
    }
    
    // Set syllabus materials
    if (syllabusMaterials) {
        syllabusMaterials.innerHTML = '';
        const materialsList = document.createElement('ul');
        materialsList.className = 'materials-list';
        
        data.materials.forEach(material => {
            const materialItem = document.createElement('li');
            materialItem.className = 'material-item';
            
            let materialContent = `<strong>${material.type}:</strong> ${material.title}`;
            
            if (material.author) {
                materialContent += ` by ${material.author}`;
            }
            
            if (material.url) {
                materialContent += ` - <a href="${material.url}" target="_blank">${material.url}</a>`;
            }
            
            if (material.required !== undefined) {
                materialContent += ` <span class="${material.required ? 'required' : 'optional'}">(${material.required ? 'Required' : 'Optional'})</span>`;
            }
            
            materialItem.innerHTML = materialContent;
            materialsList.appendChild(materialItem);
        });
        
        syllabusMaterials.appendChild(materialsList);
    }
}

// Create a topic element
function createTopicElement(topic) {
    const topicElement = document.createElement('div');
    topicElement.className = `topic-item ${topic.completed ? 'completed' : ''}`;
    topicElement.dataset.topicId = topic.id;
    
    // Create topic header
    const topicHeader = document.createElement('div');
    topicHeader.className = 'topic-header';
    
    // Create checkbox for students to mark completion
    const checkboxContainer = document.createElement('div');
    checkboxContainer.className = 'checkbox-container';
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'topic-checkbox';
    checkbox.checked = topic.completed;
    checkbox.dataset.topicId = topic.id;
    
    // Add event listener to checkbox
    checkbox.addEventListener('change', function() {
        updateTopicStatus(topic.id, this.checked);
        updateProgress();
    });
    
    checkboxContainer.appendChild(checkbox);
    
    // Create topic title
    const topicTitle = document.createElement('h4');
    topicTitle.className = 'topic-title';
    topicTitle.textContent = topic.title;
    
    // Add elements to topic header
    topicHeader.appendChild(checkboxContainer);
    topicHeader.appendChild(topicTitle);
    
    // Create topic description
    const topicDescription = document.createElement('p');
    topicDescription.className = 'topic-description';
    topicDescription.textContent = topic.description;
    
    // Add header and description to topic element
    topicElement.appendChild(topicHeader);
    topicElement.appendChild(topicDescription);
    
    // Create subtopics if they exist
    if (topic.subtopics && topic.subtopics.length > 0) {
        const subtopicsList = document.createElement('div');
        subtopicsList.className = 'subtopics-list';
        
        topic.subtopics.forEach(subtopic => {
            const subtopicItem = document.createElement('div');
            subtopicItem.className = `subtopic-item ${subtopic.completed ? 'completed' : ''}`;
            subtopicItem.dataset.subtopicId = subtopic.id;
            
            // Create subtopic header
            const subtopicHeader = document.createElement('div');
            subtopicHeader.className = 'subtopic-header';
            
            // Create checkbox for subtopic
            const subtopicCheckboxContainer = document.createElement('div');
            subtopicCheckboxContainer.className = 'checkbox-container';
            
            const subtopicCheckbox = document.createElement('input');
            subtopicCheckbox.type = 'checkbox';
            subtopicCheckbox.className = 'subtopic-checkbox';
            subtopicCheckbox.checked = subtopic.completed;
            subtopicCheckbox.dataset.subtopicId = subtopic.id;
            subtopicCheckbox.dataset.parentId = topic.id;
            
            // Add event listener to subtopic checkbox
            subtopicCheckbox.addEventListener('change', function() {
                updateSubtopicStatus(subtopic.id, topic.id, this.checked);
                updateProgress();
            });
            
            subtopicCheckboxContainer.appendChild(subtopicCheckbox);
            
            // Create subtopic title
            const subtopicTitle = document.createElement('h5');
            subtopicTitle.className = 'subtopic-title';
            subtopicTitle.textContent = subtopic.title;
            
            // Add elements to subtopic header
            subtopicHeader.appendChild(subtopicCheckboxContainer);
            subtopicHeader.appendChild(subtopicTitle);
            
            // Add header to subtopic item
            subtopicItem.appendChild(subtopicHeader);
            
            // Add subtopic item to subtopics list
            subtopicsList.appendChild(subtopicItem);
        });
        
        // Add subtopics list to topic element
        topicElement.appendChild(subtopicsList);
    }
    
    return topicElement;
}

// Initialize progress tracking for students
function initProgressTracking(syllabusData) {
    // Calculate initial progress
    updateProgress();
    
    // Show progress tracking elements
    const progressElements = document.querySelectorAll('.progress-tracking');
    progressElements.forEach(el => {
        el.style.display = 'block';
    });
    
    // Hide edit button for students
    if (editSyllabusBtn) {
        editSyllabusBtn.style.display = 'none';
    }
}

// Update topic status
function updateTopicStatus(topicId, isCompleted) {
    // This would normally update the status in Firebase
    console.log(`Updating topic ${topicId} to ${isCompleted ? 'completed' : 'incomplete'}`);
    
    // Update UI to reflect the change
    const topicElement = document.querySelector(`.topic-item[data-topic-id="${topicId}"]`);
    if (topicElement) {
        if (isCompleted) {
            topicElement.classList.add('completed');
        } else {
            topicElement.classList.remove('completed');
        }
        
        // Update all subtopic checkboxes
        const subtopicCheckboxes = topicElement.querySelectorAll('.subtopic-checkbox');
        subtopicCheckboxes.forEach(checkbox => {
            checkbox.checked = isCompleted;
            
            // Update subtopic item status
            const subtopicItem = checkbox.closest('.subtopic-item');
            if (subtopicItem) {
                if (isCompleted) {
                    subtopicItem.classList.add('completed');
                } else {
                    subtopicItem.classList.remove('completed');
                }
            }
        });
    }
}

// Update subtopic status
function updateSubtopicStatus(subtopicId, parentId, isCompleted) {
    // This would normally update the status in Firebase
    console.log(`Updating subtopic ${subtopicId} to ${isCompleted ? 'completed' : 'incomplete'}`);
    
    // Update UI to reflect the change
    const subtopicElement = document.querySelector(`.subtopic-item[data-subtopic-id="${subtopicId}"]`);
    if (subtopicElement) {
        if (isCompleted) {
            subtopicElement.classList.add('completed');
        } else {
            subtopicElement.classList.remove('completed');
        }
    }
    
    // Check if all subtopics are completed
    const parentElement = document.querySelector(`.topic-item[data-topic-id="${parentId}"]`);
    if (parentElement) {
        const allSubtopicCheckboxes = parentElement.querySelectorAll('.subtopic-checkbox');
        const allCompleted = Array.from(allSubtopicCheckboxes).every(checkbox => checkbox.checked);
        
        // Update parent topic checkbox
        const parentCheckbox = parentElement.querySelector('.topic-checkbox');
        if (parentCheckbox) {
            parentCheckbox.checked = allCompleted;
            
            // Update parent topic status
            if (allCompleted) {
                parentElement.classList.add('completed');
            } else {
                parentElement.classList.remove('completed');
            }
        }
    }
}

// Update progress bar and text
function updateProgress() {
    // Calculate progress
    const totalTopics = document.querySelectorAll('.topic-item').length;
    const completedTopics = document.querySelectorAll('.topic-item.completed').length;
    
    if (totalTopics === 0) return;
    
    const progress = Math.round((completedTopics / totalTopics) * 100);
    
    // Update progress bar
    if (progressBar) {
        progressBar.style.width = `${progress}%`;
    }
    
    // Update progress text
    if (progressText) {
        progressText.textContent = `${progress}% Complete (${completedTopics}/${totalTopics} topics)`;
    }
}

// Open syllabus edit modal
function openSyllabusEditModal() {
    if (!syllabusEditModal) return;
    
    // Populate form with current syllabus data
    populateSyllabusForm();
    
    // Show modal
    syllabusEditModal.style.display = 'block';
}

// Close syllabus edit modal
function closeSyllabusEditModal() {
    if (!syllabusEditModal) return;
    
    // Hide modal
    syllabusEditModal.style.display = 'none';
}

// Populate syllabus form with current data
function populateSyllabusForm() {
    if (!syllabusForm) return;
    
    // Set form values from current syllabus data
    syllabusForm.querySelector('#syllabusTitle').value = syllabusTitle.textContent;
    syllabusForm.querySelector('#syllabusCode').value = syllabusCode.textContent;
    syllabusForm.querySelector('#syllabusInstructor').value = syllabusInstructor.textContent;
    syllabusForm.querySelector('#syllabusDescription').value = syllabusDescription.textContent;
    
    // Set objectives
    const objectivesList = syllabusObjectives.querySelector('ul');
    const objectivesInput = syllabusForm.querySelector('#syllabusObjectives');
    
    if (objectivesList && objectivesInput) {
        const objectives = Array.from(objectivesList.querySelectorAll('li')).map(li => li.textContent);
        objectivesInput.value = objectives.join('\n');
    }
    
    // Set topics
    const topicsContainer = syllabusForm.querySelector('#topicsContainer');
    if (topicsContainer) {
        topicsContainer.innerHTML = '';
        
        const topics = document.querySelectorAll('.topic-item');
        topics.forEach(topic => {
            const topicId = topic.dataset.topicId;
            const topicTitle = topic.querySelector('.topic-title').textContent;
            const topicDescription = topic.querySelector('.topic-description').textContent;
            
            const topicFormGroup = createTopicFormGroup(topicId, topicTitle, topicDescription);
            topicsContainer.appendChild(topicFormGroup);
            
            // Add subtopics
            const subtopics = topic.querySelectorAll('.subtopic-item');
            const subtopicsContainer = topicFormGroup.querySelector('.subtopics-container');
            
            subtopics.forEach(subtopic => {
                const subtopicId = subtopic.dataset.subtopicId;
                const subtopicTitle = subtopic.querySelector('.subtopic-title').textContent;
                
                const subtopicFormGroup = createSubtopicFormGroup(subtopicId, subtopicTitle);
                subtopicsContainer.appendChild(subtopicFormGroup);
            });
        });
    }
    
    // Set assessment methods
    const assessmentTable = syllabusAssessment.querySelector('table');
    const assessmentContainer = syllabusForm.querySelector('#assessmentContainer');
    
    if (assessmentTable && assessmentContainer) {
        assessmentContainer.innerHTML = '';
        
        const assessmentRows = assessmentTable.querySelectorAll('tbody tr');
        assessmentRows.forEach(row => {
            const cells = row.querySelectorAll('td');
            const type = cells[0].textContent;
            const weight = cells[1].textContent.replace('%', '');
            const description = cells[2].textContent;
            
            const assessmentFormGroup = createAssessmentFormGroup(type, weight, description);
            assessmentContainer.appendChild(assessmentFormGroup);
        });
    }
    
    // Set materials
    const materialsList = syllabusMaterials.querySelector('.materials-list');
    const materialsContainer = syllabusForm.querySelector('#materialsContainer');
    
    if (materialsList && materialsContainer) {
        materialsContainer.innerHTML = '';
        
        const materials = materialsList.querySelectorAll('.material-item');
        materials.forEach(material => {
            const content = material.innerHTML;
            const type = content.match(/<strong>(.+?):<\/strong>/)[1];
            const title = content.match(/<strong>.+?:<\/strong> (.+?)(?= by| -| <span|$)/)[1];
            
            let author = '';
            const authorMatch = content.match(/ by (.+?)(?= -| <span|$)/);
            if (authorMatch) {
                author = authorMatch[1];
            }
            
            let url = '';
            const urlMatch = content.match(/<a href="(.+?)"/);
            if (urlMatch) {
                url = urlMatch[1];
            }
            
            let required = true;
            if (content.includes('(Optional)')) {
                required = false;
            }
            
            const materialFormGroup = createMaterialFormGroup(type, title, author, url, required);
            materialsContainer.appendChild(materialFormGroup);
        });
    }
}

// Create a topic form group
function createTopicFormGroup(id, title, description) {
    const topicFormGroup = document.createElement('div');
    topicFormGroup.className = 'topic-form-group';
    topicFormGroup.dataset.topicId = id;
    
    topicFormGroup.innerHTML = `
        <div class="form-group">
            <label for="topicTitle_${id}">Topic Title</label>
            <input type="text" id="topicTitle_${id}" class="topic-title-input" value="${title}" required>
        </div>
        <div class="form-group">
            <label for="topicDescription_${id}">Topic Description</label>
            <textarea id="topicDescription_${id}" class="topic-description-input" rows="2" required>${description}</textarea>
        </div>
        <div class="subtopics-section">
            <h5>Subtopics</h5>
            <div class="subtopics-container"></div>
            <button type="button" class="btn btn-sm btn-secondary add-subtopic-btn" data-topic-id="${id}">Add Subtopic</button>
        </div>
        <button type="button" class="btn btn-sm btn-danger remove-topic-btn">Remove Topic</button>
        <hr>
    `;
    
    // Add event listener to add subtopic button
    const addSubtopicBtn = topicFormGroup.querySelector('.add-subtopic-btn');
    addSubtopicBtn.addEventListener('click', function() {
        const topicId = this.dataset.topicId;
        const subtopicsContainer = this.parentElement.querySelector('.subtopics-container');
        const subtopicId = 'new_subtopic_' + Date.now();
        const subtopicFormGroup = createSubtopicFormGroup(subtopicId, '');
        subtopicsContainer.appendChild(subtopicFormGroup);
    });
    
    // Add event listener to remove topic button
    const removeTopicBtn = topicFormGroup.querySelector('.remove-topic-btn');
    removeTopicBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to remove this topic?')) {
            topicFormGroup.remove();
        }
    });
    
    return topicFormGroup;
}

// Create a subtopic form group
function createSubtopicFormGroup(id, title) {
    const subtopicFormGroup = document.createElement('div');
    subtopicFormGroup.className = 'subtopic-form-group';
    subtopicFormGroup.dataset.subtopicId = id;
    
    subtopicFormGroup.innerHTML = `
        <div class="form-group">
            <label for="subtopicTitle_${id}">Subtopic Title</label>
            <div class="input-group">
                <input type="text" id="subtopicTitle_${id}" class="subtopic-title-input" value="${title}" required>
                <button type="button" class="btn btn-sm btn-danger remove-subtopic-btn">Remove</button>
            </div>
        </div>
    `;
    
    // Add event listener to remove subtopic button
    const removeSubtopicBtn = subtopicFormGroup.querySelector('.remove-subtopic-btn');
    removeSubtopicBtn.addEventListener('click', function() {
        subtopicFormGroup.remove();
    });
    
    return subtopicFormGroup;
}

// Create an assessment form group
function createAssessmentFormGroup(type, weight, description) {
    const assessmentFormGroup = document.createElement('div');
    assessmentFormGroup.className = 'assessment-form-group';
    
    assessmentFormGroup.innerHTML = `
        <div class="form-row">
            <div class="form-group col-md-3">
                <label>Type</label>
                <input type="text" class="assessment-type-input" value="${type}" required>
            </div>
            <div class="form-group col-md-2">
                <label>Weight (%)</label>
                <input type="number" class="assessment-weight-input" value="${weight}" min="0" max="100" required>
            </div>
            <div class="form-group col-md-6">
                <label>Description</label>
                <input type="text" class="assessment-description-input" value="${description}" required>
            </div>
            <div class="form-group col-md-1">
                <label>&nbsp;</label>
                <button type="button" class="btn btn-sm btn-danger remove-assessment-btn">Remove</button>
            </div>
        </div>
    `;
    
    // Add event listener to remove assessment button
    const removeAssessmentBtn = assessmentFormGroup.querySelector('.remove-assessment-btn');
    removeAssessmentBtn.addEventListener('click', function() {
        assessmentFormGroup.remove();
    });
    
    return assessmentFormGroup;
}

// Create a material form group
function createMaterialFormGroup(type, title, author, url, required) {
    const materialFormGroup = document.createElement('div');
    materialFormGroup.className = 'material-form-group';
    
    materialFormGroup.innerHTML = `
        <div class="form-row">
            <div class="form-group col-md-2">
                <label>Type</label>
                <input type="text" class="material-type-input" value="${type}" required>
            </div>
            <div class="form-group col-md-3">
                <label>Title</label>
                <input type="text" class="material-title-input" value="${title}" required>
            </div>
            <div class="form-group col-md-2">
                <label>Author</label>
                <input type="text" class="material-author-input" value="${author}">
            </div>
            <div class="form-group col-md-3">
                <label>URL</label>
                <input type="url" class="material-url-input" value="${url}">
            </div>
            <div class="form-group col-md-1">
                <label>Required</label>
                <div class="custom-control custom-switch">
                    <input type="checkbox" class="custom-control-input material-required-input" id="materialRequired_${Date.now()}" ${required ? 'checked' : ''}>
                    <label class="custom-control-label" for="materialRequired_${Date.now()}"></label>
                </div>
            </div>
            <div class="form-group col-md-1">
                <label>&nbsp;</label>
                <button type="button" class="btn btn-sm btn-danger remove-material-btn">Remove</button>
            </div>
        </div>
    `;
    
    // Add event listener to remove material button
    const removeMaterialBtn = materialFormGroup.querySelector('.remove-material-btn');
    removeMaterialBtn.addEventListener('click', function() {
        materialFormGroup.remove();
    });
    
    return materialFormGroup;
}

// Add a new topic
function addNewTopic() {
    const topicId = 'new_topic_' + Date.now();
    const topicElement = createTopicElement({
        id: topicId,
        title: 'New Topic',
        description: 'Topic description',
        completed: false,
        subtopics: []
    });
    
    syllabusTopics.appendChild(topicElement);
    
    // Update progress
    updateProgress();
}

// Save syllabus changes
function saveSyllabusChanges() {
    if (!syllabusForm) return;
    
    // Validate form
    if (!syllabusForm.checkValidity()) {
        syllabusForm.reportValidity();
        return;
    }
    
    // Get form values
    const title = syllabusForm.querySelector('#syllabusTitle').value;
    const code = syllabusForm.querySelector('#syllabusCode').value;
    const instructor = syllabusForm.querySelector('#syllabusInstructor').value;
    const description = syllabusForm.querySelector('#syllabusDescription').value;
    
    // Get objectives
    const objectivesText = syllabusForm.querySelector('#syllabusObjectives').value;
    const objectives = objectivesText.split('\n').filter(objective => objective.trim() !== '');
    
    // Get topics
    const topics = [];
    const topicFormGroups = syllabusForm.querySelectorAll('.topic-form-group');
    
    topicFormGroups.forEach(topicGroup => {
        const topicId = topicGroup.dataset.topicId;
        const topicTitle = topicGroup.querySelector('.topic-title-input').value;
        const topicDescription = topicGroup.querySelector('.topic-description-input').value;
        
        // Get subtopics
        const subtopics = [];
        const subtopicFormGroups = topicGroup.querySelectorAll('.subtopic-form-group');
        
        subtopicFormGroups.forEach(subtopicGroup => {
            const subtopicId = subtopicGroup.dataset.subtopicId;
            const subtopicTitle = subtopicGroup.querySelector('.subtopic-title-input').value;
            
            subtopics.push({
                id: subtopicId,
                title: subtopicTitle,
                completed: false
            });
        });
        
        topics.push({
            id: topicId,
            title: topicTitle,
            description: topicDescription,
            completed: false,
            subtopics: subtopics
        });
    });
    
    // Get assessment methods
    const assessment = [];
    const assessmentFormGroups = syllabusForm.querySelectorAll('.assessment-form-group');
    
    assessmentFormGroups.forEach(assessmentGroup => {
        const type = assessmentGroup.querySelector('.assessment-type-input').value;
        const weight = assessmentGroup.querySelector('.assessment-weight-input').value;
        const description = assessmentGroup.querySelector('.assessment-description-input').value;
        
        assessment.push({
            type: type,
            weight: parseInt(weight),
            description: description
        });
    });
    
    // Get materials
    const materials = [];
    const materialFormGroups = syllabusForm.querySelectorAll('.material-form-group');
    
    materialFormGroups.forEach(materialGroup => {
        const type = materialGroup.querySelector('.material-type-input').value;
        const title = materialGroup.querySelector('.material-title-input').value;
        const author = materialGroup.querySelector('.material-author-input').value;
        const url = materialGroup.querySelector('.material-url-input').value;
        const required = materialGroup.querySelector('.material-required-input').checked;
        
        materials.push({
            type: type,
            title: title,
            author: author || null,
            url: url || null,
            required: required
        });
    });
    
    // Create updated syllabus data
    const updatedSyllabusData = {
        title: title,
        code: code,
        instructor: instructor,
        description: description,
        objectives: objectives,
        topics: topics,
        assessment: assessment,
        materials: materials
    };
    
    // This would normally update the data in Firebase
    console.log('Saving syllabus changes:', updatedSyllabusData);
    
    // Update UI with new data
    populateSyllabusData(updatedSyllabusData);
    
    // Close modal
    closeSyllabusEditModal();
    
    // Show success message
    showMessage('Syllabus updated successfully');
}

// Show error message
function showError(message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'alert alert-danger';
    errorElement.textContent = message;
    
    syllabusContainer.innerHTML = '';
    syllabusContainer.appendChild(errorElement);
}

// Show success/info message
function showMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'alert alert-success';
    messageElement.textContent = message;
    
    // Add message to container
    syllabusContainer.insertBefore(messageElement, syllabusContainer.firstChild);
    
    // Remove message after 3 seconds
    setTimeout(() => {
        messageElement.remove();
    }, 3000);
}
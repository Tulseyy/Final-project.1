// Select DOM elements
const taskForm = document.getElementById('task-form');
const taskList = document.getElementById('task-list');
const themeToggle = document.getElementById('theme-toggle');
const animationsToggle = document.getElementById('animations-toggle');
const colorCodingInputs = document.querySelectorAll('input[name="color"]');
const addIconsButton = document.getElementById('add-icons');

// Theme toggle functionality
let darkMode = false;

function toggleTheme() {
    darkMode = !darkMode;
    document.body.classList.toggle('dark-mode', darkMode);
}

// Add new task
function addTask(event) {
    event.preventDefault();

    const taskName = document.getElementById('task-name').value;
    const taskDate = document.getElementById('task-date').value;
    const selectedColor = document.querySelector('input[name="color"]:checked')?.value || 'default';

    if (taskName && taskDate) {
        const taskItem = document.createElement('li');
        taskItem.style.borderColor = selectedColor;

        taskItem.innerHTML = `
            <span>${taskName} - ${taskDate}</span>
            <div>
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;

        if (animationsToggle.dataset.animations === 'on') {
            taskItem.classList.add('animated');
        }

        taskList.appendChild(taskItem);
        saveTasksToLocalStorage();
        taskForm.reset();
    }
}

// Edit or delete tasks
function handleTaskActions(event) {
    const target = event.target;
    const taskItem = target.closest('li');

    if (target.classList.contains('delete-btn')) {
        taskItem.remove();
        saveTasksToLocalStorage();
    } else if (target.classList.contains('edit-btn')) {
        const taskDetails = taskItem.querySelector('span').textContent.split(' - ');
        const taskName = taskDetails[0];
        const taskDate = taskDetails[1];

        document.getElementById('task-name').value = taskName;
        document.getElementById('task-date').value = taskDate;
        taskItem.remove();
        saveTasksToLocalStorage();
    }
}

// Save tasks to localStorage
function saveTasksToLocalStorage() {
    const tasks = Array.from(taskList.children).map(task => {
        const taskDetails = task.querySelector('span').textContent.split(' - ');
        const taskName = taskDetails[0];
        const taskDate = taskDetails[1];
        const borderColor = task.style.borderColor;

        return { name: taskName, date: taskDate, color: borderColor };
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasksFromLocalStorage() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    tasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.style.borderColor = task.color;

        taskItem.innerHTML = `
            <span>${task.name} - ${task.date}</span>
            <div>
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;

        taskList.appendChild(taskItem);
    });
}

// Toggle animations
function toggleAnimations() {
    const currentState = animationsToggle.dataset.animations;
    animationsToggle.dataset.animations = currentState === 'on' ? 'off' : 'on';
}

// Add custom icons to tasks
function addCustomIcons() {
    taskList.querySelectorAll('li').forEach(task => {
        if (!task.querySelector('.custom-icon')) {
            const icon = document.createElement('span');
            icon.textContent = '⭐';
            icon.className = 'custom-icon';
            task.prepend(icon);
        }
    });
}

// Event listeners
themeToggle.addEventListener('click', toggleTheme);
animationsToggle.addEventListener('click', toggleAnimations);
taskForm.addEventListener('submit', addTask);
taskList.addEventListener('click', handleTaskActions);
addIconsButton.addEventListener('click', addCustomIcons);

// Initial load
loadTasksFromLocalStorage();


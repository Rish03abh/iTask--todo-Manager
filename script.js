// Get DOM elements
const todoInput = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');

let isEditing = false;
let editingTask = null;

// Load tasks from localStorage
document.addEventListener('DOMContentLoaded', loadTasks);

// Add new or update task
addBtn.addEventListener('click', () => {
    const taskText = todoInput.value.trim();

    if (taskText === "") return;

    if (isEditing) {
        // Update the task being edited
        updateTask(editingTask, taskText);
        resetEditingState();
    } else {
        // Add a new task
        addTaskToDOM({ text: taskText, completed: false });
        saveTaskToStorage({ text: taskText, completed: false });
    }

    todoInput.value = '';
});

// Add task to DOM
function addTaskToDOM(task) {
    const listItem = document.createElement('li');
    listItem.className = `todo-item ${task.completed ? 'completed' : ''}`;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => toggleTaskCompletion(task.text, checkbox.checked));

    const taskSpan = document.createElement('span');
    taskSpan.textContent = task.text;

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.className = 'edit-btn';
    editBtn.addEventListener('click', () => startEditingTask(listItem, taskSpan));

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'delete-btn';
    deleteBtn.addEventListener('click', () => {
        listItem.remove();
        removeTaskFromStorage(task.text);
    });

    listItem.appendChild(checkbox);
    listItem.appendChild(taskSpan);
    listItem.appendChild(editBtn);
    listItem.appendChild(deleteBtn);
    todoList.appendChild(listItem);
}

// Start editing a task
function startEditingTask(listItem, taskSpan) {
    todoInput.value = taskSpan.textContent;
    todoInput.focus();

    isEditing = true;
    editingTask = { listItem, oldText: taskSpan.textContent };
    addBtn.textContent = 'Update';
}

// Update task
function updateTask(editingTask, newText) {
    const { listItem, oldText } = editingTask;

    // Update the DOM
    const taskSpan = listItem.querySelector('span');
    taskSpan.textContent = newText;

    // Update localStorage
    updateTaskInStorage(oldText, newText);
}

// Reset editing state
function resetEditingState() {
    isEditing = false;
    editingTask = null;
    addBtn.textContent = 'Add';
}

// Toggle task completion
function toggleTaskCompletion(taskText, isCompleted) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const task = tasks.find(t => t.text === taskText);
    if (task) {
        task.completed = isCompleted;
    }
    localStorage.setItem('tasks', JSON.stringify(tasks));

    // Update DOM
    const taskElements = [...todoList.children];
    taskElements.forEach(item => {
        const taskSpan = item.querySelector('span');
        if (taskSpan.textContent === taskText) {
            item.classList.toggle('completed', isCompleted);
        }
    });
}

// Save task to localStorage
function saveTaskToStorage(task) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Remove task from localStorage
function removeTaskFromStorage(taskText) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => task.text !== taskText);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Update task in localStorage
function updateTaskInStorage(oldText, newText) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskIndex = tasks.findIndex(task => task.text === oldText);
    if (taskIndex > -1) {
        tasks[taskIndex].text = newText;
    }
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => addTaskToDOM(task));
}

document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const noTasksMessage = document.getElementById('noTasksMessage');

    // Load tasks from local storage on page load
    loadTasks();

    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            addTask();
        }
    });

    // Function to add a new task
    function addTask() {
        const taskText = taskInput.value.trim();

        if (taskText === '') {
            alert('Please enter a task!');
            return;
        }

        const task = {
            id: Date.now(), // Unique ID for the task
            text: taskText,
            completed: false
            // date: null, // For future implementation
            // time: null  // For future implementation
        };

        createTaskElement(task);
        saveTask(task);
        taskInput.value = ''; // Clear input field
        updateNoTasksMessage();
    }

    // Function to create and append a task item to the DOM
    function createTaskElement(task) {
        const listItem = document.createElement('li');
        listItem.classList.add('task-item');
        if (task.completed) {
            listItem.classList.add('completed');
        }
        listItem.dataset.id = task.id; // Store ID on the element

        listItem.innerHTML = `
            <div class="task-content">
                <input type="checkbox" ${task.completed ? 'checked' : ''} class="task-checkbox">
                <span class="task-text">${task.text}</span>
            </div>
            <div class="task-actions">
                <button class="edit-btn" title="Edit Task"><i class="fas fa-edit"></i></button>
                <button class="delete-btn" title="Delete Task"><i class="fas fa-trash-alt"></i></button>
            </div>
        `;

        taskList.appendChild(listItem);

        // Add event listeners for the new task item
        const checkbox = listItem.querySelector('.task-checkbox');
        checkbox.addEventListener('change', () => toggleTaskComplete(task.id));

        const deleteButton = listItem.querySelector('.delete-btn');
        deleteButton.addEventListener('click', () => deleteTask(task.id));

        const editButton = listItem.querySelector('.edit-btn');
        editButton.addEventListener('click', () => editTask(task.id, listItem.querySelector('.task-text')));
    }

    // Function to toggle task completion status
    function toggleTaskComplete(id) {
        const taskItem = document.querySelector(.task-item[data-id="${id}"]);
        taskItem.classList.toggle('completed');

        let tasks = getTasksFromLocalStorage();
        tasks = tasks.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        saveTasksToLocalStorage(tasks);
    }

    // Function to delete a task
    function deleteTask(id) {
        if (!confirm('Are you sure you want to delete this task?')) {
            return;
        }
        const taskItem = document.querySelector(.task-item[data-id="${id}"]);
        taskItem.remove();

        let tasks = getTasksFromLocalStorage();
        tasks = tasks.filter(task => task.id !== id);
        saveTasksToLocalStorage(tasks);
        updateNoTasksMessage();
    }

    // Function to edit a task
    function editTask(id, taskTextElement) {
        const currentText = taskTextElement.textContent;
        const inputField = document.createElement('input');
        inputField.type = 'text';
        inputField.value = currentText;
        inputField.classList.add('edit-input'); // Add a class for potential styling
        taskTextElement.replaceWith(inputField);
        inputField.focus();

        const saveEdit = () => {
            const newText = inputField.value.trim();
            if (newText === '') {
                alert('Task cannot be empty!');
                // Revert to original text if empty
                inputField.replaceWith(taskTextElement);
                return;
            }
            taskTextElement.textContent = newText;
            inputField.replaceWith(taskTextElement);

            let tasks = getTasksFromLocalStorage();
            tasks = tasks.map(task =>
                task.id === id ? { ...task, text: newText } : task
            );
            saveTasksToLocalStorage(tasks);
        };

        inputField.addEventListener('blur', saveEdit); // Save when input loses focus
        inputField.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                saveEdit();
            }
        });
    }

    // --- Local Storage Functions ---

    function getTasksFromLocalStorage() {
        const tasksString = localStorage.getItem('tasks');
        return tasksString ? JSON.parse(tasksString) : [];
    }

    function saveTasksToLocalStorage(tasks) {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function saveTask(task) {
        const tasks = getTasksFromLocalStorage();
        tasks.push(task);
        saveTasksToLocalStorage(tasks);
    }

    function loadTasks() {
        const tasks = getTasksFromLocalStorage();
        tasks.forEach(task => createTaskElement(task));
        updateNoTasksMessage();
    }

    function updateNoTasksMessage() {
        if (taskList.children.length === 0) {
            noTasksMessage.style.display = 'block';
        } else {
            noTasksMessage.style.display = 'none';
        }
    }
});
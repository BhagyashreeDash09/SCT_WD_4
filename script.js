function addTask() {
  const input = document.getElementById('taskInput');
  const taskText = input.value.trim();
  const taskList = document.getElementById('taskList');
  const noTasks = document.getElementById('noTasks');

  if (taskText === '') {
    alert('Please enter a task!');
    return;
  }

  const li = document.createElement('li');
  li.textContent = taskText;

  const deleteBtn = document.createElement('button');
  deleteBtn.innerHTML = '×';
  deleteBtn.className = 'delete-btn';
  deleteBtn.onclick = () => {
    li.remove();
    if (taskList.children.length === 0) {
      noTasks.style.display = 'block';
    }
  };

  li.appendChild(deleteBtn);
  taskList.appendChild(li);
  input.value = '';
  noTasks.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {

  // DOM Elements
  const taskForm = document.getElementById('taskForm');
  const taskInput = document.getElementById('taskInput');
  const inputError = document.getElementById('inputError');
  const taskList = document.getElementById('taskList');
  const emptyState = document.getElementById('emptyState');
  const searchInput = document.getElementById('searchInput');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const pendingCount = document.getElementById('pendingCount');
  const completedCount = document.getElementById('completedCount');
  const themeToggle = document.getElementById('themeToggle');

  // Application State
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  let currentFilter = 'all';

// Dark Theme Persistence & Toggle with Emoji
const themeIcon = document.getElementById('themeIcon');

if (localStorage.getItem('darkMode') === 'enabled') {
  document.body.classList.add('dark-mode');
  if (themeIcon) themeIcon.textContent = '☀️';
}

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  
  if (themeIcon) themeIcon.textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
});
  
  // 2. Save Tasks to LocalStorage
  const saveTasks = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  };

  // 3. Update Counter Metrics
  const updateCounters = () => {
    const completed = tasks.filter(task => task.completed).length;
    const pending = tasks.length - completed;

    pendingCount.textContent = pending;
    completedCount.textContent = completed;
  };

  // 4. Render Tasks on UI
  const renderTasks = () => {
    taskList.innerHTML = '';

    const query = searchInput.value.toLowerCase().trim();

    const filteredTasks = tasks.filter(task => {
      const matchesSearch = task.text.toLowerCase().includes(query);
      if (currentFilter === 'pending') return matchesSearch && !task.completed;
      if (currentFilter === 'completed') return matchesSearch && task.completed;
      return matchesSearch;
    });

    if (filteredTasks.length === 0) {
      emptyState.style.display = 'block';
    } else {
      emptyState.style.display = 'none';

      filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        li.innerHTML = `
          <div class="task-content">
            <div class="checkbox" onclick="toggleTask('${task.id}')">
              <i class="fa-solid fa-check"></i>
            </div>
            <span class="task-text">${escapeHTML(task.text)}</span>
          </div>
          <div class="task-actions">
            <button class="action-btn" onclick="editTask('${task.id}')" title="Edit">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button class="action-btn delete" onclick="deleteTask('${task.id}')" title="Delete">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        `;
        taskList.appendChild(li);
      });
    }

    updateCounters();
  };

  // Prevent XSS Injection
  const escapeHTML = (str) => {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  };

  // 5. Add New Task
  taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = taskInput.value.trim();

    if (text === '') {
      inputError.style.display = 'block';
      return;
    }

    inputError.style.display = 'none';

    const newTask = {
      id: Date.now().toString(),
      text: text,
      completed: false
    };

    tasks.unshift(newTask);
    saveTasks();
    renderTasks();
    taskInput.value = '';
  });

  // 6. Global Task Actions (Toggle, Edit, Delete)
  window.toggleTask = (id) => {
    tasks = tasks.map(task => {
      if (task.id === id) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    saveTasks();
    renderTasks();
  };

  // Delete Task with standard confirmation (optional safe delete)
  window.deleteTask = (id) => {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
  };

  // Edit Task
  window.editTask = (id) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const newText = prompt('Edit your task:', task.text);
    if (newText !== null && newText.trim() !== '') {
      task.text = newText.trim();
      saveTasks();
      renderTasks();
    }
  };

  // 7. Search & Filter Handlers
  searchInput.addEventListener('input', renderTasks);

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      renderTasks();
    });
  });

  // Initial App Load
  renderTasks();
});

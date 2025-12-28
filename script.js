let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all';

function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function addTodo() {
  const input = document.getElementById('todo-input');
  const priority = document.getElementById('priority').value;
  const dueDate = document.getElementById('due-date').value;
  
  if (!input.value.trim()) {
    alert('Please enter a todo');
    return;
  }
  
  const todo = {
    id: Date.now(),
    text: input.value,
    completed: false,
    priority,
    dueDate,
    createdAt: new Date().toISOString()
  };
  
  todos.push(todo);
  saveTodos();
  renderTodos();
  
  input.value = '';
  document.getElementById('due-date').value = '';
}

function toggleTodo(id) {
  const todo = todos.find(t => t.id === id);
  if (todo) {
    todo.completed = !todo.completed;
    saveTodos();
    renderTodos();
  }
}

function deleteTodo(id) {
  todos = todos.filter(t => t.id !== id);
  saveTodos();
  renderTodos();
}

function editTodo(id) {
  const todo = todos.find(t => t.id === id);
  if (todo) {
    const newText = prompt('Edit todo:', todo.text);
    if (newText && newText.trim()) {
      todo.text = newText.trim();
      saveTodos();
      renderTodos();
    }
  }
}

function filterTodos(filter) {
  currentFilter = filter;
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');
  renderTodos();
}

function renderTodos() {
  const list = document.getElementById('todo-list');
  const searchTerm = document.getElementById('search').value.toLowerCase();
  
  let filtered = todos.filter(todo => {
    const matchesSearch = todo.text.toLowerCase().includes(searchTerm);
    const matchesFilter = 
      currentFilter === 'all' ||
      (currentFilter === 'active' && !todo.completed) ||
      (currentFilter === 'completed' && todo.completed);
    return matchesSearch && matchesFilter;
  });
  
  // Sort by priority
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  filtered.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  
  list.innerHTML = filtered.map(todo => `
    <li class="todo-item ${todo.completed ? 'completed' : ''}" draggable="true">
      <div class="priority-indicator priority-${todo.priority}"></div>
      <input type="checkbox" ${todo.completed ? 'checked' : ''} 
             onchange="toggleTodo(${todo.id})">
      <div class="todo-text">
        <div>${todo.text}</div>
        ${todo.dueDate ? `<div class="due-date">Due: ${new Date(todo.dueDate).toLocaleDateString()}</div>` : ''}
      </div>
      <div class="todo-actions">
        <button onclick="editTodo(${todo.id})">✏️</button>
        <button onclick="deleteTodo(${todo.id})">🗑️</button>
      </div>
    </li>
  `).join('');
  
  updateStats();
}

function updateStats() {
  document.getElementById('total').textContent = todos.length;
  document.getElementById('active').textContent = todos.filter(t => !t.completed).length;
  document.getElementById('completed').textContent = todos.filter(t => t.completed).length;
}

function clearCompleted() {
  if (confirm('Clear all completed todos?')) {
    todos = todos.filter(t => !t.completed);
    saveTodos();
    renderTodos();
  }
}

function clearAll() {
  if (confirm('Clear all todos?')) {
    todos = [];
    saveTodos();
    renderTodos();
  }
}

function toggleTheme() {
  const html = document.documentElement;
  const currentTheme = html.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
}

// Search functionality
document.getElementById('search').addEventListener('input', renderTodos);

// Enter key to add todo
document.getElementById('todo-input').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTodo();
});

// Load theme
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);

// Initial render
renderTodos();
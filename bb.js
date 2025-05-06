const newtask = document.getElementById("todo-input");
const addbtn = document.getElementById("add-btn");
const taskUl = document.querySelector(".todo-list");

// add list of task
function loadTask() {
  const todos = JSON.parse(localStorage.getItem("todos")) || [];
  todos.forEach((todo) => {
    const li = Creatli(todo);
    taskUl.appendChild(li);
  });
}

// create li
function Creatli(todo) {
  const li = document.createElement("li");
  li.classList.add("task-card");
  li.setAttribute('draggable', 'true');
  // اضافه کردن شناسه منحصر به فرد به هر کار
  li.dataset.id = todo.id;

  li.innerHTML = `
  <label class='custom-checkbox'>
    <input type='checkbox' class='hidden-checkbox' ${todo.done ? 'checked' : ""}>
    <span class='custom-checkmark'></span>
  </label>
  <button class="delete-btn">
    <i class="fas fa-trash-alt delete-btn"></i>
  </button>
  <p class='task-name'>${todo.text}</p>
  `;
  if (todo.done) {
    li.classList.add('done');
  }
  return li;
}

// save a new task
function savetodos(todos) {
  localStorage.setItem("todos", JSON.stringify(todos));
}

// add a new task
function addTask() {
  const text = newtask.value.trim();
  if (text) {
    const todos = JSON.parse(localStorage.getItem("todos")) || [];
    const newTodo = { id: Date.now(), text, done: false };
    if (todos.some((todos) => todos.text === text)) {
      alert('This task already exists!');
      return;
    }
    todos.push(newTodo);
    savetodos(todos);
    newtask.value = "";
    const li = Creatli(newTodo);
    taskUl.appendChild(li);
  }
}

// Drag and Drop functionality
let draggedItem = null;

taskUl.addEventListener('dragstart', (event) => {
  if (event.target.classList.contains('task-card')) {
    draggedItem = event.target;
    event.target.classList.add('dragging');
  }
});

taskUl.addEventListener('dragend', (event) => {
  if (event.target.classList.contains('task-card')) {
    draggedItem = null;
    event.target.classList.remove('dragging');
  }
});

taskUl.addEventListener('dragover', (event) => {
  event.preventDefault();
  const afterElement = getDragAfterElement(taskUl, event.clientY);
  if (afterElement == null) {
    taskUl.appendChild(draggedItem);
  } else {
    taskUl.insertBefore(draggedItem, afterElement);
  }
});

// Helper function to determine where to drop the dragged item
function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll('.task-card:not(.dragging)')];

  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// Event delegation for actions
taskUl.addEventListener('click', (event) => {
  const li = event.target.closest('.task-card');
  if (!li) return;

  const todos = JSON.parse(localStorage.getItem('todos')) || [];
  const todoId = Number(li.dataset.id);
  const todoIndex = todos.findIndex((todo) => todo.id === todoId);

  if (event.target.matches('.fa-trash-alt')) {
    if (todoIndex > -1) {
      todos.splice(todoIndex, 1);
      savetodos(todos);
      li.remove();
    }
  } else if (event.target.matches('.hidden-checkbox')) {
    if (todoIndex > -1) {
      todos[todoIndex].done = event.target.checked;
      savetodos(todos);
      li.classList.toggle('done', event.target.checked);
    }
  }
});

addbtn.addEventListener("click", addTask);
newtask.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    addTask();
  }
});

document.addEventListener("DOMContentLoaded", loadTask);

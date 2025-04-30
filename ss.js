const newtask = document.getElementById("todo-input");
const addbtn = document.getElementById("add-btn");
const taskUl = document.querySelector(".todo-list");

// add list of task
function loadTask() {
  const todos = JSON.parse(localStorage.getItem("todos")) || [];
  todos.forEach((todo) => {
    const li = createLi(todo);
    taskUl.appendChild(li);
  });
}

// create li
function createLi(todo) {
  const li = document.createElement("li");
  li.classList.add("task-card");
  li.setAttribute('draggable', 'true');
  li.dataset.id = todo.id; // اضافه کردن شناسه منحصربه‌فرد برای هر کار

  li.innerHTML = `
    <label class="custom-checkbox">
      <input type="checkbox" class="hidden-checkbox" ${todo.done ? "checked" : ""}>
      <span class="custom-checkmark"></span>
    </label>
    <p class="task-name">${todo.text}</p>
    <button class="delete-btn">X</button>
  `;

  if (todo.done) li.classList.add("done");
  return li;
}

// save todos
function saveTodos(todos) {
  localStorage.setItem("todos", JSON.stringify(todos));
}

// add a new task
function addTask() {
  const text = newtask.value.trim();
  if (text) {
    const todos = JSON.parse(localStorage.getItem("todos")) || [];
    const newTodo = { id: Date.now(), text, done: false };
    todos.push(newTodo);
    saveTodos(todos);
    newtask.value = "";
    const li = createLi(newTodo);
    taskUl.appendChild(li);
  }
}

// event delegation for actions
taskUl.addEventListener("click", (event) => {
  const li = event.target.closest(".task-card");
  if (!li) return;

  const todos = JSON.parse(localStorage.getItem("todos")) || [];
  const todoId = Number(li.dataset.id);
  const todoIndex = todos.findIndex((todo) => todo.id === todoId);

  if (event.target.matches(".delete-btn")) {
    // Delete task
    if (todoIndex > -1) {
      todos.splice(todoIndex, 1);
      saveTodos(todos);
      li.remove();
    }
  } else if (event.target.matches(".hidden-checkbox")) {
    // Toggle done state
    if (todoIndex > -1) {
      todos[todoIndex].done = event.target.checked;
      saveTodos(todos);
      li.classList.toggle("done", event.target.checked);
    }
  }
});

addbtn.addEventListener("click", addTask);
newtask.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addTask();
  }
});

// Load tasks when the page loads
document.addEventListener("DOMContentLoaded", loadTask);

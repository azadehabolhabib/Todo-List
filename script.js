const newtask = document.getElementById("todo-input");
const addbtn = document.getElementById("add-btn");
const taskUl = document.querySelector(".todo-list"); // انتخاب اولین عنصر

// add list of task
function loadTask() {
  const todos = JSON.parse(localStorage.getItem("todos")) || [];
  todos.forEach((todo) => {
   const li= Creatli(todo);
    // if (todo.done) {
    //   li.classList.add("done");
    // }
    taskUl.appendChild(li);
  });
}


// creat li
function Creatli(todo) {
  const li = document.createElement("li");
  li.classList.add("task-card");
  li.setAttribute('draggable','true');
  // اضافه کردن شناسه منحصر به فرد به هر کار
  li.dataset.id=todo.id;

  li.innerHTML=`
  <label class='custom-checkbox'>
   <input type='checkbox' class='hidden-checkbox' ${todo.done?'checked':""}>
   <span class='custom-checkmark'></span>
  </label>
<button class="delete-btn">
  <i class="fas fa-trash-alt delete-btn"></i>
</button>
  <p class='task-name' >${todo.text}</p>
  `
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
    const newTodo={id:Date.now(),text,done:false};
    if (todos.some(todos=>todos.text===text)) {
      alert('this task is already exist!');
      return;
    }
    todos.push(newTodo);
    savetodos(todos);
    newtask.value = "";
    const li = Creatli(newTodo);
    taskUl.appendChild(li);
  }
  
}

// event delegation for actions

taskUl.addEventListener('click',(event)=>{
  const li=event.target.closest('.task-card');
  if(!li)return;

  const todos=JSON.parse(localStorage.getItem('todos'))||[];
  const todoId=Number(li.dataset.id);
  const todoIndex=todos.findIndex((todo)=>todo.id===todoId);

  if (event.target.matches('.fa-trash-alt')) {
    if (todoIndex > -1) {
      todos.splice(todoIndex,1);
      savetodos(todos);
      li.remove();
        }
  }else if (event.target.matches('.hidden-checkbox')) {
    if (todoIndex > -1) {
      todos[todoIndex].done=event.target.checked;
      savetodos(todos);
      li.classList.toggle('done',event.target.checked);
    }
  }
});

addbtn.addEventListener("click", addTask);
newtask.addEventListener('keydown',(event)=>{
  if (event.key==='Enter') {
    addTask();
  }
});

document.addEventListener("DOMContentLoaded", loadTask);

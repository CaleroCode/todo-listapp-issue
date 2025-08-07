// Archivo principal de la aplicación. Aquí se inicializa todo.
// Coordina la carga inicial de tareas, vincula eventos del DOM y utiliza las funciones de api.js y dom.js.
// Actúa como punto de entrada para el funcionamiento de la ToDo List.


import { getTasks, createTask } from './api.js';
import { renderTask } from './dom.js';

const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task-btn");
const taskList = document.getElementById("task-list");
const emptyImage = document.querySelector(".empty-image");

const toggleEmptyState = () => {
  emptyImage.style.display = taskList.children.length === 0 ? "block" : "none";
};

const loadTasks = async () => {
  const tasks = await getTasks();
  taskList.innerHTML = "";
  tasks.forEach(task =>
    renderTask(task, taskList, taskInput, toggleEmptyState)
  );
//   toggleEmptyState();
};

const addTask = async () => {
  const text = taskInput.value.trim();
  if (!text) return;

  const newTask = await createTask({ text, completed: false });

  if (newTask) {
    renderTask(newTask, taskList, taskInput, toggleEmptyState);
    taskInput.value = "";
    // toggleEmptyState();
  }
};

addTaskBtn.addEventListener("click", (e) => {
  e.preventDefault();
  addTask();
});

loadTasks();

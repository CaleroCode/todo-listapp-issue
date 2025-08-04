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

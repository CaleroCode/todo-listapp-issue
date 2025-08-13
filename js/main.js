// main.js
// Archivo principal de la aplicación. Inicializa, carga tareas y coordina eventos de UI.
// Funciona con json-server y el módulo dom.js que ya gestiona el textarea de notas.

import { getTasks, createTask, updateTask } from './api.js';
import { renderTask } from './dom.js';

const taskInput   = document.getElementById("task-input");
const addTaskBtn  = document.getElementById("add-task-btn");
const taskList    = document.getElementById("task-list");
const emptyImage  = document.querySelector(".empty-image");
const priorityToggle = document.getElementById("priority-toggle");

const toggleEmptyState = () => {
  if (!emptyImage) return;
  emptyImage.style.display = taskList.children.length === 0 ? "block" : "none";
};

const loadTasks = async () => {
  try {
    const tasks = await getTasks();
    taskList.innerHTML = "";
    tasks.forEach(task => renderTask(task, taskList, taskInput, toggleEmptyState));
    toggleEmptyState();
  } catch (err) {
    console.error("Error cargando tareas:", err);
  }
};

const addOrUpdateTask = async () => {
  const text = taskInput.value.trim();
  if (!text) return;

  const editingId = taskInput.dataset.editingId;
  addTaskBtn.disabled = true;

  try {
    if (editingId) {
      await updateTask(editingId, { text });
      taskInput.removeAttribute("data-editing-id");
    } else {
      const priority = priorityToggle && priorityToggle.checked ? 'high' : 'normal';
      const newTask = await createTask({ text, completed: false, note: "", priority });
      if (newTask) {
        renderTask(newTask, taskList, taskInput, toggleEmptyState);
      }
    }
    taskInput.value = "";
    if (priorityToggle) priorityToggle.checked = false;
    await loadTasks();
    taskInput.focus();
  } catch (err) {
    console.error("Error al crear/actualizar la tarea:", err);
  } finally {
    addTaskBtn.disabled = false;
  }
};

addTaskBtn.addEventListener("click", (e) => {
  e.preventDefault();
  addOrUpdateTask();
});

taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    addOrUpdateTask();
  }
});

loadTasks();

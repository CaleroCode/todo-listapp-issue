// dom.js
// Contiene funciones que manipulan el DOM (interfaz visual).
// Renderiza cada tarea, maneja eventos (completar, editar, eliminar, notas) y
// coordina las actualizaciones con la API.

import { updateTask, deleteTask } from './api.js';

// Debounce sencillo para agrupar escrituras de notas
function debounce(fn, delay = 500) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
}

export function renderTask(task, taskList, taskInput, toggleEmptyState) {
  const li = document.createElement("li");
  li.dataset.id = task.id;

  const note = typeof task.note === "string" ? task.note : "";

  if (task.priority === 'high') {
    li.classList.add('high');
  }

  li.innerHTML = `
    <div class="task-main">
      <input type="checkbox" class="checkbox" ${task.completed ? "checked" : ""} />
      <div class="task-text-wrapper">
        ${task.priority === 'high' ? `
          <span class="priority-badge" title="Alta prioridad">
            <i class="fa-solid fa-bolt"></i> Prioridad Alta
          </span>
        ` : ''}
        <span class="task-text">${task.text}</span>
      </div>
      <div class="task-buttons">
        <button class="notes-toggle-btn" title="Mostrar/Ocultar notas" aria-label="Notas">
          <i class="fa-regular fa-note-sticky"></i>
        </button>
        <button class="edit-btn" title="Editar texto" aria-label="Editar">
          <i class="fa-solid fa-pen"></i>
        </button>
        <button class="delete-btn" title="Eliminar" aria-label="Eliminar">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    </div>

    <div class="notes ${note ? "open" : ""}">
      <textarea class="note-input" placeholder="Escribe una nota...">${note}</textarea>
    </div>
  `;

  const checkbox = li.querySelector(".checkbox");
  const editBtn = li.querySelector(".edit-btn");
  const deleteBtn = li.querySelector(".delete-btn");
  const notesBtn = li.querySelector(".notes-toggle-btn");
  const notesContainer = li.querySelector(".notes");
  const noteInput = li.querySelector(".note-input");

  if (task.completed) {
    li.classList.add("completed");
    editBtn.disabled = true;
    editBtn.style.opacity = "0.5";
    editBtn.style.pointerEvents = "none";
  }

  checkbox.addEventListener("change", async () => {
    const isChecked = checkbox.checked;
    li.classList.toggle("completed", isChecked);
    editBtn.disabled = isChecked;
    editBtn.style.opacity = isChecked ? "0.5" : "1";
    editBtn.style.pointerEvents = isChecked ? "none" : "auto";

    try {
      await updateTask(task.id, { completed: isChecked });
    } catch (err) {
      checkbox.checked = !isChecked;
      li.classList.toggle("completed", checkbox.checked);
      editBtn.disabled = checkbox.checked;
      editBtn.style.opacity = checkbox.checked ? "0.5" : "1";
      editBtn.style.pointerEvents = checkbox.checked ? "none" : "auto";
      console.error("Error al actualizar 'completed':", err);
    }
  });

  editBtn.addEventListener("click", () => {
    if (!checkbox.checked) {
      const currentText = li.querySelector(".task-text").textContent;
      taskInput.value = currentText;
      taskInput.dataset.editingId = task.id;
      taskInput.focus();
    }
  });

  notesBtn.addEventListener("click", () => {
    notesContainer.classList.toggle("open");
  });

  const debouncedSaveNote = debounce(async (value) => {
    try {
      await updateTask(task.id, { note: value });
    } catch (err) {
      console.error("Error al guardar la nota:", err);
    }
  }, 500);

  noteInput.addEventListener("input", (e) => {
    debouncedSaveNote(e.target.value);
  });

  deleteBtn.addEventListener("click", async () => {
    li.classList.add("falling");
    setTimeout(async () => {
      try {
        await deleteTask(task.id);
        li.remove();
        toggleEmptyState();
      } catch (err) {
        console.error("Error al eliminar la tarea:", err);
        li.classList.remove("falling");
      }
    }, 400);
  });

  taskList.appendChild(li);
}

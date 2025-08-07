// Contiene funciones que manipulan el DOM (interfaz visual).
// Se encarga de renderizar las tareas, actualizar la interfaz cuando hay cambios y manejar los eventos del usuario.
// Separa la lógica de la interfaz del resto de la aplicación.



import { updateTask, deleteTask } from './api.js';

export function renderTask(task, taskList, taskInput, toggleEmptyState) {
  const li = document.createElement("li");
  li.dataset.id = task.id;
  li.innerHTML = `
    <input type="checkbox" class="checkbox" ${task.completed ? "checked" : ""} />
    <span>${task.text}</span>
    <div class="task-buttons">
      <button class="edit-btn"><i class="fa-solid fa-pen"></i></button>
      <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
    </div>
  `;

  const checkbox = li.querySelector(".checkbox");
  const editBtn = li.querySelector(".edit-btn");

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
    await updateTask(task.id, { completed: isChecked });
  });

  editBtn.addEventListener("click", async () => {
    if (!checkbox.checked) {
      taskInput.value = li.querySelector("span").textContent;
      li.remove();
      await deleteTask(task.id);
      toggleEmptyState();
    }
  });

li.querySelector(".delete-btn").addEventListener("click", async () => {
  li.classList.add("falling");
  setTimeout(async () => {
    li.remove();
    await deleteTask(task.id);
    toggleEmptyState();
  }, 400);
});


  taskList.appendChild(li);
}

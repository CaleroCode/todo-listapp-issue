document.addEventListener("DOMContentLoaded", () =>
{
    const taskInput = document.getElementById("task-input");
    const addTaskBtn = document.getElementById("add-task-btn");
    const taskList = document.getElementById("task-list");
    const emptyImage = document.querySelector(".empty-image");
    const todosContainer = document.querySelector(".todos-container");

    const toggleEmptyState = () => {

    };

    const saveTaskToLocalStorage = ()  => {
        const task = Array.from(taskList.querySelectorAll("li")).map(li => ({
            text: li.querySelector("span").textContent,
            completed: li.querySelector(".checkbox").checked
        }));
        localStorage.setItem("tasks", JSON.stringify(task));
    };

    const loadTasksFromLocalStorage = () => {
        const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
        savedTasks.forEach(({ text, completed }) => AddTask(text, completed, false));
        toggleEmptyState();
        // updateProgess();
    }

    const AddTask = (text, completed = false) => {
        const taskText = text || taskInput.value.trim();
        console.log("Añadiendo tarea:", taskText);
        if(!taskText) {
            console.log(taskText)
            return;
        }
        const li = document.createElement("li");
        li.innerHTML = `
        <input type="checkbox" class="checkbox" ${completed ? "checked" : ""} />
        <span>${taskText}</span>
        <div class="task-buttons">
            <button class="edit-btn"><i class="fa-solid fa-pen"></i></button>
            <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
        </div>
        `;

        const checkbox = li.querySelector(".checkbox");
        const editBtn = li.querySelector(".edit-btn");

        if (completed) {
            li.classList.add("completed");
            editBtn.disabled = true;
            editBtn.style.opacity = "0.5";
            editBtn.style.pointerEvents = "none";
        }

        checkbox.addEventListener("change", () => {
            const isChecked = checkbox.checked;
            li.classList.toggle("completed", isChecked);
            editBtn.disabled = isChecked;
            editBtn.style.opacity = isChecked ? "0.5" : "1";
            editBtn.style.pointerEvents = isChecked ? "none" : "auto";
            // updateProgess();
            saveTaskToLocalStorage();
        });

        editBtn.addEventListener("click", () => {
            if(!checkbox.checked) {
                taskInput.value = li.querySelector("span").textContent;
                li.remove();
                toggleEmptyState();
                saveTaskToLocalStorage();
            }
        })

      li.querySelector(".delete-btn").addEventListener("click", () => {
    li.classList.add("falling");
    setTimeout(() => {
        li.remove();
        toggleEmptyState();
    }, 400);
    saveTaskToLocalStorage();
});

        taskList.appendChild(li);
        taskInput.value = "";
        // updateProgess(checkCompletion);
        saveTaskToLocalStorage();
    };

        addTaskBtn.addEventListener("click", (e) => {
            e.preventDefault();
            AddTask();
        });

        loadTasksFromLocalStorage();
});
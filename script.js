// Seleccionar elementos
const taskInput = document.getElementById("taskInput");
const addTaskButton = document.getElementById("addTaskButton");
const taskList = document.getElementById("taskList");
const taskCounter = document.getElementById("taskCounter");

// Función para actualizar el contador de tareas
function updateTaskCounter() {
    const totalTasks = document.querySelectorAll("#taskList li").length;
    const completedTasks = document.querySelectorAll("#taskList .complete").length;
    taskCounter.textContent = `Tareas pendientes: ${totalTasks - completedTasks} | Completadas: ${completedTasks}`;
}

// Función para guardar tareas en LocalStorage
function saveTasks() {
    const tasks = [];
    document.querySelectorAll("#taskList li").forEach((li) => {
        const taskText = li.querySelector(".task-text").textContent;
        const isComplete = li.querySelector(".task-text").classList.contains("complete");
        tasks.push({ text: taskText, complete: isComplete });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Función para cargar tareas desde LocalStorage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach((task) => {
        createTaskElement(task.text, task.complete);
    });
    updateTaskCounter();
}

// Función para crear un elemento de tarea
function createTaskElement(taskText, isComplete = false) {
  const MAX_LENGTH = 130; // Aumenta este número para mostrar más caracteres antes de "..."

  const li = document.createElement("li");
  li.innerHTML = `
      <span class="task-text" data-fulltext="${taskText}" title="${taskText}">
          ${taskText.length > MAX_LENGTH ? taskText.substring(0, MAX_LENGTH) + "..." : taskText}
      </span>
      <div class="actions">
          <button class="edit">✏️</button>
          <button class="delete">🗑️</button>
      </div>
  `;

  const taskSpan = li.querySelector(".task-text");
  if (isComplete) taskSpan.classList.add("complete");

  // Evento para editar la tarea
  li.querySelector(".edit").onclick = () => {
      const newTaskText = prompt("Edita la tarea:", taskSpan.getAttribute("data-fulltext"));
      if (newTaskText !== null && newTaskText.trim() !== "") {
          taskSpan.setAttribute("data-fulltext", newTaskText.trim());
          taskSpan.setAttribute("title", newTaskText.trim()); // Tooltip con el texto completo
          taskSpan.textContent = newTaskText.length > MAX_LENGTH ? newTaskText.substring(0, MAX_LENGTH) + "..." : newTaskText;
          saveTasks();
      }
  };

  // Evento para eliminar la tarea
  li.querySelector(".delete").onclick = () => {
      if (confirm("¿Estás seguro de que deseas eliminar esta tarea?")) {
          li.remove();
          saveTasks();
          updateTaskCounter();
      }
  };

  // Marcar como completa o incompleta
  taskSpan.onclick = () => {
      taskSpan.classList.toggle("complete");
      saveTasks();
      updateTaskCounter();
  };

  taskList.appendChild(li);
}



// Función para agregar una nueva tarea
function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === "") {
        alert("Por favor, escribe una tarea.");
        return;
    }
    createTaskElement(taskText);
    taskInput.value = "";
    saveTasks();
    updateTaskCounter();
}

// Evento al hacer clic en el botón "Agregar"
addTaskButton.addEventListener("click", addTask);

// Evento para agregar tarea al presionar "Enter"
taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        addTask();
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const themeToggle = document.getElementById("theme-toggle");
    const currentTheme = localStorage.getItem("theme");

    // Aplica el tema guardado en localStorage
    if (currentTheme === "dark") {
        document.body.classList.add("dark-mode");
        themeToggle.checked = true;
    }

    // Evento para cambiar el tema
    themeToggle.addEventListener("change", () => {
        if (themeToggle.checked) {
            document.body.classList.add("dark-mode");
            localStorage.setItem("theme", "dark");
        } else {
            document.body.classList.remove("dark-mode");
            localStorage.setItem("theme", "light");
        }
    });
});


// Cargar tareas al iniciar la aplicación
document.addEventListener("DOMContentLoaded", loadTasks);

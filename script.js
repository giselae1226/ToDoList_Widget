const input = document.querySelector("input");
const addBtn = document.querySelector(".addBtn");
const taskList = document.querySelector(".taskList");
const clearBtn = document.querySelector(".clearBtn");
const filters = document.querySelectorAll(".filter");

let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
let filter = "all";

addBtn.onclick = () => {
  const task = input.value.trim();
  if (task) {
    tasks.push({ name: task, status: "pending" });
    localStorage.setItem("tasks", JSON.stringify(tasks));
    input.value = "";
    renderTasks();
  }
};

clearBtn.onclick = () => {
  tasks = [];
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
};

filters.forEach(btn => {
  btn.onclick = () => {
    document.querySelector(".filter.active").classList.remove("active");
    btn.classList.add("active");
    filter = btn.dataset.filter;
    renderTasks();
  };
});

function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    if (filter === "all" || task.status === filter) {
      const li = document.createElement("li");
      li.classList.toggle("completed", task.status === "completed");

      li.innerHTML = `
        <div class="taskName">
          <input type="checkbox" ${task.status === "completed" ? "checked" : ""} onchange="toggleStatus(${index})">
          <span class="taskText">${task.name}</span>
        </div>
        <span class="menuBtn" onclick="showMenu(${index}, event)">⋯</span>

      `;
      taskList.appendChild(li);
    }
  });
}

function toggleStatus(index) {
  tasks[index].status = tasks[index].status === "pending" ? "completed" : "pending";
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

let currentTaskIndex = null;

document.addEventListener("click", (e) => {
  const menu = document.getElementById("contextMenu");
  if (!e.target.classList.contains("menuBtn")) {
    menu.style.display = "none";
  }
});

function showMenu(index, event) {
  event.preventDefault();
  currentTaskIndex = index;

  const menu = document.getElementById("contextMenu");
  menu.style.display = "flex";
  menu.style.top = `${event.clientY}px`;
  menu.style.left = `${event.clientX}px`;
}

function editTask() {
  const li = document.querySelectorAll(".taskList li")[currentTaskIndex];
  const textSpan = li.querySelector(".taskText");

  const input = document.createElement("input");
  input.type = "text";
  input.value = tasks[currentTaskIndex].name;
  input.className = "editInput";

  input.addEventListener("blur", () => {
    tasks[currentTaskIndex].name = input.value.trim();
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      input.blur();
    }
  });

  textSpan.replaceWith(input);
  input.focus();

  hideMenu();
}

function confirmDelete() {
  tasks.splice(currentTaskIndex, 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
  hideMenu();
}

function hideMenu() {
  const menu = document.getElementById("contextMenu");
  menu.style.display = "none";
}


renderTasks();

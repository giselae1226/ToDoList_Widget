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
        <span class="menuBtn" onclick="deleteTask(${index})">⋯</span>
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

function deleteTask(index) {
  tasks.splice(index, 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

renderTasks();

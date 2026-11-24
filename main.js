const STORAGE_KEY = "todo-list:tasks";

const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const toolbar = document.getElementById("toolbar");
const footer = document.getElementById("app-footer");
const itemsLeft = document.getElementById("items-left");
const emptyState = document.getElementById("empty-state");
const clearCompletedBtn = document.getElementById("clear-completed");
const filterButtons = document.querySelectorAll(".filters__btn");

let tasks = loadTasks();
let currentFilter = "all";

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function addTask(text) {
  tasks.push({ id: Date.now().toString(36), text, completed: false });
  saveTasks();
  render();
}

function toggleTask(id) {
  tasks = tasks.map((task) =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveTasks();
  render();
}

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  saveTasks();
  render();
}

function updateTaskText(id, text) {
  const trimmed = text.trim();
  if (!trimmed) {
    deleteTask(id);
    return;
  }
  tasks = tasks.map((task) => (task.id === id ? { ...task, text: trimmed } : task));
  saveTasks();
  render();
}

function clearCompleted() {
  tasks = tasks.filter((task) => !task.completed);
  saveTasks();
  render();
}

function getVisibleTasks() {
  if (currentFilter === "active") return tasks.filter((t) => !t.completed);
  if (currentFilter === "completed") return tasks.filter((t) => t.completed);
  return tasks;
}

function createTaskElement(task) {
  const li = document.createElement("li");
  li.className = "todo-item" + (task.completed ? " is-completed" : "");
  li.dataset.id = task.id;

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "todo-item__checkbox";
  checkbox.checked = task.completed;
  checkbox.setAttribute("aria-label", "Toggle task");
  checkbox.addEventListener("change", () => toggleTask(task.id));

  const span = document.createElement("span");
  span.className = "todo-item__text";
  span.textContent = task.text;
  span.title = "Double-click to edit";
  span.addEventListener("dblclick", () => startEditing(li, task));

  const del = document.createElement("button");
  del.type = "button";
  del.className = "todo-item__delete";
  del.textContent = "\u00d7";
  del.setAttribute("aria-label", "Delete task");
  del.addEventListener("click", () => deleteTask(task.id));

  li.append(checkbox, span, del);
  return li;
}

function startEditing(li, task) {
  const span = li.querySelector(".todo-item__text");
  const editor = document.createElement("input");
  editor.type = "text";
  editor.className = "todo-form__input";
  editor.value = task.text;
  editor.maxLength = 200;

  const commit = () => updateTaskText(task.id, editor.value);
  editor.addEventListener("blur", commit);
  editor.addEventListener("keydown", (e) => {
    if (e.key === "Enter") editor.blur();
    if (e.key === "Escape") render();
  });

  li.replaceChild(editor, span);
  editor.focus();
  editor.setSelectionRange(editor.value.length, editor.value.length);
}

function render() {
  const visible = getVisibleTasks();
  list.replaceChildren(...visible.map(createTaskElement));

  const hasTasks = tasks.length > 0;
  const activeCount = tasks.filter((t) => !t.completed).length;

  toolbar.hidden = !hasTasks;
  footer.hidden = !hasTasks;
  emptyState.hidden = hasTasks;
  emptyState.textContent = hasTasks
    ? ""
    : currentFilter === "all"
    ? "No tasks yet. Add your first one above."
    : "No tasks match this filter.";

  itemsLeft.textContent = `${activeCount} item${activeCount === 1 ? "" : "s"} left`;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  addTask(text);
  input.value = "";
  input.focus();
});

clearCompletedBtn.addEventListener("click", clearCompleted);

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;
    filterButtons.forEach((b) => b.classList.toggle("is-active", b === btn));
    render();
  });
});

render();

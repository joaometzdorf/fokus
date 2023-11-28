const buttonAddTask = document.querySelector(".app__button--add-task");
const formAddTask = document.querySelector(".app__form-add-task");
const textarea = document.querySelector(".app__form-textarea");
const ulTasks = document.querySelector(".app__section-task-list");
const taskDescriptionParagraph = document.querySelector(
  ".app__section-active-task-description"
);
const buttonCancel = document.querySelector(".app__form-footer__button--cancel");

const removeButtonCompleted = document.getElementById("btn-remover-concluidas");
const removeButtonAll = document.getElementById("btn-remover-todas");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let selectedTask = null;
let liSelectedTask = null;

function updateTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function createTaskElement(task) {
  const li = document.createElement("li");
  li.classList.add("app__section-task-list-item");

  const svg = document.createElement("svg");
  svg.innerHTML = `
    <svg class="app_section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
        <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
    </svg>
  `;

  const paragraph = document.createElement("p");
  paragraph.textContent = task.description;
  paragraph.classList.add("app__section-task-list-item-description");

  const button = document.createElement("button");
  button.classList.add("app_button-edit");

  button.onclick = () => {
    const newDescription = prompt("Qual é o novo nome da tarefa?");

    if (newDescription) {
      paragraph.textContent = newDescription;
      task.description = newDescription;
      updateTasks();
    }
  };

  const buttonImage = document.createElement("img");
  buttonImage.setAttribute("src", "/images/edit.png");
  button.append(buttonImage);

  li.append(svg);
  li.append(paragraph);
  li.append(button);

  if (task.complete) {
    li.classList.add("app__section-task-list-item-complete");
    button.setAttribute("disabled", "disabled");
  } else {
    li.onclick = () => {
      document
        .querySelectorAll(".app__section-task-list-item-active")
        .forEach((element) => {
          element.classList.remove("app__section-task-list-item-active");
        });

      if (selectedTask == task) {
        taskDescriptionParagraph.textContent = "";
        selectedTask = null;
        liSelectedTask = null;
        return;
      }
      selectedTask = task;
      liSelectedTask = li;
      taskDescriptionParagraph.textContent = task.description;

      li.classList.add("app__section-task-list-item-active");
    };
  }

  return li;
}

buttonAddTask.addEventListener("click", () => {
  formAddTask.classList.toggle("hidden");
});

formAddTask.addEventListener("submit", (e) => {
  e.preventDefault();
  const task = {
    description: textarea.value,
  };
  tasks.push(task);
  const taskElement = createTaskElement(task);
  ulTasks.append(taskElement);
  updateTasks();
  textarea.value = "";
  formAddTask.classList.add("hidden");
});

buttonCancel.addEventListener("click", () => {
  if(formAddTask.classList.contains("hidden")) {
    return
  } else {
    formAddTask.classList.add("hidden");
    textarea.value = '';
  }
})

tasks.forEach((task) => {
  const taskElement = createTaskElement(task);
  ulTasks.append(taskElement);
});

document.addEventListener("FocoFinalizado", () => {
  if (selectedTask && liSelectedTask) {
    liSelectedTask.classList.remove("app__section-task-list-item-active");
    liSelectedTask.classList.add("app__section-task-list-item-complete");
    liSelectedTask.querySelector("button").setAttribute("disabled", "disabled");
    selectedTask.complete = true;
    updateTasks();
  }
});

const removeTasks = (onlyComplete) => {
  const selector = onlyComplete ? ".app__section-task-list-item-complete" : ".app__section-task-list-item";
  document.querySelectorAll(selector).forEach((element) => {
    element.remove();
  });
  tasks = onlyComplete ? tasks.filter((task) => !task.complete) : [];
  updateTasks();
};

removeButtonCompleted.onclick = () => removeTasks(true);
removeButtonAll.onclick = () => removeTasks(false);

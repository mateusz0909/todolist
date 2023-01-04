import { Project, Task, Label } from "./constructors";
import "../style.css";

const Display = (() => {
  let projects = JSON.parse(window.localStorage.getItem("projects")) || [];
  let labels = [];
  const projectList = document.querySelector(".project_list");
  const projectInput = document.querySelector(".new_project_input");
  const taskList = document.querySelector(".task_list");
  const newTaskInput = document.querySelector(".new_task_input_form");
  const taskContainer = document.querySelector(".task_container");
  const task_details = document.querySelector(".task_details");

  function addToLocalStorage() {
    window.localStorage.removeItem("projects");
    window.localStorage.setItem("projects", JSON.stringify(projects));
  }

  function handleShowTask(e) {
    e.preventDefault();
    if (e.target.type == "checkbox") {
    } else {
      showTask(
        e.currentTarget.attributes[1].value,
        e.currentTarget.attributes[0].value
      );
    }
  }

  function addProject(project) {
    projectList.innerHTML = "";
    projects.push(new Project(project));
    addToLocalStorage();
    showProjects();
    let pID = projects.length - 1;
    showTasks(pID);
  }

  function deleteProject(e) {
    const projectID = parseInt(e.target.attributes[0].value);
    projects.splice(projectID, 1);
    addToLocalStorage();
    showProjects();
    showTasks();
  }
  function deleteTask(e) {
    const pID = parseInt(e.target.attributes[0].value);
    const tID = parseInt(e.target.attributes[1].value);

    projects[pID].tasks.splice(tID, 1);
    addToLocalStorage();
    showTasks(pID);
  }

  function showProjects() {
    projectList.innerHTML = "";
    projects.forEach((el, i) => {
      let listItem = document.createElement("li");
      listItem.classList.add("project_item");
      listItem.innerHTML = `<div class="project_item_row"> <label class="project_item" dataId=${i}>${el.projectName}</label> <span dataId=${i} class="material-symbols-outlined">
      delete
      </span> </div>`;
      projectList.appendChild(listItem);
      addToLocalStorage();
    });
    const deleteProjectIcon = document.querySelectorAll(
      ".material-symbols-outlined"
    );
    deleteProjectIcon.forEach((e) =>
      e.addEventListener("click", deleteProject)
    );
  }

  function showTasks(id = 0) {
    taskList.innerHTML = "";
    newTaskInput.attributes[0].value = id;
    let tasksContainer = document.createElement("div");
    tasksContainer.className = "tasks_container";
    let projectNameContainer = document.createElement("div");
    projectNameContainer.className = "task_project_name_container";
    projectNameContainer.innerHTML = `<h3 class="task_project_name">${projects[id].projectName} tasks: </h3>`;
    let ul = document.createElement("ul");
    projects[id].tasks.forEach((el, i) => {
      let listItem = document.createElement("li");
      let taskId = document.createAttribute("taskId");
      let projectId = document.createAttribute("projectId");
      projectId.value = id;
      taskId.value = i;
      listItem.setAttributeNode(taskId);
      listItem.setAttributeNode(projectId);
      listItem.className = "task_li";
      listItem.classList.add(el.isCompleted ? "checked" : "unChecked");
      listItem.classList.add("task_item");
      listItem.innerHTML = `<div><input id='checkbox' type="checkbox" ${
        el.isCompleted ? "checked" : ""
      } ><label >${
        el.taskName
      }</label></div><span projectID=${id} taskID=${i} class="material-symbols-outlined delete-task">
      delete
      </span> `;
      ul.appendChild(listItem);
    });
    tasksContainer.appendChild(ul);
    taskList.appendChild(projectNameContainer);
    taskList.appendChild(tasksContainer);
    if (projects[id].tasks.length === 0) {
      taskContainer.innerHTML = "";
    } else showTask(id, 0);
    const lis = document.querySelectorAll(".task_li");
    const checkboxes = document.querySelectorAll("#checkbox");
    lis.forEach((e) => e.addEventListener("mouseup", handleShowTask));
    checkboxes.forEach((e) => e.addEventListener("click", handleCheckbox));
    if (projects[id].tasks.length == 0) {
      task_details.classList.add("hidden");
    } else {
      task_details.classList.remove("hidden");
    }
    const deleteTaskIcon = document.querySelectorAll(".delete-task");
    deleteTaskIcon.forEach((e) => e.addEventListener("click", deleteTask));
  }
  function handleCheckbox(e) {
    let tID = e.path[2].attributes[0].value;
    let pID = e.path[2].attributes[1].value;

    projects[pID].tasks[tID].isCompleted = !projects[pID].tasks[tID]
      .isCompleted;
    e.path[1].classList.toggle("checked");

    if (projects[pID].tasks[tID].isCompleted) {
      showTask(pID, tID);
      taskContainer.style.opacity = "30%";
      taskContainer.style.pointerEvents = "none";
    } else {
      taskContainer.style.opacity = "100%";
      showTask(pID, tID);
    }
  }

  function handleAddNote(e) {
    e.preventDefault();
    let pID = e.target.parentElement.parentElement.attributes[1].value;
    let tID = e.target.parentElement.parentElement.attributes[2].value;
    let note = e.target.value;

    projects[pID].tasks[tID].notes = note;
    addToLocalStorage();
  }
  function submitDate(e) {
    const date = e.target.value;
    const pID = e.path[2].attributes[1].value;
    const tID = e.path[2].attributes[2].value;
    projects[pID].tasks[tID].dueDate = date;
    addToLocalStorage();
  }

  function addTask(e) {
    taskList.innerHTML = "";
    let newTaskName = e.target[0].value;
    let currentProjectIndex = e.target.attributes[0].value;
    projects[currentProjectIndex].tasks.unshift(new Task(newTaskName));
    showTasks(currentProjectIndex);
    addToLocalStorage();
  }

  function showTask(projectID, taskID) {
    taskContainer.innerHTML = "";
    taskContainer.style.pointerEvents = "all";
    const taskDetails = document.createElement("div");
    taskDetails.className = "task_details";
    taskDetails.setAttribute("pID", projectID);
    taskDetails.setAttribute("tID", taskID);
    taskDetails.innerHTML = `<p class="bread_crumb">${projects[projectID].projectName} &nbsp>&nbsp  ${projects[projectID].tasks[taskID].taskName}</p><h3>${projects[projectID].tasks[taskID].taskName}</h3><form>
    <label class="date-label" for="dueDate">Due date:</label>
    <input type="date" id="dueDate" name="dueDate" value=${projects[projectID].tasks[taskID].dueDate}><br>
  </form><h4>NOTES</h4><div class="text_area_wrapper"><textarea class="task_notes" rows="1" placeholder="Type your notes here">${projects[projectID].tasks[taskID].notes}</textarea></div>`;
    taskContainer.appendChild(taskDetails);
    let notesInput = document.querySelector(".task_notes");
    let dueDateInput = document.getElementById("dueDate");

    task_details.classList.remove("hidden");
    resize();

    notesInput.addEventListener("focusout", handleAddNote);
    notesInput.addEventListener("input", resize);
    dueDateInput.addEventListener("input", submitDate);
    function resize() {
      const lines = notesInput.value.split("\n").length;
      const lineHeight = notesInput.scrollHeight / (lines + 1);
      notesInput.style.height = "auto";
      notesInput.style.height = notesInput.scrollHeight - lineHeight + "px";
    }
  }

  return {
    addProject,
    showProjects,
    showTasks,
    addTask,
    projectList,
    projectInput,
    taskList,
    newTaskInput,
    showTask,
  };
})();

export default Display;

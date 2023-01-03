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

  const addToLocalStorage = () => {
    window.localStorage.removeItem("projects");
    window.localStorage.setItem("projects", JSON.stringify(projects));
  };

  const getFromLocalStorage = () => {
    // const str = window.localStorage.getItem("projects");
    // // window.localStorage.removeItem("projects");
    // projects = JSON.parse(str);
    console.log(projects);
  };

  const handleShowTask = (e) => {
    e.preventDefault();
    if (e.target.type == "checkbox") {
    } else {
      showTask(
        e.currentTarget.attributes[1].value,
        e.currentTarget.attributes[0].value
      );
    }
  };

  const addProject = (project) => {
    projectList.innerHTML = "";
    projects.push(new Project(project));
    addToLocalStorage();
    showProjects();
    console.log(projects);
  };

  const deleteProject = (e) => {
    const projectID = parseInt(e.target.attributes[0].value);
    console.log(projects);
    console.log("project deleted", e, projectID);
    projects.splice(projectID, 1);
    addToLocalStorage();
    showProjects();
  };

  const showProjects = () => {
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
  };

  const showTasks = (id = 0) => {
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
      listItem.innerHTML = `<input id='checkbox' type="checkbox" ${
        el.isCompleted ? "checked" : ""
      } ><label >${el.taskName}</label>`;

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
      console.log("added");
    } else {
      task_details.classList.remove("hidden");
      console.log("removed");
    }
  };
  const handleCheckbox = (e) => {
    let tID = e.path[1].attributes[0].value;
    let pID = e.path[1].attributes[1].value;

    projects[pID].tasks[tID].isCompleted = !projects[pID].tasks[tID]
      .isCompleted;
    e.path[1].classList.toggle("checked");
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    let pID = e.target.parentElement.parentElement.attributes[1].value;
    let tID = e.target.parentElement.parentElement.attributes[2].value;
    let note = e.target.value;
    addNote(pID, tID, note);
  };

  const addNote = (pID, tID, note) => {
    console.log(projects[pID].tasks);
    projects[pID].tasks[tID].notes = note;
    addToLocalStorage();
  };

  const addTask = (e) => {
    taskList.innerHTML = "";
    let newTaskName = e.target[0].value;
    let currentProjectIndex = e.target.attributes[0].value;
    projects[currentProjectIndex].tasks.unshift(new Task(newTaskName));
    showTasks(currentProjectIndex);
    addToLocalStorage();
  };

  const showTask = (projectID, taskID) => {
    taskContainer.innerHTML = "";
    const taskDetails = document.createElement("div");
    taskDetails.className = "task_details";
    taskDetails.setAttribute("pID", projectID);
    taskDetails.setAttribute("tID", taskID);
    taskDetails.innerHTML = `<p class="bread_crumb">${projects[projectID].projectName} &nbsp>&nbsp  ${projects[projectID].tasks[taskID].taskName}</p><h3>${projects[projectID].tasks[taskID].taskName}</h3><h4>NOTES</h4><div class="text_area_wrapper"><textarea class="task_notes" rows="1" placeholder="Type your notes here">${projects[projectID].tasks[taskID].notes}</textarea></div>`;
    taskContainer.appendChild(taskDetails);
    let notesInput = document.querySelector(".task_notes");
    task_details.classList.remove("hidden");
    resize();

    notesInput.addEventListener("focusout", handleAddNote);
    notesInput.addEventListener("input", resize);
    function resize() {
      const lines = notesInput.value.split("\n").length;
      const lineHeight = notesInput.scrollHeight / (lines + 1);
      notesInput.style.height = "auto";
      notesInput.style.height = notesInput.scrollHeight - lineHeight + "px";
      console.log(notesInput.heigh, lines, lineHeight);
    }
  };

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
    getFromLocalStorage,
  };
})();

export default Display;

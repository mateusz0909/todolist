import Display from "./components/display";

import "normalize.css";

const handleAddProject = (e) => {
  e.preventDefault();
  Display.addProject(e.target[0].value);
  e.target[0].value = "";
};

const handleProjectClick = (e) => {
  if (e.target && e.target.attributes.class.value == "project_item") {
    let id = e.target.attributes.dataId.value;
    Display.showTasks(id);
  }
};
const handleAddTask = (e) => {
  e.preventDefault();
  if (e.target && e.submitter.className == "add_task_btn") {
    Display.addTask(e);
    e.target[0].value = "";
  }
};

Display.projectList.addEventListener("click", handleProjectClick);
Display.projectInput.addEventListener("submit", handleAddProject);
Display.newTaskInput.addEventListener("submit", handleAddTask);

Display.showProjects();
Display.showTasks();

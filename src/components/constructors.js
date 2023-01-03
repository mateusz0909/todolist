class Project {
  constructor(projectName) {
    this.projectName = projectName;
    this.tasks = [];
  }
  addNewTask(title) {
    let newTask = new Task(title);
    this.tasks.push(newTask);
  }
  taskCount() {
    return this.tasks.length;
  }
}
class Task {
  constructor(taskName) {
    this.taskName = taskName;
    this.isCompleted = false;
    this.labels = [];
    this.notes = "";
    this.dueDate = null;
  }
  addLabel(label) {
    this.labels.push(label);
  }
}

class Label {
  constructor(labelName, color = "green") {
    this.labelName = labelName;
    this.color = color;
  }
}

export { Project, Task, Label };

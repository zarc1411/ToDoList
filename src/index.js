import Project from './modules/project';
import Task from './modules/task';

const ToDoList = (function () {
    Project.loadProject();
    const newProjectButton = document.getElementById("newProject");
    newProjectButton.addEventListener('click', Project.createNewProject);

    const collapseProjectButton = document.querySelectorAll(".collapseProjectButton");
    collapseProjectButton.forEach(button => {
        button.addEventListener('click', Project.toggleCollapse);
    });

    const deleteProjectButton = document.querySelectorAll(".deleteProjectButton");
    deleteProjectButton.forEach(button => {
        button.addEventListener('click', Project.deleteProject);
    })

    const addTaskButton = document.querySelectorAll(".addTaskButton");
    addTaskButton.forEach(button => {
        button.addEventListener('click', Task.addTask);
    })

    const deleteTaskButton = document.querySelectorAll(".deleteTaskButton");
    deleteTaskButton.forEach(button => {
        button.addEventListener('click' , Task.deleteTask);
    })
})();

import Task from "./task";
const Project = (function () {

    const loadProject = () => {
        const projectData = JSON.parse(window.localStorage.getItem('storage'));
        if(projectData!==null){
            for(let key in projectData){
                loadProjectDetailsIntoDOM(key , projectData);
            }
        }
    }

    const loadProjectDetailsIntoDOM = (projectKey , projectData) => {
        const grid = document.querySelector('.grid');

        const gridItem = document.createElement('div');
        gridItem.setAttribute('class' , 'grid-item');

        const projectList = document.createElement('ul');
        projectList.setAttribute('class' , 'project');

        const projectTitle = document.createElement('li');
        projectTitle.setAttribute('class' , 'projectTitle');

        const titleSpan = document.createElement('span');
        titleSpan.innerHTML = projectKey;

        projectTitle.appendChild(titleSpan);

        createCollapseProjectButton(projectTitle);

        projectList.appendChild(projectTitle);

        Task.loadTaskIntoDOM(projectList , projectData[projectKey]);
        createTaskAddProjectDeleteButtons(projectList);

        gridItem.appendChild(projectList);
        grid.appendChild(gridItem);
    }

    const createCollapseProjectButton = (projectTitle) => {
        const button = document.createElement('button');
        button.addEventListener('click' , toggleCollapse);
        button.setAttribute('class' , 'collapseProjectButton');
        button.innerHTML = '<i class="fa fa-2x fa-tasks" aria-hidden="true"></i>';
        projectTitle.appendChild(button);
    }

    const toggleCollapse = (e) => {
        const taskListDiv = e.currentTarget.closest(".project").querySelector(".taskList");
        if(taskListDiv!==null){
            toggleDisplay(taskListDiv);
        }
        const addAndDeleteButtons = e.currentTarget.closest(".project").querySelector(".taskAddProjectDelete");
        toggleDisplay(addAndDeleteButtons);
    }
    
    const toggleDisplay = (div) => {
        if (div.style.display === "none") {
            div.style.display = "grid";
        }
        else {
            div.style.display = "none";
        }
    }

    const addProjectToStorage = () => {
        let currentProjectInformation = getCurrentProjectInformation();
        if(currentProjectInformation === null){
            currentProjectInformation = {};
        }
        const projectName = document.querySelector(".projectName").value;
        if(projectName!=="" && projectName!==null && projectName!==undefined){
            currentProjectInformation[projectName] = [];
            loadProjectDetailsIntoDOM(projectName , currentProjectInformation);
            addProjectToInternalStorage(currentProjectInformation);
        }
    }

    const addProjectToInternalStorage = (currentProjectInformation) => {
        window.localStorage.setItem('storage' , JSON.stringify(currentProjectInformation)); 
    }

    const getCurrentProjectInformation = () => {
        let currentInternalProjectInformation = JSON.parse(window.localStorage.getItem('storage'));
        return currentInternalProjectInformation;
    }

    const deleteProject = (e) => {
        let currentProjectInformation = getCurrentProjectInformation(); 
        const parentDiv = e.currentTarget.closest(".grid-item");
        const projectToBeDeleted = locateProjectToDelete(parentDiv);
        deleteProjectFromInternalStorage(projectToBeDeleted , currentProjectInformation);
        parentDiv.setAttribute("id", "deleted-div");
        document.getElementById("deleted-div").outerHTML = "";
    }

    const locateProjectToDelete = (parentDiv) => {  
        const projectToBeDeleted = parentDiv.querySelector("span").innerHTML;;
        return projectToBeDeleted;
    }

    const deleteProjectFromInternalStorage = (projectToBeDeleted , currentProjectInformation) => {
        delete currentProjectInformation[projectToBeDeleted];
        addProjectToInternalStorage(currentProjectInformation);
    }

    const deleteProjectButton = document.querySelectorAll(".deleteProjectButton");
    deleteProjectButton.forEach(button => {
        button.addEventListener('click', deleteProject);
    })  
    
    const createTaskAddProjectDeleteButtons = (projectList) => {

        const taskAddProjectDeleteButton = document.createElement('li');
        taskAddProjectDeleteButton.setAttribute('class' , 'taskAddProjectDelete');

        const parentAddTaskDiv = document.createElement("div");
        const addTaskButton = document.createElement('button');
        addTaskButton.addEventListener('click' , Task.addTask);
        addTaskButton.setAttribute('class'  , 'addTaskButton');
        addTaskButton.innerHTML = '<i class="fa fa-3x fa-plus-circle" aria-hidden="true"></i>';
        parentAddTaskDiv.appendChild(addTaskButton);
        taskAddProjectDeleteButton.appendChild(parentAddTaskDiv);

        const parentDeleteProjectDiv = document.createElement("div");
        const deleteProjectButton = document.createElement('button');
        deleteProjectButton.addEventListener('click' , deleteProject);
        deleteProjectButton.setAttribute('class' , 'deleteProjectButton');
        deleteProjectButton.innerHTML = '<i class="fa fa-3x fa-trash-o" aria-hidden="true"></i>';
        parentDeleteProjectDiv.appendChild(deleteProjectButton);
        taskAddProjectDeleteButton.appendChild(parentDeleteProjectDiv);

        projectList.appendChild(taskAddProjectDeleteButton);
    }

    const projectPopUp = document.getElementById("newProjectPopUp");

    const keyUpEvent = e => {
        if(e.keyCode === 13){
            projectPopUp.style.display = "none";
            addProjectToStorage();
        }
    }

    const clickEvent = () => {
        addProjectToStorage();
        projectPopUp.style.display = "none";
    }

    const openProjectForm = () => {
        document.querySelector(".projectName").value = "";
        projectPopUp.style.display = "grid";
        const projectForm = document.getElementById('projectForm');
        projectForm.removeEventListener("keyup" , keyUpEvent);
        projectForm.addEventListener('keyup' , keyUpEvent);
        const addProjectButton = document.getElementById('addProjectButton');
        if(addProjectButton!==undefined){
            addProjectButton.removeEventListener("click" , clickEvent);
            addProjectButton.addEventListener("click" , clickEvent);
        }
    }

    const createNewProject = () => {
        openProjectForm();
    }

    const closePopupButton = document.getElementById("cancelButton");
    closePopupButton.addEventListener('click', () => {
        projectPopUp.style.display = "none";
    })

    return { toggleCollapse, deleteProject, createNewProject , loadProject , loadProjectDetailsIntoDOM};
})();

export default Project;

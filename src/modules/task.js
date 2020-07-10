const Task = (function () {
    const createTaskDeleteButton = (taskHeaderDiv) => {
        const button = document.createElement('button');
        button.setAttribute('class', 'deleteTaskButton');
        button.innerHTML = '<i class="fa fa-2x fa-trash" aria-hidden="true"></i>';
        taskHeaderDiv.appendChild(button);
    }

    const createTask = (taskTitle , listOfTasks) => {
        const task = document.createElement('li');
        task.setAttribute('class', 'task');

        const taskHeaderDiv = document.createElement('div');
        taskHeaderDiv.setAttribute('class', 'taskHeader');

        const prioritySpan = document.createElement('span');
        if(listOfTasks[taskTitle][2] === '1'){
            prioritySpan.innerText = "High";
            prioritySpan.style.color = "#d63447";
        } 
        else if(listOfTasks[taskTitle][2] === '2'){
            prioritySpan.innerText = "Medium";
            prioritySpan.style.color = "#f57b51";
        } 
        else if(listOfTasks[taskTitle][2] === '3'){
            prioritySpan.innerText = "Low";
            prioritySpan.style.color = "#79d70f";
        } 
        prioritySpan.style.fontWeight = "bold";
        taskHeaderDiv.appendChild(prioritySpan);

        createTaskDeleteButton(taskHeaderDiv);
        task.appendChild(taskHeaderDiv);

        const currentTaskTitle = document.createElement('p');
        currentTaskTitle.innerText = taskTitle;
        currentTaskTitle.setAttribute("class" , "taskName");
        task.appendChild(currentTaskTitle);

        const taskDescription = document.createElement('p');
        taskDescription.innerText = listOfTasks[taskTitle][0];
        task.appendChild(taskDescription);

        const taskDueDate = document.createElement('p');
        taskDueDate.innerText = listOfTasks[taskTitle][1];
        task.appendChild(taskDueDate);

        return task;
    }

    const loadTaskIntoDOM = (projectList, listOfTasks) => {
        const taskList = document.createElement('ul');
        taskList.setAttribute('class', 'taskList');
        if (Object.keys(listOfTasks).length !== 0) {
            for (let taskTitle in listOfTasks){
                const task = createTask(taskTitle , listOfTasks); 
                taskList.appendChild(task);
            }
            projectList.appendChild(taskList);
        }

    }

    const findParentProject = (e) => {
        return (e.currentTarget.closest(".project").querySelector("span").innerText);
    }

    let taskDetailsMap = null;

    const locateTasklistByProjectName = (parentProject) => {
        let taskList = null;
        const allProjectTitles = document.querySelectorAll('.projectTitle');
        allProjectTitles.forEach(projectTitle => {
            if(projectTitle.querySelector("span").innerText === parentProject){
                taskList = projectTitle.parentElement.querySelector(".taskList");
                if(taskList === null){
                    const newTaskList = document.createElement('ul');
                    newTaskList.setAttribute('class' , 'taskList');
                    const parentNode = projectTitle.parentElement;
                    parentNode.insertBefore(newTaskList , parentNode.querySelector(".taskAddProjectDelete"));
                    taskList = newTaskList;
                }
            }
        });
        return taskList;
    }

    const loadTaskTemporarily = (temporaryTaskObject , parentProject) => {
        const taskList = locateTasklistByProjectName(parentProject);
        if(taskList!==null){
            for(let taskTitle in temporaryTaskObject){
                const task = createTask(taskTitle , temporaryTaskObject);
                taskList.appendChild(task);
            }
        }
    }

    const addTaskToInternalStorage = (taskName , taskDescription , taskDate , priorityLevel , parentProject) => {
        let currentInternalProjectInformation = JSON.parse(window.localStorage.getItem('storage'));
        taskDetailsMap =  new Map(Object.entries(currentInternalProjectInformation[parentProject]));
        const temporaryTaskObject = {};
        const taskDetailsArray = [taskDescription , taskDate , priorityLevel];
        taskDetailsMap.set(taskName , taskDetailsArray);
        temporaryTaskObject[taskName] = taskDetailsArray;
        currentInternalProjectInformation[parentProject]= Object.fromEntries(taskDetailsMap);
        loadTaskTemporarily(temporaryTaskObject , parentProject);
        window.localStorage.setItem('storage' , JSON.stringify(currentInternalProjectInformation));
    }

    const taskPopUp = document.getElementById("newTaskPopUp");

    const checkIfInformationFilled = (parentProject) => {
        const taskName = document.getElementById('taskName').value;
        const taskDescription = document.getElementById('taskDescription').value;
        const taskDate = document.getElementById('taskDate').value;
        const priorityLevel = document.getElementById('priorityLevel').value;
        if (taskName !== "" && taskDate !== "" && priorityLevel !== "") {
            taskPopUp.style.display = "none";
            addTaskToInternalStorage(taskName, taskDescription, taskDate, priorityLevel,parentProject);
        }
    }

    const keyUpEvent = (e, parentProject) => {
        if (e.keyCode === 13) {
            checkIfInformationFilled(parentProject);
        }
    }

    const clickEvent = (e, parentProject) => {
        checkIfInformationFilled(parentProject);
    }

    const clearAllDetails = () => {
        document.getElementById('taskName').value = "";
        document.getElementById('taskDescription').value = "";
        document.getElementById('taskDate').value = "";
        document.getElementById('priorityLevel').value = "";
    }

    let keyUpEventCallback = null;
    let clickEventCallback = null;
    const openTaskPopUp = (e) => {
        taskPopUp.style.display = "grid";
        clearAllDetails();
        const parentProject = findParentProject(e);
        const taskDetails = document.getElementById("taskDetails");
        taskDetails.removeEventListener('keyup', keyUpEventCallback);
        keyUpEventCallback = (event) => {
            keyUpEvent(event, parentProject);
        }
        taskDetails.addEventListener('keyup', keyUpEventCallback);
        const taskAddFormButton = document.getElementById("taskAddFormButton");
        if (taskAddFormButton !== undefined) {
            taskAddFormButton.removeEventListener('click', clickEventCallback);
            clickEventCallback = (event) => {
                clickEvent(e, parentProject);
            }
            taskAddFormButton.addEventListener('click', clickEventCallback);
        }
    }

    const addTask = (e) => {
        openTaskPopUp(e);
    }

    const closeTaskPopUp = () => {
        taskPopUp.style.display = "none";
    }

    const taskCancelButton = document.getElementById('taskCancelButton');
    taskCancelButton.addEventListener('click', closeTaskPopUp);

    const submitTask = () => {
        closeTaskPopUp();
    }

    const taskAddFormButton = document.getElementById('taskAddFormButton');
    taskAddFormButton.addEventListener('click', submitTask);

    const deleteTaskFromInternalStorage = (taskName , projectTitle) => {
        let currentInternalProjectInformation = JSON.parse(window.localStorage.getItem('storage'));
        taskDetailsMap =  new Map(Object.entries(currentInternalProjectInformation[projectTitle]));
        taskDetailsMap.delete(taskName);
        currentInternalProjectInformation[projectTitle]= Object.fromEntries(taskDetailsMap);
        window.localStorage.setItem('storage' , JSON.stringify(currentInternalProjectInformation));
    }

    const deleteTask = (e) => {
        const parentDiv = e.currentTarget.closest(".task");
        const projectTitle = e.currentTarget.closest(".project").querySelector(".projectTitle").querySelector("span").innerText;
        const taskName = parentDiv.querySelector(".taskName").innerText;
        deleteTaskFromInternalStorage(taskName , projectTitle);
        parentDiv.setAttribute("id", "deleted-task");
        document.getElementById("deleted-task").outerHTML = "";
    }

    return { addTask, deleteTask, loadTaskIntoDOM };
})();

export default Task;
const Task = (function () {
    const taskPopUp = document.getElementById("newTaskPopUp");
    console.log(taskPopUp);
    const openTaskPopUp = () => {
        taskPopUp.style.display = "grid";
    }

    const addTask = (e) => {
        openTaskPopUp();
        console.log(e.target);
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

    const deleteTask = (e) => {
        const parentDiv = e.target.parentElement.parentElement.parentElement;
        parentDiv.setAttribute("id", "deleted-task");
        document.getElementById("deleted-task").outerHTML = "";
        console.log(parentDiv);
    }
    return { addTask, deleteTask };
})();

export default Task;
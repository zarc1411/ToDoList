const Project = (function () {
    const projectPopUp = document.getElementById("newProjectPopUp");

    const openProjectForm = () => {
        projectPopUp.style.display = "grid";
    }

    const createNewProject = () => {
        openProjectForm();
    }

    const closePopupButton = document.getElementById("cancelButton");
    closePopupButton.addEventListener('click', () => {
        projectPopUp.style.display = "none";
    })

    const toggleDisplay = (div) => {
        if (div.style.display === "none") {
            div.style.display = "grid";
        }
        else {
            div.style.display = "none";
        }
    }

    const toggleCollapse = (e) => {
        const taskListDiv = e.target.parentElement.parentElement.nextElementSibling;
        toggleDisplay(taskListDiv);
        const addTaskDiv = taskListDiv.nextElementSibling;
        toggleDisplay(addTaskDiv);
    }

    const deleteProject = (e) => {
        const parentDiv = e.target.parentElement.parentElement.parentElement.parentElement;
        parentDiv.setAttribute("id", "deleted-div");
        document.getElementById("deleted-div").outerHTML = "";
        console.log(parentDiv);
    }

    return { toggleCollapse, deleteProject, createNewProject };
})();

export default Project;

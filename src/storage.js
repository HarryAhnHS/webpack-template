import Todo from './todo.js';
import Project from './project.js';
import ProjectList from './projectList.js';

// Storage module 
// (add/edit/delete task and projects - need to save/extract List object in local storage for each change - create storage module)

const Storage = (() => {
    // Save, extract project list from local storage
    function saveProjectList(currentList) {
        // Update All, Today, This Week, Done
        currentList.updateAll();
        currentList.updateToday();
        currentList.updateThisWeek();
        currentList.updateDone();

        // Sort all projects todos by ascending date
        currentList.projects.forEach((project) => project.sortTodos());
        
        // console.log("saving", currentList);
        localStorage.setItem('data', JSON.stringify(currentList));
    }

    // When extracting projectList data from local Storage, need to dynamically re-allocate Projects and Todo objects
    function getProjectList() {

        let projectList;

        // Sample project content for first time load
        if (localStorage.getItem('data') == null) {
            let today = new Date();

            projectList = new ProjectList();
            projectList.addProject(new Project("SCHOOL"));
            projectList.changeColorProject("SCHOOL", "f9844a");
                projectList.getProject("SCHOOL").addTodo(
                    new Todo("DSA Midterm Review", "Who the heck is Dijkstra?", new Date(today.getFullYear(), today.getMonth(), today.getDate()+6, 14, 30), 'medium', 'SCHOOL')
                )
                projectList.getProject("SCHOOL").addTodo(
                    new Todo("Apply for internships", "It's that time of year...", new Date(today.getFullYear(), today.getMonth()+1, today.getDate(), 0,0), 'high', 'SCHOOL')
                )

            projectList.addProject(new Project("GYM"));
            projectList.changeColorProject("GYM", "90be6d");
                projectList.getProject("GYM").addTodo(
                    new Todo("Treadmill Cardio", "Speed 3MPH, Incline 12 degrees, 30 minutes", new Date(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours()+1), 'low', 'GYM')
                );
                projectList.getProject("GYM").addTodo(
                    new Todo("Leg day", "", new Date(today.getFullYear(), today.getMonth()-3, today.getDate(), 0,0), 'low', 'GYM')
                );

            projectList.addProject(new Project("CHORES"));
            projectList.changeColorProject("CHORES", "277da1");
                projectList.getProject("CHORES").addTodo(
                    new Todo("Laundry", "", new Date(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours()-1), 'medium', 'CHORES')
                );
                projectList.getProject("CHORES").getTodo("Laundry").setDone(true);

            projectList.updateAll();
            projectList.updateToday();
            projectList.updateThisWeek();
            projectList.updateDone();
        }
        else {
            projectList = Object.assign(new ProjectList, JSON.parse(localStorage.getItem('data')));
        }


        let projectsBuffer = [];
        projectList.getProjects().forEach((project) => {
            projectsBuffer.push(Object.assign(new Project, project));
        });
        projectList.setProjects(projectsBuffer);

        projectList.getProjects().forEach((project) => {
            let tasksBuffer = [];
            project.getTodos().forEach((todo) => {
                tasksBuffer.push(Object.assign(new Todo, todo));
            })
            project.setTodos(tasksBuffer);
        })
        
        // console.log("current projectList", projectList);
        return projectList;
    }


    // Add/edit/delete projects
    function addProject(newProject) {
        let projectList = getProjectList();
        
        projectList.addProject(newProject);

        saveProjectList(projectList);
    }

    function deleteProject(name) {
        let projectList = getProjectList();
        
        projectList.deleteProject(name);

        saveProjectList(projectList);
    }

    function renameProject(name, newName) {
        let projectList = getProjectList();
        
        projectList.renameProject(name, newName);

        // Update all existing todos 'project' value to newProjectName
        projectList.getProject(newName).getTodos().forEach((todo) => {
            todo.setProject(newName);
        })

        saveProjectList(projectList);
    }

    function changeColorProject(name, newColor) {
        let projectList = getProjectList();
        
        projectList.changeColorProject(name, newColor);

        saveProjectList(projectList);
    }

    // Add/edit/delete/finish todos within projects
    function addTodo(projectName, newTodo) {
        let projectList = getProjectList();    
        
        projectList.getProject(projectName).addTodo(newTodo);

        saveProjectList(projectList);
    }

    function deleteTodo(projectName, todoName) {
        let projectList = getProjectList();
        
        projectList.getProject(projectName).deleteTodo(todoName);

        saveProjectList(projectList);
    }

    function renameTodo(projectName, todoTitle, newTitle) {
        let projectList = getProjectList();

        // console.log("Renaming todo in Project:" + projectName + " | Todo:" + todoTitle + " | to newTitle: " + newTitle);
        
        projectList.getProject(projectName).getTodo(todoTitle).setTitle(newTitle);

        saveProjectList(projectList);
    }

    function changeDescTodo(projectName, todoTitle, newDesc) {
        let projectList = getProjectList();

        // console.log("changing desc todo in Project:" + projectName + " | Todo:" + todoTitle + " | to NewDesc: " + newDesc);

        if (newDesc == "") {
            projectList.getProject(projectName).getTodo(todoTitle).emptyDesc();
        }
        else {
            projectList.getProject(projectName).getTodo(todoTitle).setDesc(newDesc);
        }

        saveProjectList(projectList);
    }

    function changeDateTodo(projectName, todoTitle, newDate) {
        let projectList = getProjectList();
        
        projectList.getProject(projectName).getTodo(todoTitle).setDate(newDate);

        saveProjectList(projectList);
    }

    function changePriorityTodo(projectName, todoTitle, newPriority) {
        let projectList = getProjectList();
        
        projectList.getProject(projectName).getTodo(todoTitle).setPriority(newPriority);

        saveProjectList(projectList);
    }

    function changeDoneTodo(projectName, todoTitle, isDone) {
        let projectList = getProjectList();
        
        projectList.getProject(projectName).getTodo(todoTitle).setDone(isDone);

        saveProjectList(projectList);
    }






    return {
        saveProjectList,
        getProjectList,

        addProject,
        deleteProject,
        renameProject,
        changeColorProject,

        addTodo,
        deleteTodo,
        renameTodo,
        changeDescTodo,
        changeDateTodo,
        changePriorityTodo,
        changeDoneTodo
    }
})();

export default Storage;
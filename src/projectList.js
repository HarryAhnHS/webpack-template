// import Todo from './todo.js';
import Project from './project.js';

export default class ProjectList {
    constructor() {
        this.projects = [];
        this.projects.push(new Project('ALL'));
        this.projects.push(new Project('TODAY'));
        this.projects.push(new Project('THIS WEEK'));
        this.projects.push(new Project('DONE'));
    };

    /**
     * 
     * @param {Project} newProject - instance of Project object
     */
    addProject(newProject) {
        if (!this.projects.some((project) => project.name.toUpperCase() == newProject.getName().toUpperCase())) {
            this.projects.push(newProject);
        }
        else {
            console.log('Project with same name exists');
            return -1;
        }
    }

    projectExists(projectName) {
        return this.projects.some((project) => project.name.toUpperCase() == projectName.toUpperCase());
    }

    deleteProject(projectName) {
        this.projects = this.projects.filter((project) => project.name.toUpperCase() !== projectName.toUpperCase());
    }

    renameProject(projectName, newName) {
        let idx = this.projects.findIndex((project) => project.name.toUpperCase() === projectName.toUpperCase());
        this.projects[idx].setName(newName.toUpperCase());
    }

    changeColorProject(projectName, newColor)  {
        let idx = this.projects.findIndex((project) => project.name.toUpperCase() === projectName.toUpperCase());
        this.projects[idx].setColor(newColor);
    }

    getProjects() {
        return this.projects;
    }

    setProjects(projects) {
        this.projects = projects;
    }

    getProject(projectName) {
        return this.projects.find((project) => project.name.toUpperCase() === projectName.toUpperCase())
    }

    // Update All, Today, This Week, Done Projects
    updateAll() {
        this.getProject('All').setTodos([]);

        let buffer = [];
        this.projects.forEach((project) => {
            if (project.name != "ALL" && project.name != "TODAY" && project.name != "THIS WEEK" && project.name != "DONE") {
                project.getTodos().forEach((todo) => {
                    buffer.push(todo);
                })
            }
        })

        this.getProject('ALL').setTodos(buffer);
    }

    updateToday() {
        this.getProject('TODAY').setTodos([]);

        let buffer = [];
        this.projects.forEach((project) => {
            if (project.name != "ALL" && project.name != "TODAY" && project.name != "THIS WEEK" && project.name != "DONE") {
                project.getTodayTodos().forEach((todo) => {
                    if (!todo.done) {
                        buffer.push(todo);
                    }
                })
            }
        })

        this.getProject('TODAY').setTodos(buffer);
    }

    updateThisWeek() {
        this.getProject('THIS WEEK').setTodos([]);

        let buffer = [];
        this.projects.forEach((project) => {
            if (project.name != "ALL" && project.name != "TODAY" && project.name != "THIS WEEK" && project.name != "DONE") {
                project.getThisWeekTodos().forEach((todo) => {
                    if (!todo.done) {
                        buffer.push(todo);
                    }
                })
            }
        })

        this.getProject('THIS WEEK').setTodos(buffer);
    }

    // Marked completed or overdue
    updateDone() {
        this.getProject('DONE').setTodos([]);

        let buffer = [];
        this.projects.forEach((project) => {
            if (project.name != "ALL" && project.name != "TODAY" && project.name != "THIS WEEK" && project.name != "DONE") {
                project.getTodos().forEach((todo) => {
                    if (todo.done) buffer.push(todo);
                })
            }
        })

        this.getProject('DONE').setTodos(buffer);
    }



};
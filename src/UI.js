import Todo from './todo.js';
import Project from './project.js';
import ProjectList from './projectList.js';
import Storage from './storage.js';

import Git from './images/github.png';
import Fav from './images/favicon.png';

import { isPast, isWithinInterval, formatDistance, formatDistanceToNow, format } from 'date-fns';

const UI = (() => {

    function init() {
        initSidebar();
        refreshCurrentProjects();
        refreshSidebarNumTodos();

        initDisplay();
        sidebarOpenClose();

        document.querySelector("#github").src = Git;
        document.querySelector('#favicon').setAttribute('href', Fav);
    }

    function sidebarOpenClose() {
        function toggleSidebar() {
            const sidebar = document.querySelector(".sidebar");
            const projects = document.querySelectorAll(".project");
            const projectTitle = document.querySelector(".my-projects-title");
            const body = document.querySelector("body");
        
            const header = document.querySelector(".header");
            const main = document.querySelector(".main");
            // Closing
            if (sidebar.classList.contains('opened')) {
                sidebar.classList.add('closed');
                body.style['grid-template-columns'] = "60px auto";
        
                header.style['grid-area'] = "1/1/2/3";
                main.style['grid-area'] = "2/1/3/3";
        
                projects.forEach(project => {
                    project.classList.add('hidden');
                })
                projectTitle.classList.add('hidden');
        
                sidebar.classList.remove('opened');
            }
            // Opening
            else {
                sidebar.classList.remove('closed');
                body.style['grid-template-columns'] = "200px auto";
        
                header.style['grid-area'] = "1/2/2/3";
                main.style['grid-area'] = "2/2/3/3";
        
                projects.forEach(project => {
                    project.classList.remove('hidden');
                })
                projectTitle.classList.remove('hidden');
        
                sidebar.classList.add('opened');
            }
        }
        
        function toggleSidebarMobile() {
            const sidebar = document.querySelector(".sidebar");
            const projects = document.querySelectorAll(".project");
            const projectTitle = document.querySelector(".my-projects-title");
            const body = document.querySelector("body");
        
            const header = document.querySelector(".header");
            const main = document.querySelector(".main");
            // Closing
            if (sidebar.classList.contains('opened')) {
                sidebar.classList.add('closed');
                body.style['grid-template-columns'] = "0px auto";
        
                header.style['grid-area'] = "1/1/2/3";
                main.style['grid-area'] = "2/1/3/3";
        
                projects.forEach(project => {
                    project.classList.add('hidden');
                })
                projectTitle.classList.add('hidden');
        
                sidebar.classList.remove('opened');
            }
            // Opening
            else {
                sidebar.classList.remove('closed');
                body.style['grid-template-columns'] = "200px auto";
        
                header.style['grid-area'] = "1/1/2/3";
                main.style['grid-area'] = "2/1/3/3";
        
                projects.forEach(project => {
                    project.classList.remove('hidden');
                })
                projectTitle.classList.remove('hidden');
        
                sidebar.classList.add('opened');
            }
        }
        
        function myFunction(x) {
            if (x.matches) { // If media query matches (smaller than 650px)
                document.querySelector(".open-close").onclick  = toggleSidebarMobile
            } else {
            // If normal
                document.querySelector(".open-close").onclick = toggleSidebar;
            }
        }
          
        // Create a MediaQueryList object
        var x = window.matchMedia("(max-width: 650px)")        
        // Call listener function at run time
        myFunction(x);
        // Attach listener function on state changes
        x.addEventListener("change", function() {
            myFunction(x);
        });
    }

    function refreshCurrentProjects() {
        displaySidebarProjects();
        clickProjectSidebar();
        newProject();
    }

    function refreshCurrentTodos() {
        const projects = document.querySelectorAll(".project");
        projects.forEach((project) => {
            if (project.classList.contains("active")) {
                clearTodos();

                if (project.classList.contains("new")) {
                    displayTodos(project.children.item(1).textContent.toUpperCase());
                }
                else {
                    displayTodos(project.children.item(0).textContent.toUpperCase());

                } 
            }
        })
    }

    function initDisplay() {
        const projectDivs = document.querySelectorAll('.project');
        const head = document.querySelector('.main-head');

        Storage.saveProjectList(Storage.getProjectList()); // Initial load 

        projectDivs.forEach((project) => {
            if (project.children.item(0).textContent == 'ALL') {
                head.innerHTML = ""; // Reset head
                resetActive();
                project.classList.add("active");

                head.textContent = "All";
                head.style.color = 'black';

                clearTodos();
                Storage.getProjectList().updateAll();
                displayTodos('ALL');
            }
        });
    };

    /**
     * Function to create and create DOM for default projects in sidebar
     */
    function initSidebar() {
        const sidebar = document.querySelector('.sidebar-defaults');

        sidebar.innerHTML = "";
        const all = document.createElement('div');
        all.classList.add("project");

        const allText = document.createElement('div');
        allText.classList.add("project-name");
        allText.textContent = "ALL";

        const numTodosAll = document.createElement('div');
        numTodosAll.classList.add('num-todos');
        numTodosAll.classList.add('all');
    
        all.appendChild(allText);
        all.appendChild(numTodosAll);

        const today = document.createElement('div');
        today.classList.add("project");

        const todayText = document.createElement('div');
        todayText.classList.add("project-name");
        todayText.textContent = "TODAY";

        const numTodosToday = document.createElement('div');
        numTodosToday.classList.add('num-todos');
        numTodosToday.classList.add('today');

        today.appendChild(todayText);
        today.appendChild(numTodosToday);
        
        const thisweek = document.createElement('div');
        thisweek.classList.add("project");

        const weekText = document.createElement('div');
        weekText.classList.add("project-name");
        weekText.textContent = "THIS WEEK";
        
        const numTodosThisWeek = document.createElement('div');
        numTodosThisWeek.classList.add('num-todos');
        numTodosThisWeek.classList.add('thisweek');
        thisweek.appendChild(weekText);
        thisweek.appendChild(numTodosThisWeek);

        const done = document.createElement('div');
        done.classList.add("project");

        const doneText = document.createElement('div');
        doneText.classList.add("project-name");
        doneText.textContent = "DONE";
        done.appendChild(doneText);

        const myProjectsTitle = document.createElement('div');
        myProjectsTitle.classList.add("my-projects-title");
            const span = document.createElement('span');
            span.textContent = "My Projects";

            const i = document.createElement('i');
            i.setAttribute('id',"new-project");
        
        myProjectsTitle.appendChild(span);
        myProjectsTitle.appendChild(i);

        sidebar.appendChild(all);
        sidebar.appendChild(today);
        sidebar.appendChild(thisweek);
        sidebar.appendChild(done);
        sidebar.appendChild(myProjectsTitle);
    }

    function refreshSidebarNumTodos() {
        // console.log("reset-sidebar")
        // Sidebar default numTodos
        const numTodosAll = document.querySelector('.num-todos.all');
        let cAll = 0;
        Storage.getProjectList().getProject("ALL").getTodos().forEach((todo) => {
            if (!todo.getDone()) { 
                cAll++;
            }
        })
        numTodosAll.textContent = cAll;

        const numTodosToday = document.querySelector('.num-todos.today');
        let cToday = 0;
        Storage.getProjectList().getProject("TODAY").getTodos().forEach((todo) => {
            if (!todo.getDone()) { 
                cToday++;
            }
        })
        numTodosToday.textContent = cToday;

        
        const numTodosThisWeek = document.querySelector('.num-todos.thisweek');
        let cWeek = 0;
        Storage.getProjectList().getProject("THIS WEEK").getTodos().forEach((todo) => {
            if (!todo.getDone()) { 
                cWeek++;
            }
        })
        numTodosThisWeek.textContent = cWeek;

        // user projects numTodos
        const myProjects = document.querySelectorAll(".project.new");
        myProjects.forEach((project) => {
            // console.log(project.children.item(1).textContent);
            let c = 0;
            Storage.getProjectList()
            .getProject(project.children.item(1).textContent)
            .getTodos().forEach((todo) => {
                if (!todo.getDone()) { 
                    c++;
                }
            })
            project.children.item(2).textContent = c;
        })

        // If num is 0 - hide
        const numTodos = document.querySelectorAll('.num-todos');
        numTodos.forEach((num) => {
            if (num.textContent == "0" || num.textContent == "") {
                // console.log(num.textContent)
                num.style.display = 'none';
            }
            else {
                num.style.display = "flex";
            }
        })
    }


    /**
     * Function to create and create DOM for new projects in sidebar
     */
    function displaySidebarProjects() {
        // Clear Previous ProjectList
        const myProjectList = document.querySelector('.my-projects');
        myProjectList.innerHTML = "";

        Storage.getProjectList().getProjects().forEach((project) => {
            if (project.name != 'ALL' && project.name != 'TODAY' && project.name != 'THIS WEEK' && project.name != 'DONE') {
                UI.createProject(project.name);
            }
        });
    }

    /**
     * helper function to createproject element and append
     * @param {*} name project name
     */
    function createProject(name) {
        const myProjectList = document.querySelector('.my-projects');

        const project = document.createElement('div');
        project.classList.add('project');
        project.classList.add('new');

        const sharp = document.createElement('span');
        sharp.innerHTML = `#&nbsp;`;
        sharp.style['pointer-events'] = 'none';

        const projectName = document.createElement('div');
        projectName.classList.add('project-name');
        projectName.textContent = `${name}`;
        projectName.style['pointer-events'] = 'none';

        sharp.style['color'] = `#${Storage.getProjectList().getProject(name).getColor()}`;

        const numTodos = document.createElement('div');
        numTodos.classList.add('num-todos');

        project.appendChild(sharp);
        project.appendChild(projectName);
        project.appendChild(numTodos);

        myProjectList.appendChild(project);
    }

    function displayTodos(projectName) {
        if (Storage.getProjectList().getProject(projectName).getTodos().length == 0) {
            // Edge-case - if no todos
            if (projectName == "DONE") {
                // No done todos
                const todoList = document.querySelector('.todo-list');

                const emptySaver = document.createElement("div");
                emptySaver.classList.add("empty-saver");

                const emoji = document.createElement("div");
                emoji.classList.add("emoji");
                emoji.textContent = "🦥";

                const text = document.createElement("div");
                text.classList.add("empty-text");
                text.textContent = "Nothing Done!"

                emptySaver.appendChild(emoji);
                emptySaver.appendChild(text);

                todoList.appendChild(emptySaver);
            }
            else if (projectName == "ALL") {
                const todoList = document.querySelector('.todo-list');

                const emptySaver = document.createElement("div");
                emptySaver.classList.add("empty-saver");

                const emoji = document.createElement("div");
                emoji.classList.add("emoji");
                emoji.textContent = "🎊";

                const text = document.createElement("div");
                text.classList.add("empty-text");
                text.textContent = "No Todos!"

                const text2 = document.createElement("div");
                text2.textContent = "Open a Project and Create Todos!"
                text2.style['font-weight'] = "200";
                text2.style['font-size'] = "18x";
                text2.style['margin-top'] = "5px";

                emptySaver.appendChild(emoji);
                emptySaver.appendChild(text);
                emptySaver.appendChild(text2);

                todoList.appendChild(emptySaver);
            }
            else {
                const todoList = document.querySelector('.todo-list');

                const emptySaver = document.createElement("div");
                emptySaver.classList.add("empty-saver");

                const emoji = document.createElement("div");
                emoji.classList.add("emoji");
                emoji.textContent = "🎊";

                const text = document.createElement("div");
                text.classList.add("empty-text");
                text.textContent = "No Todos!"

                emptySaver.appendChild(emoji);
                emptySaver.appendChild(text);

                todoList.appendChild(emptySaver);
            }
        }
        else {
            Storage.getProjectList().getProject(projectName).getTodos().forEach((todo) => {
                createTodo(todo.title, todo.priority, todo.desc, todo.date, todo.done, todo.project);
            });
        }

    }

    function createTodo(title, priority, desc, date, done, project) {

        const todo = document.createElement('div');
        todo.classList.add('todo');    

        const check = document.createElement('div');
        check.classList.add("checkbox");

        check.style['border'] = `2px solid #${Storage.getProjectList().getProject(project).getColor()}90`;
        check.style['background-color'] = `#${Storage.getProjectList().getProject(project).getColor()}30`;


        // set Todo Done input configuration
        todo.onclick = (e) => {
            // console.log('Todo clicked at:'+e.target);
            if (!e.target.classList.contains("edit-delete-popup-icon") 
            && !e.target.classList.contains("edit-delete-menu")
            && !e.target.classList.contains("option")
            && !e.target.classList.contains("editTodoIcon")
            && !e.target.classList.contains("deleteTodoIcon")
            && !e.target.classList.contains("editText")
            && !e.target.classList.contains("deleteText")
            ) {
                toggleDoneTodo(title, project);  
            }
        }

        const title_desc = document.createElement('div');
        title_desc.classList.add('title-desc');
        const title_tags = document.createElement('div');
        title_tags.classList.add('title-tags');

        const tags = document.createElement('div');
        tags.classList.add('tags');


        const titleText = document.createElement('div');
        titleText.classList.add('title');
        titleText.textContent = title;
        const priorityText = document.createElement('div');
        priorityText.classList.add('priority');
        priorityText.classList.add(priority.toLowerCase());
        priorityText.textContent = `${priority.charAt(0).toUpperCase() + priority.slice(1)} Priority`;

        // Add project name as tag
        const projectName = document.createElement('div');
        projectName.classList.add("priority");
        projectName.style['color'] = `#FFFFFF`;
        projectName.style['background-color'] = `#${Storage.getProjectList().getProject(project).getColor()}`;

        projectName.textContent = `#${project}`;

        title_tags.appendChild(titleText);
        title_tags.appendChild(tags);

        tags.appendChild(projectName);

        tags.appendChild(priorityText);
        

        const descText = document.createElement('div');
        descText.classList.add('desc');
        descText.textContent = desc;

        title_desc.appendChild(title_tags);
        title_desc.appendChild(descText);

        const date_time = document.createElement('div');
        date_time.classList.add('date-time');

        const dateFull = document.createElement('div');
        dateFull.classList.add('date');

            const dateIcon = document.createElement('i');
            dateIcon.classList.add("date-icon");

            const dateText = document.createElement('div');

        const timeFull = document.createElement('div');
        timeFull.classList.add('time');

            const timeIcon = document.createElement('i');
            timeIcon.classList.add("time-icon");

            const timeText = document.createElement('div');

        const today = new Date();
        if (isWithinInterval(date, {
            start: today,
            end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7)
        })) {
            // 1. If task's date is due within a week
            dateText.textContent = formatDistanceToNow(date, { addSuffix: true });
            timeText.textContent = `${format(date, "p")}`;
        }
        else if (isPast(date)) {
            // 2. If overdue
            dateText.textContent = formatDistance(date, today, { addSuffix: true });
            timeText.textContent = "";
            timeIcon.style.display = 'none';

            if (done) dateIcon.style['background-color'] = 'rgba(0,0,0,0.7)';
            else dateIcon.style['background-color'] = 'rgba(157, 2, 8)';
        }
        else {
            // 3. Else
            dateText.textContent = format(date, "P");
            timeText.textContent = `${format(date, "p")}`;
        }

        dateFull.appendChild(dateIcon);
        dateFull.appendChild(dateText);
        timeFull.appendChild(timeIcon);
        timeFull.appendChild(timeText);

        date_time.appendChild(dateFull);
        date_time.appendChild(timeFull);

        const edit_delete = document.createElement('div');
        edit_delete.classList.add('edit-delete');

            const edit_delete_popup_i = document.createElement('i');
            edit_delete_popup_i.classList.add('edit-delete-popup-icon')

            // Hidden popup for edit-delete buttons
            const edit_delete_menu = document.createElement('div');
            edit_delete_menu.classList.add('edit-delete-menu');
            edit_delete_menu.classList.add('hidden');

                const view_option = document.createElement('div');
                    view_option.classList.add('option');

                        const view_option_i = document.createElement('i');
                        view_option_i.classList.add("viewTodoIcon");

                        const view_option_text = document.createElement('div');
                        view_option_text.classList.add("viewText");
                        view_option_text.textContent = "View Todo";
                    
                        view_option.appendChild(view_option_i); view_option.appendChild(view_option_text);

                    // Edit delete task configuration
                    view_option.onclick = (e) => {
                        viewTodo(title, project);
                        edit_delete_menu.classList.add('hidden');
                    }

                const edit_option = document.createElement('div');
                edit_option.classList.add('option');

                    const edit_option_i = document.createElement('i');
                    edit_option_i.classList.add("editTodoIcon");

                    const edit_option_text = document.createElement('div');
                    edit_option_text.classList.add("editText");
                    edit_option_text.textContent = "Edit Todo";
                
                    edit_option.appendChild(edit_option_i); edit_option.appendChild(edit_option_text);

                // Edit delete task configuration
                edit_option.onclick = (e) => {
                    editTodo(title, project);
                    edit_delete_menu.classList.add('hidden');
                }

                const delete_option = document.createElement('div');
                delete_option.classList.add('option');

                    const delete_option_i = document.createElement('i');
                    delete_option_i.classList.add("deleteTodoIcon");

                    const delete_option_text = document.createElement('div');
                    delete_option_text.classList.add("deleteText");
                    delete_option_text.textContent = "Delete Todo";
                
                    delete_option.appendChild(delete_option_i); 
                    delete_option.appendChild(delete_option_text);

                // Edit delete task configuration
                delete_option.onclick = (e) => {
                    deleteTodo(title, project);
                    edit_delete_menu.classList.add('hidden');
                }
            
            edit_delete_menu.appendChild(view_option);    
            edit_delete_menu.appendChild(edit_option);
            edit_delete_menu.appendChild(delete_option);
        
        edit_delete.appendChild(edit_delete_popup_i);
        edit_delete.appendChild(edit_delete_menu);

        edit_delete_popup_i.onclick = function openList(e) {
            // Hide all other popups
            const popups = document.querySelectorAll('.edit-delete-menu');
            popups.forEach((menu) => {
                menu.classList.add('hidden');
            })

            // show menu 
            if (edit_delete_menu.classList.contains("hidden")) {
                edit_delete_menu.classList.remove('hidden');
            }
            else {
                edit_delete_menu.classList.add('hidden');
            }

            window.onclick =  function closeList(e) {
                if (!e.target.classList.contains("edit-delete-popup-icon")// not the edit button itself
                && !e.target.classList.contains("option") 
                && !e.target.classList.contains("edit-delete-menu")) {
                    edit_delete_menu.classList.add('hidden');
                }
            };         
        }

        todo.appendChild(check);
        todo.appendChild(title_desc);
        todo.appendChild(date_time);
        todo.appendChild(edit_delete);

        // Check for conditions before appending todo into list
        if (isPast(date) && !done) {
            // IF OVERDUE
            todo.classList.add('overdue');

            const overdue = document.createElement('div');
            overdue.classList.add("priority");
            overdue.textContent = "! Overdue";
            overdue.style['color'] = `#FFFFFF`;
            overdue.style['background-color'] = `#000000`;

            tags.appendChild(overdue);
        }

        // If done - styling
        if (done) {
            todo.classList.add('done');

            const checkIcon = document.createElement("i");
            checkIcon.classList.add('checkIcon');

            check.appendChild(checkIcon);

            check.style['background-color'] = `#${Storage.getProjectList().getProject(project).getColor()}`;
        }
        else {
            todo.classList.remove('done');

            check.innerHTML = "";
        }

        // Append new div into todolist
        const todoList = document.querySelector('.todo-list');
        todoList.appendChild(todo);
    }

    function clearTodos() {
        const todoList = document.querySelector('.todo-list');
        todoList.innerHTML = "";
    }

    function resetActive() {
        const projectDivs = document.querySelectorAll('.project');
        projectDivs.forEach(project => {
            project.classList.remove("active");
        })
    }

    // Each project click event listeners and display selected content  
    function clickProjectSidebar() {
        const projectDivs = document.querySelectorAll('.project');
        const head = document.querySelector('.main-head');

        projectDivs.forEach((project) => {
            if (project.children.item(0).textContent == 'ALL') {
                project.onclick = function switchProject(e) {
                    head.innerHTML = ""; // Reset head
                    resetActive();
                    e.target.classList.add("active");

                    head.textContent = "All";
                    head.style.color = 'black';

                    clearTodos();
                    Storage.getProjectList().updateAll();
                    displayTodos('ALL');
                };
            }
            else if (project.children.item(0).textContent == 'TODAY') {
                project.onclick = function switchProject(e) {
                    head.innerHTML = ""; // Reset head
                    resetActive();
                    e.target.classList.add("active");

                    head.textContent = "Today";
                    head.style.color = 'black';

                    clearTodos();
                    Storage.getProjectList().updateToday();
                    displayTodos('TODAY');
                };
            }
            else if (project.children.item(0).textContent == 'THIS WEEK') {
                project.onclick = function switchProject(e) {
                    head.innerHTML = ""; // Reset head
                    resetActive();
                    e.target.classList.add("active");

                    head.textContent = "This Week";
                    head.style.color = 'black';

                    clearTodos();
                    Storage.getProjectList().updateThisWeek();
                    displayTodos('THIS WEEK');
                };
            }
            else if (project.children.item(0).textContent == 'DONE') {
                project.onclick = function switchProject(e) {
                    head.innerHTML = ""; // Reset head
                    resetActive();
                    e.target.classList.add("active");

                    head.textContent = "Done";
                    head.style.color = 'black';

                    clearTodos();
                    Storage.getProjectList().updateDone();
                    displayTodos('DONE');
                };
            }
            else {
                project.onclick = function switchProject(e) {
                    setActiveAndOpenProject(project.children.item(1).textContent.toUpperCase());
                };
            }
        })
    }

    // Helper function to set active and open projectName  
    function setActiveAndOpenProject(projectName) {
        const head = document.querySelector('.main-head');
        const projectDivs = document.querySelectorAll('.project.new');

        head.innerHTML = ""; // Reset head

        // Reset Active and set projectName's project to be active
        resetActive();
        projectDivs.forEach((project) => {
            if (project.children.item(1).textContent == projectName.toUpperCase()) {
                project.classList.add("active");
            }
        })

        const intro = document.createElement('div');
        intro.innerHTML = "Project&nbsp";
        intro.style['font-style'] = "italic";
        intro.style['font-weight'] = "100";

        const sharp = document.createElement('span');
        sharp.innerHTML = "#&nbsp";

        const title = document.createElement('div');
        title.classList.add("head-title");


        sharp.style.color = `#${Storage.getProjectList().getProject(projectName.toUpperCase()).getColor()}`;
        title.style.color = `#${Storage.getProjectList().getProject(projectName.toUpperCase()).getColor()}`;

        title.textContent = projectName.toUpperCase();

        // New Todo Button Config
        const newTodoButton = document.createElement('button');
        newTodoButton.id = "new-todo";
        newTodoButton.textContent = `+ Add Todo`;

        newTodoButton.onclick = () => {
            newTodo(projectName.toUpperCase());
        };

        const edit_delete = document.createElement('div');
        edit_delete.classList.add('edit-delete');
        
            const edit_delete_popup_i = document.createElement('i');
            edit_delete_popup_i.classList.add('edit-delete-popup-icon');

            // Hidden popup for edit-delete buttons
            const edit_delete_menu = document.createElement('div');
            edit_delete_menu.classList.add('edit-delete-menu');
            edit_delete_menu.classList.add('hidden');

                const edit_option = document.createElement('div');
                edit_option.classList.add('option');

                    const edit_option_i = document.createElement('i');
                    edit_option_i.classList.add("editProjectIcon");

                    const edit_option_text = document.createElement('div');
                    edit_option_text.classList.add("editText");
                    edit_option_text.textContent = "Edit Project";
                
                    edit_option.appendChild(edit_option_i); edit_option.appendChild(edit_option_text);

                // Edit delete todo configuration
                edit_option.onclick = () => {
                    editProject(projectName.toUpperCase());
                    edit_delete_menu.classList.add('hidden');
                 };

                const delete_option = document.createElement('div');
                delete_option.classList.add('option');

                    const delete_option_i = document.createElement('i');
                    delete_option_i.classList.add("deleteProjectIcon");

                    const delete_option_text = document.createElement('div');
                    delete_option_text.classList.add("deleteText");
                    delete_option_text.textContent = "Delete Project";
                
                    delete_option.appendChild(delete_option_i); 
                    delete_option.appendChild(delete_option_text);

                // Edit delete task configuration
                delete_option.onclick = () => {
                    deleteProject(projectName.toUpperCase());
                    edit_delete_menu.classList.add('hidden');
                };
                
            edit_delete_menu.appendChild(edit_option);
            edit_delete_menu.appendChild(delete_option);
        
        edit_delete.appendChild(edit_delete_popup_i);
        edit_delete.appendChild(edit_delete_menu);

        edit_delete_popup_i.onclick = function openList(e) {
            // Hide all other popups
            const popups = document.querySelectorAll('.edit-delete-menu');
            popups.forEach((menu) => {
                menu.classList.add('hidden');
            })

            // show menu 
            if (edit_delete_menu.classList.contains("hidden")) {
                edit_delete_menu.classList.remove('hidden');
            }
            else {
                edit_delete_menu.classList.add('hidden');
            }

            window.onclick =  function closeList(e) {
                if (!e.target.classList.contains("edit-delete-popup-icon") // not the edit button itself
                && !e.target.classList.contains("option") 
                && !e.target.classList.contains("edit-delete-menu")) {
                    edit_delete_menu.classList.add('hidden');
                }
            };         
        }

        head.appendChild(intro);
        head.appendChild(sharp);
        head.appendChild(title);
        head.appendChild(newTodoButton);
        head.appendChild(edit_delete);


        clearTodos();
        displayTodos(projectName.toUpperCase());
    }

    // Add/Edit/Delete project functions
    function newProject() {;
        const button = document.querySelector("#new-project");
        button.setAttribute('title','Add New Project');

        const dialog = document.querySelector(".new-project-dialog");
        const colors = document.querySelectorAll(".color");

        const form = document.querySelector(".new-project-dialog-container");
        const name = document.querySelector("#project-name");

        const add = document.querySelector("#new-project-submit");
        const cancel = document.querySelector("#new-project-cancel");

        colors.forEach((color) => {
            color.innerHTML = "";
            const inner = document.createElement('div');
            inner.style['background-color'] = `#${color.id}`;
            inner.style['height'] = `30px`;
            inner.style['width'] = `30px`;
            inner.style['border-radius'] = '5px';

            color.appendChild(inner);
        });

        button.onclick = function newProjectPopup(e) {
            form.reset();
            dialog.showModal();

            const title = document.querySelector(".new-project-dialog-title");
            title.innerHTML = "Create New Project";

            // Unselected color
            colors.forEach((color) => {
                color.classList.remove('selected');
                color.style['outline'] = `1px solid rgba(51, 51, 51, 0.2)`;
            })

            // Select default color to first choice
            document.getElementById('f94144').classList.add('selected');
            document.getElementById('f94144').style['outline-color'] = '#f9414450';
            document.getElementById('f94144').style['background-color'] = '#f9414430';
            document.getElementById('f94144').style['box-shadow'] = `#f9414450 0px 5px 15px`;
            


            // Color choose
            colors.forEach((color) => {
                color.onclick = function selectColor(e) {
                    colors.forEach((color) => {
                        color.classList.remove('selected');
                        color.style['outline-color'] = `rgba(51, 51, 51, 0.2)`;
                        color.style['background-color'] = `rgba(51, 51, 51, 0.05)`;
                        color.style['box-shadow'] = `none`;

                    })
                    color.classList.add('selected');
                    color.style['outline-color'] = `#${color.id}50`;
                    color.style['background-color'] = `#${color.id}30`;
                    color.style['box-shadow'] = `#${color.id}50 0px 5px 15px`;
                
                };
            })

            add.onclick = function adding(e) {
                e.preventDefault();
                if (name.value != "" && !Storage.getProjectList().projectExists(name.value)) {

                    // Storage - add new project
                    colors.forEach((color) => {
                        if (color.classList.contains("selected")) {
                            Storage.addProject(new Project(name.value.toUpperCase(), color.id));
                        }
                    })

                    dialog.close();

                    // Refresh projects and todos
                    refreshCurrentProjects();
                    refreshSidebarNumTodos();
                    // Open newly created project and set as active
                    setActiveAndOpenProject(name.value.toUpperCase());

                }
                else {
                    console.log("Invalid name")
                }
            };

            cancel.onclick = function cancelling(e) {
                e.preventDefault();
                dialog.close();
            };
        };
    }

    function editProject(projectName) {
        // Add project - popup
        const dialog = document.querySelector(".new-project-dialog");
        const colors = document.querySelectorAll(".color");

        const form = document.querySelector(".new-project-dialog-container");
        const name = document.querySelector("#project-name");

        const add = document.querySelector("#new-project-submit");
        const cancel = document.querySelector("#new-project-cancel");

        const originalColor = Storage.getProjectList().getProject(projectName).getColor();

        colors.forEach((color) => {
            color.innerHTML = ""; // Empty color div at each iteration
            const inner = document.createElement('div');
            inner.style['background-color'] = `#${color.id}`;
            inner.style['height'] = `30px`;
            inner.style['width'] = `30px`;
            inner.style['border-radius'] = '5px';

            color.appendChild(inner);
        });

        form.reset();
        dialog.showModal();

        const title = document.querySelector(".new-project-dialog-title");
        title.innerHTML = "Edit Project&nbsp";

        const sharp = document.createElement('span');
        sharp.innerHTML = `# ${projectName}`;
        sharp.style['color'] = `#${originalColor}`;
        sharp.style['font-weight'] = '600';
        
        title.appendChild(sharp);

        // Set name value to pre-selected name 
        name.value = projectName;

        // Unselect all colors
        colors.forEach((color) => {
            color.classList.remove('selected');
            color.style['outline'] = `1px solid rgba(51, 51, 51, 0.2)`;
        })
        // Select color value to pre-selected choice
        document.getElementById(originalColor).classList.add('selected');
        document.getElementById(originalColor).style['outline-color'] = `#${originalColor}50`;
        document.getElementById(originalColor).style['background-color'] = `#${originalColor}30`;
        document.getElementById(originalColor).style['box-shadow'] = `#${originalColor}50 0px 5px 15px`;

        // Color choose
        colors.forEach((color) => {
            color.onclick = function selectColor(e) {
                colors.forEach((color) => {
                    color.classList.remove('selected');
                    color.style['outline-color'] = `rgba(51, 51, 51, 0.2)`;
                    color.style['background-color'] = `rgba(51, 51, 51, 0.05)`;
                    color.style['box-shadow'] = `none`;
                })
                color.classList.add('selected');
                color.style['outline-color'] = `#${color.id}`;
                color.style['background-color'] = `#${color.id}30`;
                color.style['box-shadow'] = `#${color.id}50 0px 5px 15px`;
            };
        })

        add.onclick = function adding(e) {
            e.preventDefault();
            if (name.value != "" && (name.value.toUpperCase() == projectName || !Storage.getProjectList().projectExists(name.value.toUpperCase()))) {
                // Storage - add new project
                colors.forEach((color) => {
                    if (color.classList.contains("selected")) {
                        Storage.changeColorProject(projectName, color.id);
                    }
                })

                Storage.renameProject(projectName, name.value.toUpperCase());

                dialog.close();

                // Refresh projects and todos
                refreshCurrentProjects();
                refreshSidebarNumTodos();

                // Open newly created project and set as active
                setActiveAndOpenProject(name.value.toUpperCase());
            }
            else {
                console.log("Invalid name")
            }
        };

        cancel.onclick = function cancelling(e) {
            e.preventDefault();
            dialog.close();
        };
    }

    function deleteProject(projectName) {
        Storage.deleteProject(projectName); 
        
        refreshCurrentProjects(); // Refresh project sidebar + onclick events
        refreshSidebarNumTodos();
        initDisplay(); // initialize display and active to 'All'
    }


    // Add/Edit/Delete Todo functions
    function newTodo(todoProject) {
        // console.log("Add New Todo Running for: " , todoProject);

        const dialog = document.querySelector(".new-todo-dialog");
        const form = document.querySelector(".new-todo-dialog-container");
         
        form.reset();

        const priorities = document.querySelectorAll(".priority-radio");

        // Priority reset to low
        priorities.forEach((priority) => {
            priority.classList.remove('selected');
        });
        document.querySelector("#low").classList.add('selected');

        const title = document.querySelector('.new-todo-dialog-title')
        title.textContent = "Create New Todo";

        // Project - name
        const intro = document.querySelector('.intro');
        intro.style['font-weight'] = "300";
        intro.style['font-style'] = "italic";

        const sharp = document.querySelector('.sharp-name');
        sharp.innerHTML = `#&nbsp${todoProject}`;
        sharp.style.color = `#${Storage.getProjectList().getProject(todoProject).getColor()}`;
        sharp.style['font-weight'] = "600";

        // Set due date and time to current
        const dateinput = document.querySelector("#todo-date");
        const timeinput = document.querySelector("#todo-time");

        let today = new Date();
        let todayLater = new Date(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours() + 1);

        dateinput.value = format(today, "yyyy-MM-dd");
        timeinput.value = format(todayLater, "HH:mm");

        // Priority choose
        priorities.forEach((priority) => {
            priority.addEventListener('click', (e) => {
                priorities.forEach((priority) => {
                    priority.classList.remove('selected');
                })
                priority.classList.add('selected');
            })
        });

        dialog.showModal();

        const titleinput = document.querySelector("#todo-title");
        const descinput = document.querySelector("#todo-desc");

        const add = document.querySelector("#new-todo-submit");
        add.textContent = "Add";
        const cancel = document.querySelector("#new-todo-cancel");

        add.onclick = function adding(e) {
            // console.log("Clicked add");
            e.preventDefault();
            if (titleinput.value != "" && !Storage.getProjectList().getProject(todoProject).todoExists(titleinput.value)) {
                // If unique title - able to add

                // convert date, time inputs into Date object
                let dateString = `${dateinput.value}T${timeinput.value}`;

                // Find current selected priority
                let priorityinput = "low";
                priorities.forEach((priority) => {
                    if (priority.classList.contains('selected')) {
                        priorityinput = priority.id;
                    }
                })

                // Add to storage
                Storage.addTodo(todoProject, new Todo(titleinput.value, descinput.value, new Date(dateString), priorityinput, todoProject));
                dialog.close();

                // refresh current page's todos
                refreshCurrentTodos();
                refreshSidebarNumTodos();

                setActiveAndOpenProject(todoProject);
            }
            else {
                console.log("Invalid name");
            }
        };

        cancel.onclick = function cancelling(e) {
            e.preventDefault();
            dialog.close();
        };
    }


    // Edit task - popup
    function editTodo(todoTitle, todoProject) {
        // console.log("edit tab opened", todoTitle, todoProject);
        const dialog = document.querySelector(".new-todo-dialog");
        const form = document.querySelector(".new-todo-dialog-container");

        form.reset();

        const priorities = document.querySelectorAll(".priority-radio");

        // Priority automatically set to its pre-set state
        priorities.forEach((priority) => {
            priority.classList.remove('selected');
        });
        document.getElementById(Storage.getProjectList().getProject(todoProject).getTodo(todoTitle).getPriority()).classList.add('selected');

        // Project - name
        const title = document.querySelector('.new-todo-dialog-title')
        title.textContent = "Edit Todo";

        const intro = document.querySelector('.intro');
        intro.style['font-weight'] = "300";
        intro.style['font-style'] = "italic";

        const sharp = document.querySelector('.sharp-name');
        sharp.innerHTML = `#&nbsp${todoProject}`;
        sharp.style.color = `#${Storage.getProjectList().getProject(todoProject).getColor()}`;
        sharp.style['font-weight'] = "600";

        // Set title to current
        const titleinput = document.querySelector("#todo-title");
        titleinput.value = Storage.getProjectList().getProject(todoProject).getTodo(todoTitle).getTitle();

        // Set desc to current
        const descinput = document.querySelector("#todo-desc");
        descinput.value = Storage.getProjectList().getProject(todoProject).getTodo(todoTitle).getDesc();

        // Set due date and time to current
        const dateinput = document.querySelector("#todo-date");
        const timeinput = document.querySelector("#todo-time");

        dateinput.value = format(Storage.getProjectList().getProject(todoProject).getTodo(todoTitle).getDate(), "yyyy-MM-dd");
        timeinput.value = format(Storage.getProjectList().getProject(todoProject).getTodo(todoTitle).getDate(), "HH:mm");

        dialog.showModal();

        // Priority choose
        priorities.forEach((priority) => {
            priority.addEventListener('click', (e) => {
                priorities.forEach((priority) => {
                    priority.classList.remove('selected');
                })
                priority.classList.add('selected');
            })
        });

        // Edit submit/cancel
        const edit = document.querySelector("#new-todo-submit");
        edit.textContent = "Edit";

        const cancel = document.querySelector("#new-todo-cancel");

        edit.onclick = function editing(e) {
            e.preventDefault();
            if (titleinput.value != "" && // If title input is not empty & (either no change or new title doesn't already exist in the project) 
                (todoTitle == titleinput.value || !Storage.getProjectList().getProject(todoProject).todoExists(titleinput.value))) {
                // If unique edited title - able to add
                // convert date, time inputs into Date object
                let dateString = `${dateinput.value}T${timeinput.value}`;

                // Find current selected priority
                let priorityinput;
                priorities.forEach((priority) => {
                    if (priority.classList.contains('selected')) {
                        priorityinput = priority.id;
                    }
                })

                // Edit storage - change name last (as name functions as index)
                Storage.changeDescTodo(todoProject, todoTitle, descinput.value);
                Storage.changeDateTodo(todoProject, todoTitle, new Date(dateString));
                Storage.changePriorityTodo(todoProject, todoTitle, priorityinput);
                Storage.renameTodo(todoProject, todoTitle, titleinput.value);

                dialog.close();

                // refresh current page's todos
                refreshCurrentTodos();
                refreshSidebarNumTodos();
            }
            else {
                console.log("Invalid name / Already exists");
            }
        };

        cancel.onclick = function cancelling(e) {
            e.preventDefault();
            dialog.close();
        };
    };

    function deleteTodo(todoTitle, todoProject) {
        Storage.deleteTodo(todoProject, todoTitle);
         // refresh current page's todos 
        refreshCurrentTodos();
        refreshSidebarNumTodos();
    };

    function viewTodo(todoTitle, todoProject) {
        // console.log("view tab opened", todoTitle, todoProject);
        const dialog = document.querySelector(".view-todo-dialog");
        const container = document.querySelector(".view-todo-dialog-container");

        // Project - name
        const title = document.querySelector('.view-title');
        const span = document.querySelector('.view-title-intro');
        span.style.color = `#${Storage.getProjectList().getProject(todoProject).getColor()}`;
        title.textContent = `${Storage.getProjectList().getProject(todoProject).getTodo(todoTitle).getTitle()}`;

        const title_tags = document.querySelector('.view-title-tags');
        title_tags.innerHTML = ""; //reset

        const date = Storage.getProjectList().getProject(todoProject).getTodo(todoTitle).getDate()
        const done = Storage.getProjectList().getProject(todoProject).getTodo(todoTitle).getDone();

        const currentPriority = Storage.getProjectList().getProject(todoProject).getTodo(todoTitle).getPriority();

        const priorityText = document.createElement('div');
        priorityText.classList.add('priority');
        priorityText.classList.add('view-only');
        priorityText.classList.add(currentPriority.toLowerCase());
        priorityText.textContent = `${currentPriority.charAt(0).toUpperCase() + currentPriority.slice(1)} Priority`;

        // Add project name as tag
        const projectName = document.createElement('div');
        projectName.classList.add("priority");
        projectName.classList.add('view-only');
        projectName.style['color'] = `#FFFFFF`;
        projectName.style['background-color'] = `#${Storage.getProjectList().getProject(todoProject).getColor()}`;

        projectName.textContent = `#${todoProject}`;

        title_tags.appendChild(projectName);
        title_tags.appendChild(priorityText);

        // Set desc to current
        const desc = document.querySelector(".view-desc-text");
        if (Storage.getProjectList().getProject(todoProject).getTodo(todoTitle).getDesc() == "") {
            desc.textContent = `No Description`
        }
        else {
            desc.textContent = `${Storage.getProjectList().getProject(todoProject).getTodo(todoTitle).getDesc()}`;
        }  

        // Set due date and time to current
        const distance = document.querySelector(".view-distance");
        distance.style['color'] = 'black';
        distance.textContent = `Due ${formatDistanceToNow(date, { addSuffix: true })}`;

        const dateText = document.querySelector('.view-date-text');
        dateText.textContent = format(date, "P");

        const timeText = document.querySelector('.view-time-text');
        timeText.textContent = `${format(date, "p")}`;

        // If done - styling
        if (done) {
            distance.textContent = "Todo Completed!";
            container.classList.add('done');
        }
        else {
            container.classList.remove('done');
        }

        // Check for conditions before appending todo into list
        if (isPast(date) && !done) {
            // IF OVERDUE
            container.classList.add('overdue');

            const overdue = document.createElement('div');
            overdue.classList.add("priority");
            overdue.classList.add('view-only');
            overdue.textContent = "! Overdue";
            overdue.style['color'] = `#FFFFFF`;
            overdue.style['background-color'] = `#000000`;

            distance.style['color'] = 'rgba(157, 2, 8)'

            title_tags.appendChild(overdue);
        };

        dialog.showModal();

        // Edit submit/cancel

        const cancel = document.querySelector("#view-cancel");

        cancel.onclick = function cancelling(e) {
            e.preventDefault();
            dialog.close();
        };
    }

    // Toggle task as done - visual check + add to "Done" project
    function toggleDoneTodo(todoTitle, todoProject) {
        if (!Storage.getProjectList().getProject(todoProject).getTodo(todoTitle).getDone()) {
            // Toggle to 'done'
            Storage.changeDoneTodo(todoProject, todoTitle, true);

            refreshCurrentTodos();

            refreshSidebarNumTodos();

        }
        else {
            // Toggle to 'not done'
            Storage.changeDoneTodo(todoProject, todoTitle, false);
            
            refreshCurrentTodos();

            refreshSidebarNumTodos();
        }
    }

    return {
        init,
        sidebarOpenClose,

        refreshCurrentProjects,
        refreshCurrentTodos,

        initDisplay,

        initSidebar,
        refreshSidebarNumTodos,

        displaySidebarProjects,
        createProject,

        displayTodos,
        createTodo,

        clearTodos,
        resetActive,
        clickProjectSidebar,
        setActiveAndOpenProject,

        newProject,
        editProject,
        deleteProject,

        newTodo,
        editTodo,
        deleteTodo,
        viewTodo,

        toggleDoneTodo
    }
})();

export default UI;
import { compareAsc, isWithinInterval, isPast } from "date-fns";
import Todo from "./todo";


export default class Project {
    constructor(name, color) {
        this.name = name;
        this.todos = [];
        this.color = color;
    }

    setName(name) {
        this.name = name;
    }

    getName() {
        return this.name;
    }

    setColor(color) {
        this.color = color;
    } 

    getColor() {
        return this.color;
    }

    getTodos() {
        return this.todos;
    }

    setTodos(todos) {
        this.todos = todos;
    }

    getTodo(todoTitle) {
        return this.todos.find((todo) => todo.title == todoTitle);
    }

    todoExists(todoTitle) {
        return this.todos.some((todo) => todo.title == todoTitle);
    }

    /**
     * 
     * @param {Todo} newTodo - instance of Todo object to be added
     */
    addTodo(newTodo) {
        if (!this.todos.some((todo) => todo.title == newTodo.getTitle())) {
            this.todos.push(newTodo);
        }
    }

    deleteTodo(todoTitle) {
        this.todos = this.todos.filter((todo) => todo.title !== todoTitle);
    }

    getTodayTodos() {
        let today = new Date();
        return this.todos.filter((todo) => 
            isWithinInterval(todo.date, {
                start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours()-24, today.getMinutes()),
                end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours()+24, today.getMinutes())
            })
        );
    }

    getThisWeekTodos() {
        let today = new Date();
        return this.todos.filter((todo) => 
            isWithinInterval(todo.date, {
                start: new Date(today.getFullYear(), today.getMonth(), today.getDate()-7),
                end: new Date(today.getFullYear(), today.getMonth(), today.getDate()+7)
            })
        );
    }

    getOverdueTodos() {
        return this.todos.filter((todo) => isPast(todo.date));
    }

    sortTodos() {
        this.todos.sort((a,b) => compareAsc(a.date, b.date));
    }
}
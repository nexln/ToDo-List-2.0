import React, {useReducer} from 'react';
import './App.css';
import {Todolist} from './Todolist';
import {v1} from 'uuid';
import {AddItemForm} from "./AddItemForm";
import {AppBar, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@material-ui/core";
import {Menu} from "@material-ui/icons";
import Button from "@material-ui/core/Button";
import {
    AddTodoListAC, ChangeTodoListFilterAC,
    ChangeTodolistTitleAC,
    RemoveTodoListAC,
    todoListsReducer
} from "./state/todolists-reducer";
import {AddTaskAC, ChangeTaskStatusAC, ChangeTaskTitleAC, RemoveTaskAC, taskReducer} from "./state/task-reducer";

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

export type FilterValuesType = "all" | "active" | "completed";

export type toDoListType = {
    id: string
    title: string
    filter: FilterValuesType
}

export type TaskStateType = {
    [key: string]: Array<TaskType>
}

export function AppWithReducers() {

    const toDoListID1 = v1();
    const toDoListID2 = v1();

    const [todoLists, dispatchToDoLists] = useReducer(todoListsReducer, [
        {id: toDoListID1, title: "What to learn", filter: 'all'},
        {id: toDoListID2, title: "What no buy", filter: 'all'},
    ]);

    const [tasks, dispatchTasks] = useReducer(taskReducer, {
        [toDoListID1]: [
            {id: v1(), title: "HTML&CSS", isDone: true},
            {id: v1(), title: "JS", isDone: true},
            {id: v1(), title: "ReactJS", isDone: false},
            {id: v1(), title: "Rest API", isDone: false},
            {id: v1(), title: "GraphQL", isDone: false},
        ],
        [toDoListID2]: [
            {id: v1(), title: "Dog", isDone: true},
            {id: v1(), title: "Cat", isDone: true},
            {id: v1(), title: "Horse", isDone: false},
            {id: v1(), title: "Rabbit", isDone: false},
        ]
    });

    function removeTask(id: string, toDoListID: string) {
        const action = RemoveTaskAC(id, toDoListID)
        dispatchTasks(action)
    }

    function addTask(title: string, toDoListID: string) {
        const action = AddTaskAC(title, toDoListID)
        dispatchTasks(action)
    }

    function changeStatus(taskId: string, isDone: boolean, toDoListID: string) {
        const action = ChangeTaskStatusAC(taskId, isDone, toDoListID)
        dispatchTasks(action)
    }

    function changeTitle(taskId: string, title: string, toDoListID: string) {
        const action = ChangeTaskTitleAC(taskId, title, toDoListID)
        dispatchTasks(action)
    }

    const removeToDoList = (toDoListID: string) => {
        const action = RemoveTodoListAC(toDoListID)
        dispatchTasks(action)
        dispatchToDoLists(action)
    };


    function changeFilter(value: FilterValuesType, toDoListID: string) {
        const action = ChangeTodoListFilterAC(toDoListID, value)
        dispatchToDoLists(action)
    }

    function changeToDoListTitle(title: string, toDoListID: string) {
        const action = ChangeTodolistTitleAC(toDoListID, title)
        dispatchToDoLists(action)
    }

    function addToDoList(title: string) {
        const action = AddTodoListAC(title)
        dispatchTasks(action)
        dispatchToDoLists(action)
    }

    return (

        <div className="App">
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        News
                    </Typography>
                    <Button color={"inherit"}>Login</Button>
                </Toolbar>
            </AppBar>
            <Container fixed>
                <Grid container style={{padding: "20px"}}>
                    <AddItemForm addItem={addToDoList}/>
                </Grid>
                <Grid container spacing={3}>
                    {
                        todoLists.map(tl => {
                            let tasksForToDoList = tasks[tl.id];
                            if (tl.filter === "active") {
                                tasksForToDoList = tasks[tl.id].filter(t => !t.isDone);
                            }
                            if (tl.filter === "completed") {
                                tasksForToDoList = tasks[tl.id].filter(t => t.isDone);
                            }
                            return (
                                <Grid item>
                                    <Paper style={{padding: "10px"}}>
                                        <Todolist
                                            key={tl.id}
                                            id={tl.id}
                                            title={tl.title}
                                            tasks={tasksForToDoList}
                                            removeTask={removeTask}
                                            changeFilter={changeFilter}
                                            addTask={addTask}
                                            changeTaskStatus={changeStatus}
                                            filter={tl.filter}
                                            removeToDoList={removeToDoList}
                                            changeTaskTitle={changeTitle}
                                            changeToDoListTitle={changeToDoListTitle}
                                        />
                                    </Paper>
                                </Grid>
                            )
                        })
                    }
                </Grid>
            </Container>
        </div>
    );
}


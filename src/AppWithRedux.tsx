import React, {useCallback} from 'react';
import './App.css';
import {Todolist} from './Todolist';
import {AddItemForm} from "./AddItemForm";
import {AppBar, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@material-ui/core";
import {Menu} from "@material-ui/icons";
import Button from "@material-ui/core/Button";
import {
    AddTodoListAC, ChangeTodoListFilterAC,
    ChangeTodolistTitleAC,
    RemoveTodoListAC,
} from "./state/todolists-reducer";
import {AddTaskAC, ChangeTaskStatusAC, ChangeTaskTitleAC, RemoveTaskAC} from "./state/task-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./state/store";

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

export function AppWithRedux() {
    let todoLists = useSelector<AppRootStateType, Array<toDoListType>>(state => state.todoLists)
    let tasks = useSelector<AppRootStateType, TaskStateType>(state => state.tasks)
    let dispatch = useDispatch()

    const removeTask = useCallback((id: string, toDoListID: string) => {
        const action = RemoveTaskAC(id, toDoListID)
        dispatch(action)
    }, [dispatch])

    const addTask = useCallback((title: string, toDoListID: string) => {
        const action = AddTaskAC(title, toDoListID)
        dispatch(action)
    }, [dispatch])

    const changeStatus = useCallback((taskId: string, isDone: boolean, toDoListID: string) => {
        const action = ChangeTaskStatusAC(taskId, isDone, toDoListID)
        dispatch(action)
    }, [dispatch])

    const changeTitle = useCallback((taskId: string, title: string, toDoListID: string) => {
        const action = ChangeTaskTitleAC(taskId, title, toDoListID)
        dispatch(action)
    }, [dispatch])

    const removeToDoList = useCallback((toDoListID: string) => {
        const action = RemoveTodoListAC(toDoListID)
        dispatch(action)
    }, [dispatch]);


    const changeFilter = useCallback((value: FilterValuesType, toDoListID: string) => {
        const action = ChangeTodoListFilterAC(toDoListID, value)
        dispatch(action)
    }, [dispatch])

    const changeToDoListTitle = useCallback((title: string, toDoListID: string) => {
        const action = ChangeTodolistTitleAC(toDoListID, title)
        dispatch(action)
    }, [dispatch])

    const addToDoList = useCallback((title: string) => {
        const action = AddTodoListAC(title)
        dispatch(action)
    }, [dispatch])

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
                            let allTodolistTasks = tasks[tl.id]
                            return (
                                <Grid item key={tl.id}>
                                    <Paper style={{padding: "10px"}}>
                                        <Todolist
                                            key={tl.id}
                                            id={tl.id}
                                            title={tl.title}
                                            tasks={allTodolistTasks}
                                            removeTask={removeTask}
                                            changeFilter={changeFilter}
                                            _addTask={addTask}
                                            changeTaskStatus={changeStatus}
                                            filter={tl.filter}
                                            removeToDoList={removeToDoList}
                                            changeTaskTitle={changeTitle}
                                            _changeToDoListTitle={changeToDoListTitle}
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


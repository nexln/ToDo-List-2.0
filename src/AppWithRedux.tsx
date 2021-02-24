import React, {useCallback, useEffect} from 'react';
import './App.css';
import {Todolist} from './Todolist';
import {AddItemForm} from "./AddItemForm";
import {AppBar, Container, Grid, IconButton, LinearProgress, Paper, Toolbar, Typography} from "@material-ui/core";
import {Menu} from "@material-ui/icons";
import Button from "@material-ui/core/Button";
import {
  addTodolistTC, ChangeTodoListFilterAC,
  fetchTodolistsTC,
  removeTodolistTC, TodolistsDomainType, updateTodolistTC,
} from "./state/todolists-reducer";
import {
  addTaskTC,
  removeTaskTC, updateTaskTC
} from "./state/task-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./state/store";
import {TaskStatuses, TaskType} from "./api/todoListAPI";
import {RequestStatusType} from "./state/app-reducer";
import {ErrorSnackbar} from "./components/ErrorSnackbar/ErrorSnackbar";


export type FilterValuesType = "all" | "active" | "completed";

export type TaskStateType = {
  [key: string]: Array<TaskType>
}

export function AppWithRedux() {
  let todoLists = useSelector<AppRootStateType, Array<TodolistsDomainType>>(state => state.todoLists)
  let tasks = useSelector<AppRootStateType, TaskStateType>(state => state.tasks)
  let dispatch = useDispatch()
  const status = useSelector<AppRootStateType, RequestStatusType>(state => state.app.status)


  useEffect(() => {
    dispatch(fetchTodolistsTC())
  }, [])

  const removeTask = useCallback((id: string, toDoListID: string) => {
    dispatch(removeTaskTC(id, toDoListID))
  }, [dispatch])

  const addTask = useCallback((title: string, toDoListID: string) => {
    dispatch(addTaskTC(title, toDoListID))
  }, [dispatch])

  const changeStatus = useCallback((taskId: string, status: TaskStatuses, toDoListID: string) => {
    const thunk = updateTaskTC(taskId, {status}, toDoListID)
    dispatch(thunk)
  }, [dispatch])

  const changeTitle = useCallback((taskId: string, title: string, toDoListID: string) => {
    const thunk = updateTaskTC(taskId, {title: title}, toDoListID)
    dispatch(thunk)
  }, [dispatch])

  const removeToDoList = useCallback((toDoListID: string) => {
    const thunk = removeTodolistTC(toDoListID)
    dispatch(thunk)
  }, [dispatch]);


  const changeFilter = useCallback((value: FilterValuesType, toDoListID: string) => {
    const action = ChangeTodoListFilterAC(toDoListID, value)
    dispatch(action)
  }, [dispatch])

  const changeToDoListTitle = useCallback((title: string, toDoListID: string) => {
    const thunk = updateTodolistTC(toDoListID, title)
    dispatch(thunk)
  }, [dispatch])

  const addToDoList = useCallback((title: string) => {
    const thunk = addTodolistTC(title)
    dispatch(thunk)
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
        {status === 'loading' && <LinearProgress color={'secondary'}/>}
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
                      entityStatus={tl.entityStatus}
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
      <ErrorSnackbar/>
    </div>
  );
}


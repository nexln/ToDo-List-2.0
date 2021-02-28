import React, {useCallback, useEffect} from 'react';
import {
  addTodolistTC,
  ChangeTodoListFilterAC,
  fetchTodolistsTC,
  removeTodolistTC,
  TodolistsDomainType, updateTodolistTC
} from "../../state/todolists-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "../../state/store";
import {FilterValuesType, TaskStateType} from "../../AppWithRedux";
import {Grid, Paper} from "@material-ui/core";
import {AddItemForm} from "../../AddItemForm";
import {Todolist} from "../../Todolist";
import {addTaskTC, removeTaskTC, updateTaskTC} from "../../state/task-reducer";
import {TaskStatuses} from "../../api/todoListAPI";
import {Redirect} from "react-router-dom";

export const TodolistsList = React.memo(() => {

  const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn)
  let todoLists = useSelector<AppRootStateType, Array<TodolistsDomainType>>(state => state.todoLists)
  let tasks = useSelector<AppRootStateType, TaskStateType>(state => state.tasks)
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }
    dispatch(fetchTodolistsTC())
  }, [dispatch, isLoggedIn])

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

  if (!isLoggedIn) {
    return <Redirect to={"/login"}/>
  }

  return <>
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
  </>
})

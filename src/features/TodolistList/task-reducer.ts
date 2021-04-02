import {TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType} from "../../api/todoListAPI";
import {Dispatch} from "redux";
import {AppRootStateType} from "../../app/store";
import {RequestStatusType, setAppStatusAC} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AddTodoListAC, setTodoListsAC, RemoveTodoListAC} from "./todolists-reducer";

export type UpdateDomainTaskModelType = {
  title?: string
  description?: string
  status?: TaskStatuses
  priority?: TaskPriorities
  startDate?: string
  deadline?: string
}

let initialState: TaskStateType = {}
export type TaskDomainType = TaskType & {
  entityTaskStatus: RequestStatusType
}
export type TaskStateType = {
  [key: string]: Array<TaskDomainType>
}

const slice = createSlice({
  name: 'task',
  initialState: initialState,
  reducers: {
    RemoveTaskAC: (state, action: PayloadAction<{ taskId: string, toDoListID: string }>) => {
      const tasks = state[action.payload.toDoListID]
      const index = tasks.findIndex(t => t.id === action.payload.taskId)
      if (index > -1) {
        tasks.splice(index, 1)
      }
    },
    addTaskAC: (state, action: PayloadAction<{ task: TaskDomainType }>) => {
      state[action.payload.task.todoListId].unshift(action.payload.task)
    },
    updateTaskAC: (state, action: PayloadAction<{ taskId: string, model: UpdateDomainTaskModelType, todolistId: string }>) => {
      const tasks = state[action.payload.todolistId]
      const index = tasks.findIndex(t => t.id === action.payload.taskId)
      if (index > -1) {
        tasks[index] = {...tasks[index], ...action.payload.model}
      }
    },
    setTasksAC: (state, action: PayloadAction<{ tasks: Array<TaskDomainType>, todolistId: string }>) => {
      state[action.payload.todolistId] = action.payload.tasks
    },
    changeTaskEntityStatusAC: (state, action: PayloadAction<{ taskId: string, todolistId: string, entityTaskStatus: RequestStatusType }>) => {
      const tasks = state[action.payload.todolistId]
      const index = tasks.findIndex(t => t.id === action.payload.taskId)
      if (index > -1) {
        tasks[index].entityTaskStatus = action.payload.entityTaskStatus
      }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(AddTodoListAC, (state, action) => {
      state[action.payload.todolist.id] = []
    })
    builder.addCase(RemoveTodoListAC, (state, action) => {
      delete state[action.payload.todoListID]
    })
    builder.addCase(setTodoListsAC, (state, action) => {
      action.payload.todoLists.forEach((tl) => {
        state[tl.id] = []
      })
    })
  }
})

export const taskReducer = slice.reducer
export const {RemoveTaskAC, addTaskAC, updateTaskAC, setTasksAC, changeTaskEntityStatusAC} = slice.actions

export const fetchTasksTC = (todolistId: string) => {
  return (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    todolistsAPI.getTasks(todolistId)
      .then((res) => {
        dispatch(setAppStatusAC({status: 'succeeded'}))
        const tasks = res.data.items.map(t => ({
          ...t,
          entityTaskStatus: 'idle' as RequestStatusType
        }))
        const action = setTasksAC({tasks: tasks, todolistId: todolistId})
        dispatch(action)
      })
      .catch(error => {
        handleServerNetworkError(error, dispatch)
      })
  }
}
export const removeTaskTC = (taskId: string, todolistId: string) => (dispatch: Dispatch) => {
  dispatch(setAppStatusAC({status: 'loading'}))
  dispatch(changeTaskEntityStatusAC({taskId: taskId, todolistId: todolistId, entityTaskStatus: 'loading'}))
  todolistsAPI.deleteTask(todolistId, taskId)
    .then((res) => {
        if (res.data.resultCode === 0) {
          dispatch(setAppStatusAC({status: 'succeeded'}))
          const action = RemoveTaskAC({taskId: taskId, toDoListID: todolistId})
          dispatch(action)
        } else {
          handleServerAppError(res.data, dispatch)
        }
      }
    )
    .catch(error => {
      handleServerNetworkError(error, dispatch)
    })
}
export const addTaskTC = (title: string, todolistId: string) => (dispatch: Dispatch) => {
  dispatch(setAppStatusAC({status: 'loading'}))
  todolistsAPI.createTask(todolistId, title)
    .then(res => {
      if (res.data.resultCode === 0) {
        const task = {...res.data.data.item, entityTaskStatus: 'idle' as RequestStatusType}
        dispatch(addTaskAC({task: task}))
        dispatch(setAppStatusAC({status: 'succeeded'}))
      } else {
        handleServerAppError(res.data, dispatch)
      }
    })
    .catch(error => {
      handleServerNetworkError(error, dispatch)
    })
}
export const updateTaskTC = (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string) =>
  (dispatch: Dispatch, getState: () => AppRootStateType) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    const state = getState()
    const task = state.tasks[todolistId].find(t => t.id === taskId)
    if (!task) {
      console.warn('task not found in the tests')
      return
    }

    const apiModel: UpdateTaskModelType = {
      deadline: task.deadline,
      description: task.description,
      priority: task.priority,
      startDate: task.startDate,
      title: task.title,
      status: task.status,
      ...domainModel
    }
    todolistsAPI.updateTask(todolistId, taskId, apiModel)
      .then(res => {
        if (res.data.resultCode === 0) {
          dispatch(setAppStatusAC({status: 'succeeded'}))
          const action = updateTaskAC({taskId: taskId, model: domainModel, todolistId: todolistId})
          dispatch(action)
        } else {
          handleServerAppError(res.data, dispatch)
        }
      })
      .catch(error => {
        handleServerNetworkError(error, dispatch)
      })
  }

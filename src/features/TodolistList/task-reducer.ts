import {AddTodolistActionType, RemoveTodolistActionType, SetTodoListsActionType} from "./todolists-reducer";
import {TaskStateType} from "../../app/AppWithRedux";
import {TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType} from "../../api/todoListAPI";
import {Dispatch} from "redux";
import {AppRootStateType} from "../../app/store";
import {setAppStatusAC} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";

export type UpdateDomainTaskModelType = {
  title?: string
  description?: string
  status?: TaskStatuses
  priority?: TaskPriorities
  startDate?: string
  deadline?: string
}

export type RemoveTaskActionType = ReturnType<typeof RemoveTaskAC>
export type AddTaskActionType = ReturnType<typeof addTaskAC>
export type SetTasksActionType = ReturnType<typeof setTasksAC>
export type UpdateTaskActionType = ReturnType<typeof updateTaskAC>

let initialState: TaskStateType = {}

type ActionType =
  RemoveTaskActionType
  | AddTaskActionType
  | RemoveTodolistActionType
  | AddTodolistActionType
  | SetTodoListsActionType
  | SetTasksActionType
  | UpdateTaskActionType

export const taskReducer = (state = initialState, action: ActionType) => {
  switch (action.type) {
    case 'SET-TODOLISTS': {
      const stateCopy = {...state}
      action.todoLists.forEach((tl) => {
        stateCopy[tl.id] = []
      })
      return stateCopy;
    }
    case 'SET-TASKS': {
      const stateCopy = {...state}
      stateCopy[action.todolistId] = action.tasks
      return stateCopy
    }

    case 'REMOVE-TASK': {
      let copyState = {...state}
      copyState[action.toDoListID] = copyState[action.toDoListID].filter(task => task.id !== action.taskId)
      return copyState;
    }
    case 'ADD-TASK': {
      const stateCopy = {...state}
      const tasks = stateCopy[action.task.todoListId];
      const newTasks = [action.task, ...tasks];
      stateCopy[action.task.todoListId] = newTasks;
      return stateCopy;
    }
    case 'UPDATE-TASK':
      return {
        ...state,
        [action.todolistId]: state[action.todolistId]
          .map(t => t.id === action.taskId ? {...t, ...action.model} : t)
      }
    case "REMOVE-TODOLIST": {
      let copyState = {...state}
      delete copyState[action.id]
      return copyState
    }
    case 'ADD-TODOLIST': {
      return {...state, [action.todolist.id]: []}
    }
    default:
      return state
  }
};

export const RemoveTaskAC = (taskId: string, toDoListID: string) =>
  ({type: 'REMOVE-TASK', taskId: taskId, toDoListID: toDoListID} as const)

export const addTaskAC = (task: TaskType) =>
  ({type: 'ADD-TASK', task} as const)

export const updateTaskAC = (taskId: string, model: UpdateDomainTaskModelType, todolistId: string) =>
  ({type: 'UPDATE-TASK', model, todolistId, taskId} as const)
export const setTasksAC = (tasks: Array<TaskType>, todolistId: string) =>
  ({type: 'SET-TASKS', tasks, todolistId} as const)


export const fetchTasksTC = (todolistId: string) => {
  return (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))
    todolistsAPI.getTasks(todolistId)
      .then((res) => {
        dispatch(setAppStatusAC('succeeded'))
        const tasks = res.data.items
        const action = setTasksAC(tasks, todolistId)
        dispatch(action)
      })
      .catch(error => {
        handleServerNetworkError(error, dispatch)
      })
  }
}
export const removeTaskTC = (taskId: string, todolistId: string) => (dispatch: Dispatch) => {
  dispatch(setAppStatusAC('loading'))
  todolistsAPI.deleteTask(todolistId, taskId)
    .then((res) => {
        if (res.data.resultCode === 0) {
          dispatch(setAppStatusAC('succeeded'))
          const action = RemoveTaskAC(taskId, todolistId)
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
  dispatch(setAppStatusAC('loading'))
  todolistsAPI.createTask(todolistId, title)
    .then(res => {
      if (res.data.resultCode === 0) {
        const task = res.data.data.item
        dispatch(addTaskAC(task))
        dispatch(setAppStatusAC('succeeded'))
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
    dispatch(setAppStatusAC('loading'))
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
          dispatch(setAppStatusAC('succeeded'))
          const action = updateTaskAC(taskId, domainModel, todolistId)
          dispatch(action)
        } else {
          handleServerAppError(res.data, dispatch)
        }
      })
      .catch(error => {
        handleServerNetworkError(error, dispatch)
      })
  }

import {FilterValuesType} from "../AppWithRedux";
import {todolistsAPI, TodolistType} from "../api/todoListAPI";
import {Dispatch} from "redux";
import {RequestStatusType, setAppStatusAC, SetAppStatusActionType} from "./app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";

export type RemoveTodolistActionType = ReturnType<typeof RemoveTodoListAC>
export type AddTodolistActionType = ReturnType<typeof AddTodoListAC>;
export type ChangeTodoListEntityStatusActionType = ReturnType<typeof changeTodoListEntityStatusAC>;
export type ChangeTodolistTitleActionType = ReturnType<typeof ChangeTodolistTitleAC>
export type ChangeTodolistFilterActionType = ReturnType<typeof ChangeTodoListFilterAC>
export type SetTodoListsActionType =ReturnType<typeof setTodoListsAC>


let initialState: Array<TodolistsDomainType> = []

export type TodolistsDomainType = TodolistType & {
  filter: FilterValuesType
  entityStatus: RequestStatusType
}

type ActionType =
  RemoveTodolistActionType
  | AddTodolistActionType
  | ChangeTodolistTitleActionType
  | ChangeTodolistFilterActionType
  | SetTodoListsActionType
  | SetAppStatusActionType
  | ChangeTodoListEntityStatusActionType

export const todoListsReducer = (state: Array<TodolistsDomainType> = initialState, action: ActionType): Array<TodolistsDomainType> => {
  switch (action.type) {
    case 'SET-TODOLISTS': {
      return action.todoLists.map(tl => ({
        ...tl,
        filter: 'all',
        entityStatus: 'idle'
      }))
    }

    case 'REMOVE-TODOLIST':
      return state.filter(tl => tl.id !== action.id);
    case 'ADD-TODOLIST':
      return [{...action.todolist, filter: 'all', entityStatus: "idle"}, ...state]
    case "CHANGE-TL-ENTITY-STATUS":
      return state.map(tl => tl.id === action.id ? {...tl, entityStatus: action.entityStatus} : tl)
    case 'CHANGE-TODOLIST-TITLE': {
      const todoList = state.find(tl => tl.id === action.id);
      if (todoList) {
        todoList.title = action.title;
        return ([...state]);
      }
      return state;
    }
    case 'CHANGE-TODOLIST-FILTER': {
      const todoList = state.find(tl => tl.id === action.id);
      if (todoList) {
        todoList.filter = action.filter;
        return [...state];
      }
      return state;
    }
    default:
      return state
  }
};

export const RemoveTodoListAC = (todoListID: string) => (
  ({type: 'REMOVE-TODOLIST', id: todoListID} as const)
);
export const AddTodoListAC = (todolist: TodolistType) => ({type: 'ADD-TODOLIST', todolist} as const)

export const ChangeTodolistTitleAC = (todoListID: string, value: string) => (
  ({type: "CHANGE-TODOLIST-TITLE", id: todoListID, title: value} as const)
)
export const ChangeTodoListFilterAC = (todoListID: string, filter: FilterValuesType) => (
  ({type: "CHANGE-TODOLIST-FILTER", id: todoListID, filter} as const)
)
export const setTodoListsAC = (todoLists: Array<TodolistType>) => (
  ({type: 'SET-TODOLISTS', todoLists} as const)
)
export const changeTodoListEntityStatusAC = (id: string, entityStatus: RequestStatusType) => ({
  type: 'CHANGE-TL-ENTITY-STATUS',
  id,
  entityStatus
} as const)

export const fetchTodolistsTC = () => {
  return (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))
    todolistsAPI.getTodolists()
      .then((res) => {
        dispatch(setAppStatusAC('succeeded'))
        dispatch(setTodoListsAC(res.data))
      })
      .catch(error => {
        handleServerNetworkError(error, dispatch)
      })
  }
}
export const addTodolistTC = (title: string) => (dispatch: Dispatch) => {
  dispatch(setAppStatusAC('loading'))
  todolistsAPI.createTodolist(title)
    .then((res) => {
      if (res.data.resultCode === 0) {
        dispatch(setAppStatusAC('succeeded'))
        const task = res.data.data.item
        const action = AddTodoListAC(task)
        dispatch(action)
      } else {
        handleServerAppError(res.data, dispatch)
      }
    })
    .catch(error => {
      handleServerNetworkError(error, dispatch)
    })
}
export const removeTodolistTC = (todoListID: string) => (dispatch: Dispatch) => {
  dispatch(setAppStatusAC('loading'))
  dispatch(changeTodoListEntityStatusAC(todoListID, 'loading'))
  todolistsAPI.deleteTodolist(todoListID)
    .then((res) => {
      if (res.data.resultCode === 0) {
        dispatch(setAppStatusAC('succeeded'))
        const action = RemoveTodoListAC(todoListID)
        dispatch(action)
      } else {
        handleServerAppError(res.data, dispatch)
      }
    })
    .catch(error => {
      handleServerNetworkError(error, dispatch)
    })
}
export const updateTodolistTC = (todoListID: string, value: string) => (dispatch: Dispatch) => {
  dispatch(setAppStatusAC('loading'))
  todolistsAPI.updateTodolist(todoListID, value)
    .then((res) => {
      if (res.data.resultCode === 0) {
        dispatch(setAppStatusAC('succeeded'))
        const action = ChangeTodolistTitleAC(todoListID, value)
        dispatch(action)
      } else {
        handleServerAppError(res.data, dispatch)
      }
    })
    .catch(error => {
      handleServerNetworkError(error, dispatch)
    })
}
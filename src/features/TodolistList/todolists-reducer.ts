import {FilterValuesType} from "../../app/AppWithRedux";
import {todolistsAPI, TodolistType} from "../../api/todoListAPI";
import {Dispatch} from "redux";
import {RequestStatusType, setAppStatusAC} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

let initialState: Array<TodolistsDomainType> = []

const slice = createSlice({
  name: 'todolist',
  initialState: initialState,
  reducers: {
    RemoveTodoListAC: (state, action: PayloadAction<{ todoListID: string }>) => {
      const index = state.findIndex(tl => tl.id === action.payload.todoListID)
      if (index > -1) {
        state.splice(index, 1)
      }
    },
    AddTodoListAC: (state, action: PayloadAction<{ todolist: TodolistType }>) => {
      state.push({...action.payload.todolist, filter: 'all', entityStatus: "idle"})
    },
    ChangeTodolistTitleAC: (state, action: PayloadAction<{ todoListID: string, value: string }>) => {
      const index = state.findIndex(tl => tl.id === action.payload.todoListID)
      state[index].title = action.payload.value
    },
    ChangeTodoListFilterAC: (state, action: PayloadAction<{ todoListID: string, filter: FilterValuesType }>) => {
      const index = state.findIndex(tl => tl.id === action.payload.todoListID)
      state[index].filter = action.payload.filter
    },
    setTodoListsAC: (state, action: PayloadAction<{ todoLists: Array<TodolistType> }>) => {
      return action.payload.todoLists.map(tl => ({
        ...tl,
        filter: 'all',
        entityStatus: 'idle'
      }))
    },
    changeTodoListEntityStatusAC: (state, action: PayloadAction<{ id: string, entityStatus: RequestStatusType }>) => {
      const index = state.findIndex(tl => tl.id === action.payload.id)
      state[index].entityStatus = action.payload.entityStatus
    },

  }
})

export type TodolistsDomainType = TodolistType & {
  filter: FilterValuesType
  entityStatus: RequestStatusType
}

export const todoListsReducer = slice.reducer
export const {
  RemoveTodoListAC,
  AddTodoListAC,
  ChangeTodolistTitleAC,
  ChangeTodoListFilterAC,
  setTodoListsAC,
  changeTodoListEntityStatusAC
} = slice.actions


export const fetchTodolistsTC = () => {
  return (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    todolistsAPI.getTodolists()
      .then((res) => {
        dispatch(setAppStatusAC({status: 'succeeded'}))
        dispatch(setTodoListsAC({todoLists: res.data}))
      })
      .catch(error => {
        handleServerNetworkError(error, dispatch)
      })
  }
}
export const addTodolistTC = (title: string) => (dispatch: Dispatch) => {
  dispatch(setAppStatusAC({status: 'loading'}))
  todolistsAPI.createTodolist(title)
    .then((res) => {
      if (res.data.resultCode === 0) {
        dispatch(setAppStatusAC({status: 'succeeded'}))
        const task = res.data.data.item
        const action = AddTodoListAC({todolist: task})
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
  dispatch(setAppStatusAC({status: 'loading'}))
  dispatch(changeTodoListEntityStatusAC({id: todoListID, entityStatus: 'loading'}))
  todolistsAPI.deleteTodolist(todoListID)
    .then((res) => {
      if (res.data.resultCode === 0) {
        dispatch(setAppStatusAC({status: 'succeeded'}))
        const action = RemoveTodoListAC({todoListID: todoListID})
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
  dispatch(setAppStatusAC({status: 'loading'}))
  todolistsAPI.updateTodolist(todoListID, value)
    .then((res) => {
      if (res.data.resultCode === 0) {
        dispatch(setAppStatusAC({status: 'succeeded'}))
        const action = ChangeTodolistTitleAC({todoListID: todoListID, value: value})
        dispatch(action)
      } else {
        handleServerAppError(res.data, dispatch)
      }
    })
    .catch(error => {
      handleServerNetworkError(error, dispatch)
    })
}
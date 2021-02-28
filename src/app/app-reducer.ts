import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {setIsLoggedInAC} from "../features/Login/auth-reducer";
import {authAPI} from "../api/authAPI";
import {Dispatch} from "redux";

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>
export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>
export type setIsInitializedType = ReturnType<typeof setIsInitializedAC>


type ActionsType = SetAppStatusActionType | SetAppErrorActionType | setIsInitializedType

const initialState = {
  status: 'idle' as RequestStatusType,
  error: null as null | string,
  isInitialized: false as boolean
}

type InitialStateType = typeof initialState

export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
  switch (action.type) {
    case 'APP/SET-STATUS':
      return {...state, status: action.status}
    case "APP/SET-ERROR":
      return {...state, error: action.error}
    case 'APP/INIT':
      return {...state, isInitialized: action.isInitialized}
    default:
      return state
  }
}

export const setAppStatusAC = (status: RequestStatusType) => ({type: 'APP/SET-STATUS', status} as const)
export const setAppErrorAC = (error: string | null) => ({type: 'APP/SET-ERROR', error} as const)
export const setIsInitializedAC = (isInitialized: boolean) => ({type: 'APP/INIT', isInitialized} as const)

export const initializeAppTC = () => (dispatch: Dispatch) => {
  authAPI.me()
    .then(res => {
      if (res.data.resultCode === 0) {
        dispatch(setIsLoggedInAC(true))
        dispatch(setAppStatusAC('succeeded'))
      } else {
        handleServerAppError(res.data, dispatch);
      }
    })
    .catch((error) => {
      handleServerNetworkError(error, dispatch)
    })
    .finally(() => {
      dispatch(setIsInitializedAC(true))
    })
}

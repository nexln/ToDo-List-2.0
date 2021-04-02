import {todoListsReducer} from '../features/TodolistList/todolists-reducer';
import {combineReducers} from 'redux';
import {taskReducer} from "../features/TodolistList/task-reducer";
import thunk from "redux-thunk";
import {appReducer} from "./app-reducer";
import {authReducer} from "../features/Login/auth-reducer";
import {configureStore} from "@reduxjs/toolkit";

const rootReducer = combineReducers({
    tasks: taskReducer,
    todoLists: todoListsReducer,
    app: appReducer,
    auth: authReducer
})
export const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(thunk)
})
export type AppRootStateType = ReturnType<typeof rootReducer>

// @ts-ignore
window.store = store;

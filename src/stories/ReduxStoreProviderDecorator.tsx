import {Provider} from "react-redux";
import {AppRootStateType} from "../app/store";
import React from "react";
import {combineReducers, createStore} from "redux";
import {v1} from "uuid";
import {taskReducer} from "../features/TodolistList/task-reducer";
import {todoListsReducer} from "../features/TodolistList/todolists-reducer";
import {TaskPriorities} from "../api/todoListAPI";
import {appReducer} from "../app/app-reducer";
import {authReducer} from "../features/Login/auth-reducer";

const rootReducer = combineReducers({
    tasks: taskReducer,
    todoLists: todoListsReducer,
    app: appReducer,
    auth: authReducer
})

const initialGlobalState: AppRootStateType = {
    todoLists: [
        {id: "todolistId1", title: "What to learn", filter: "all", addedDate: '', order: 1, entityStatus: 'idle'},
        {id: "todolistId2", title: "What to buy", filter: "all", addedDate: '', order: 1, entityStatus: 'idle'}
    ] ,
    tasks: {
        ["todolistId1"]: [
            {id: v1(), title: "HTML&CSS", isDone: true, addedDate: '', description: '', deadline: '', order: 1, priority: TaskPriorities.Low, startDate: '', status: 1, todoListId: ''},
            {id: v1(), title: "JS", isDone: true, addedDate: '', description: '', deadline: '', order: 1, priority: TaskPriorities.Low, startDate: '', status: 1, todoListId: ''}
        ],
        ["todolistId2"]: [
            {id: v1(), title: "Milk", isDone: true, addedDate: '', description: '', deadline: '', order: 1, priority: TaskPriorities.Low, startDate: '', status: 1, todoListId: ''},
            {id: v1(), title: "React Book", isDone: true, addedDate: '', description: '', deadline: '', order: 1, priority: TaskPriorities.Low, startDate: '', status: 1, todoListId: ''}
        ]
    },
    app: {
        status: "idle",
        error: null,
        isInitialized: false
    },
    auth: {
        isLoggedIn: false
    }
};

export const storyBookStore = createStore(rootReducer, initialGlobalState as AppRootStateType);

export const ReduxStoreProviderDecorator = (storyFn: any) => (
    <Provider
        store={storyBookStore}>{storyFn()}
    </Provider>)

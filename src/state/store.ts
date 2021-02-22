import {todoListsReducer} from './todolists-reducer';
import {applyMiddleware, combineReducers, createStore} from 'redux';
import {taskReducer} from "./task-reducer";
import thunk from "redux-thunk";
import {appReducer} from "./app-reducer";

const rootReducer = combineReducers({
    tasks: taskReducer,
    todoLists: todoListsReducer,
    app: appReducer
})
export const store = createStore(rootReducer, applyMiddleware(thunk));
export type AppRootStateType = ReturnType<typeof rootReducer>

// @ts-ignore
window.store = store;

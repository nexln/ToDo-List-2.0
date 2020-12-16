import {todoListsReducer} from './todolists-reducer';
import {combineReducers, createStore} from 'redux';
import {taskReducer} from "./task-reducer";

const rootReducer = combineReducers({
    tasks: taskReducer,
    todoLists: todoListsReducer
})
export const store = createStore(rootReducer);
export type AppRootStateType = ReturnType<typeof rootReducer>

// @ts-ignore
window.store = store;

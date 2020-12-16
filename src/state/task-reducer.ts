import {TaskStateType} from "../App";
import {v1} from "uuid";
import {AddTodolistActionType, RemoveTodolistActionType} from "./todolists-reducer";


export type RemoveTaskActionType = {
    type: "REMOVE-TASK",
    taskId: string,
    toDoListID: string
}
export type AddTaskActionType = {
    type: "ADD-TASK",
    title: string,
    toDoListID: string
}
export type ChangeTaskStatusActionType = {
    type: 'CHANGE-TASK-STATUS',
    isDone: boolean,
    toDoListID: string,
    taskId: string
}
export type ChangeTaskTitleActionType = {
    type: 'CHANGE-TASK-TITLE',
    title: string
    toDoListID: string,
    taskId: string
}

let initialState: TaskStateType = {}

type ActionType =
    RemoveTaskActionType
    | AddTaskActionType
    | ChangeTaskStatusActionType
    | ChangeTaskTitleActionType
    | RemoveTodolistActionType
    | AddTodolistActionType

export const taskReducer = (state = initialState, action: ActionType) => {
    switch (action.type) {
        case 'REMOVE-TASK': {
            let copyState = {...state}
            copyState[action.toDoListID] = copyState[action.toDoListID].filter(task => task.id !== action.taskId)
            return copyState;
        }
        case 'ADD-TASK': {
            let task = {
                id: v1(), title: action.title, isDone: false
            }
            let copyState = {...state}
            copyState[action.toDoListID] = [task, ...copyState[action.toDoListID]]
            return copyState
        }
        case "CHANGE-TASK-STATUS": {
            return {
                ...state, [action.toDoListID]: state[action.toDoListID].map(task => {
                    return (task.id !== action.taskId) ? task : {...task, isDone: action.isDone}
                })
            }
        }
        case "CHANGE-TASK-TITLE": {
            return {
                ...state, [action.toDoListID]: state[action.toDoListID].map(task => {
                    return (task.id !== action.taskId) ? task : {...task, title: action.title}
                })
            }
        }
        case "REMOVE-TODOLIST": {
            let copyState = {...state}
            delete copyState[action.id]
            return copyState
        }
        case 'ADD-TODOLIST': {
            return {...state, [action.toDoListID]: []}
        }

        default:
            return state
    }
};

export const RemoveTaskAC = (taskId: string, toDoListID: string): RemoveTaskActionType => {
    return {type: 'REMOVE-TASK', taskId: taskId, toDoListID: toDoListID}
};
export const AddTaskAC = (title: string, toDoListID: string): AddTaskActionType => {
    return {type: 'ADD-TASK', title, toDoListID}
};
export const ChangeTaskStatusAC = (taskId: string, isDone: boolean, toDoListID: string): ChangeTaskStatusActionType => {
    return {type: 'CHANGE-TASK-STATUS', isDone, toDoListID, taskId}
}
export const ChangeTaskTitleAC = (taskId: string, title: string, toDoListID: string): ChangeTaskTitleActionType => {
    return {type: 'CHANGE-TASK-TITLE', title, toDoListID, taskId}
}
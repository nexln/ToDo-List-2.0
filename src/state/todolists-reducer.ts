import {FilterValuesType, toDoListType} from "../App";
import {v1} from "uuid";

export type RemoveTodolistActionType = {
    type: "REMOVE-TODOLIST",
    id: string
}
export type AddTodolistActionType = {
    toDoListID: string;
    type: "ADD-TODOLIST",
    title: string,
}
export type ChangeTodolistTitleActionType = {
    type: "CHANGE-TODOLIST-TITLE",
    title: string
    id: string
}
export type ChangeTodolistFilterActionType = {
    type: "CHANGE-TODOLIST-FILTER",
    filter: FilterValuesType
    id: string
}

type ActionType = RemoveTodolistActionType | AddTodolistActionType | ChangeTodolistTitleActionType | ChangeTodolistFilterActionType

export const todoListsReducer = (state: Array<toDoListType>, action: ActionType) => {
    switch (action.type) {
        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id !== action.id);
        case 'ADD-TODOLIST':
            const newToDoList: toDoListType = {
                id: action.toDoListID,
                title: action.title,
                filter: "all"
            };
            return [...state, newToDoList];
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
            throw new Error("I don't understand this type")
    }
};

export const RemoveTodoListAC = (todoListID: string): RemoveTodolistActionType => (
    {type: 'REMOVE-TODOLIST', id: todoListID}
);

export const AddTodoListAC = (newTitle: string): AddTodolistActionType => (
    {type: 'ADD-TODOLIST', title: newTitle, toDoListID: v1()}
);
import {taskReducer} from "./task-reducer";
import {todoListsReducer, AddTodoListAC} from "./todolists-reducer";
import {TaskStateType, toDoListType} from "../AppWithRedux";

test('ids should be equals', () => {
    const startTasksState: TaskStateType = {};
    const startTodolistsState: Array<toDoListType> = [];

    let action = AddTodoListAC("new todolist");

    const endTasksState = taskReducer(startTasksState, action)
    const endTodolistsState = todoListsReducer(startTodolistsState, action)

    const keys = Object.keys(endTasksState);
    const idFromTasks = keys[0];
    const idFromTodolists = endTodolistsState[0].id;

    expect(idFromTasks).toBe(action.toDoListID);
    expect(idFromTodolists).toBe(action.toDoListID);
});

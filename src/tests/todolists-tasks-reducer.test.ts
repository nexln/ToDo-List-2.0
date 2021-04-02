import {taskReducer, TaskStateType} from "../features/TodolistList/task-reducer";
import {todoListsReducer, AddTodoListAC, TodolistsDomainType} from "../features/TodolistList/todolists-reducer";

test('ids should be equals', () => {
    const startTasksState: TaskStateType = {};
    const startTodolistsState: Array<TodolistsDomainType> = [];
    const newTl: TodolistsDomainType = {id: 'todolistId3', title: "Thunk", filter: "all", order: 1, addedDate: '', entityStatus: 'idle'}

    let action = AddTodoListAC({todolist: newTl});

    const endTasksState = taskReducer(startTasksState, action)
    const endTodolistsState = todoListsReducer(startTodolistsState, action)

    const keys = Object.keys(endTasksState);
    const idFromTasks = keys[0];
    const idFromTodolists = endTodolistsState[0].id;

    expect(idFromTasks).toBe(action.payload.todolist.id);
    expect(idFromTodolists).toBe(action.payload.todolist.id);
});

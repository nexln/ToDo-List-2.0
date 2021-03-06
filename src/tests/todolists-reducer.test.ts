import {
    AddTodoListAC,
    changeTodoListEntityStatusAC, ChangeTodoListFilterAC,
    ChangeTodolistTitleAC,
    RemoveTodoListAC, setTodoListsAC, TodolistsDomainType,
    todoListsReducer
} from '../features/TodolistList/todolists-reducer';
import {v1} from 'uuid';
import {FilterValuesType} from "../app/AppWithRedux";

let todolistId1: string;
let todolistId2: string;
let startState: Array<TodolistsDomainType> = [];

beforeEach(() => {
    todolistId1 = v1();
    todolistId2 = v1();
    startState = [
        {id: todolistId1, title: "What to learn", filter: "all", order: 1, addedDate: '', entityStatus: 'idle'},
        {id: todolistId2, title: "What to buy", filter: "all", order: 2, addedDate: '', entityStatus: 'idle'}
    ];
})


test('correct todolist should be removed', () => {

    const endState = todoListsReducer(startState, RemoveTodoListAC({todoListID: todolistId1}));

    expect(endState.length).toBe(1);
    expect(endState[0].id).toBe(todolistId2);
});

test('correct todolist should be added', () => {

    const newTl: TodolistsDomainType = {id: 'todolistId3', title: "Thunk", filter: "all", order: 1, addedDate: '', entityStatus: 'idle'}
    const endState = todoListsReducer(startState, AddTodoListAC({todolist: newTl}));

    expect(endState.length).toBe(3);
    expect(endState[0].title).toBe("Thunk");
});

test('correct todolist should change its name', () => {

    let newTodolistTitle = "New Todolist";

    const endState = todoListsReducer(startState, ChangeTodolistTitleAC({todoListID: todolistId2, value: newTodolistTitle}));

    expect(endState[0].title).toBe("What to learn");
    expect(endState[1].title).toBe(newTodolistTitle);
});

test('correct filter of todolist should be changed', () => {

    let newFilterValue: FilterValuesType = "completed";

    const endState = todoListsReducer(startState, ChangeTodoListFilterAC({todoListID: todolistId2, filter: newFilterValue}));

    expect(endState[0].filter).toBe("all");
    expect(endState[1].filter).toBe(newFilterValue);
});
test('todolist should be set to the tests', () => {


    const endState = todoListsReducer([], setTodoListsAC({todoLists: startState}));

    expect(endState.length).toBe(2);
});

test('changeTodoListEntityStatus', () => {
    const endState = todoListsReducer(startState, changeTodoListEntityStatusAC({id: todolistId1, entityStatus: 'loading'}))

    expect(endState[0].entityStatus).toBe('loading')
})
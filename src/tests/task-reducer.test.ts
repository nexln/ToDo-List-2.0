import {
  addTaskAC,
  RemoveTaskAC,
  setTasksAC, TaskDomainType,
  taskReducer,
  TaskStateType,
  updateTaskAC
} from '../features/TodolistList/task-reducer';
import {
  AddTodoListAC,
  RemoveTodoListAC,
  TodolistsDomainType,
} from "../features/TodolistList/todolists-reducer";
import {TaskPriorities} from "../api/todoListAPI";

let startState: TaskStateType = {}

beforeEach(() => {
  startState = {
    "todolistId1": [
      {
        id: "1",
        title: "CSS",
        isDone: false,
        addedDate: '',
        description: '',
        deadline: '',
        order: 1,
        priority: TaskPriorities.Low,
        startDate: '',
        status: 1,
        todoListId: '',
        entityTaskStatus: 'idle'
      },
      {
        id: "2",
        title: "JS",
        isDone: true,
        addedDate: '',
        description: '',
        deadline: '',
        order: 1,
        priority: TaskPriorities.Low,
        startDate: '',
        status: 1,
        todoListId: '',
        entityTaskStatus: 'idle'
      },
      {
        id: "3",
        title: "React",
        isDone: false,
        addedDate: '',
        description: '',
        deadline: '',
        order: 1,
        priority: TaskPriorities.Low,
        startDate: '',
        status: 1,
        todoListId: '',
        entityTaskStatus: 'idle'
      }
    ],
    "todolistId2": [
      {
        id: "1",
        title: "bread",
        isDone: false,
        addedDate: '',
        description: '',
        deadline: '',
        order: 1,
        priority: TaskPriorities.Low,
        startDate: '',
        status: 1,
        todoListId: '',
        entityTaskStatus: 'idle'
      },
      {
        id: "2",
        title: "milk",
        isDone: true,
        addedDate: '',
        description: '',
        deadline: '',
        order: 1,
        priority: TaskPriorities.Low,
        startDate: '',
        status: 1,
        todoListId: '',
        entityTaskStatus: 'idle'
      },
      {
        id: "3",
        title: "tea",
        isDone: false,
        addedDate: '',
        description: '',
        deadline: '',
        order: 1,
        priority: TaskPriorities.Low,
        startDate: '',
        status: 1,
        todoListId: '',
        entityTaskStatus: 'idle'
      }
    ]
  };
})

test('correct task should be deleted from correct array', () => {

  const action = RemoveTaskAC({taskId: "2", toDoListID: "todolistId2"});
  const endState = taskReducer(startState, action)

  expect(endState).toEqual({
    "todolistId1": [
      {
        id: "1",
        title: "CSS",
        isDone: false,
        addedDate: '',
        description: '',
        deadline: '',
        order: 1,
        priority: TaskPriorities.Low,
        startDate: '',
        status: 1,
        todoListId: ''
      },
      {
        id: "2",
        title: "JS",
        isDone: true,
        addedDate: '',
        description: '',
        deadline: '',
        order: 1,
        priority: TaskPriorities.Low,
        startDate: '',
        status: 1,
        todoListId: ''
      },
      {
        id: "3",
        title: "React",
        isDone: false,
        addedDate: '',
        description: '',
        deadline: '',
        order: 1,
        priority: TaskPriorities.Low,
        startDate: '',
        status: 1,
        todoListId: ''
      }
    ],
    "todolistId2": [
      {
        id: "1",
        title: "bread",
        isDone: false,
        addedDate: '',
        description: '',
        deadline: '',
        order: 1,
        priority: TaskPriorities.Low,
        startDate: '',
        status: 1,
        todoListId: ''
      },
      {
        id: "3",
        title: "tea",
        isDone: false,
        addedDate: '',
        description: '',
        deadline: '',
        order: 1,
        priority: TaskPriorities.Low,
        startDate: '',
        status: 1,
        todoListId: ''
      }
    ]
  });
  expect(endState['todolistId2'][2]).toBeUndefined();
});

test('correct task should be added to correct array', () => {

  const newTask: TaskDomainType = {
    id: "4",
    title: "juce",
    isDone: false,
    addedDate: '',
    description: '',
    deadline: '',
    order: 1,
    priority: TaskPriorities.Low,
    startDate: '',
    status: 1,
    todoListId: 'todolistId2',
    entityTaskStatus: 'idle'
  };
  const endState = taskReducer(startState, addTaskAC({task: newTask}))

  expect(endState["todolistId1"].length).toBe(3);
  expect(endState["todolistId2"].length).toBe(4);
  expect(endState["todolistId2"][0].id).toBeDefined();
  expect(endState["todolistId2"][0].title).toBe('juce');
  expect(endState["todolistId2"][0].isDone).toBe(false);
})

test('status of specified task should be changed', () => {

  const action = updateTaskAC({
      taskId: "2",
      model: {
        title: 'string',
        description: '',
        status: 2,
        priority: TaskPriorities.Low,
        startDate: '',
        deadline: '',
      },
      todolistId: "todolistId2"
    })
  ;
  const endState = taskReducer(startState, action)

  expect(endState['todolistId2'][1].status).toBe(2);
  expect(endState['todolistId1'][1].status).toBe(1)
});

test('title of specified task should be changed', () => {

  const action = updateTaskAC({taskId: "2",
    model: {
        title: 'beer',
          description: '',
          status: 2,
          priority: TaskPriorities.Low,
          startDate: '',
          deadline: '',
    },
    todolistId: "todolistId2"
});
  const endState = taskReducer(startState, action)

  expect(endState['todolistId2'][1].title).toBe('beer');
  expect(endState['todolistId1'][1].title).toBe('JS')
});

test('correct todolist should be removed', () => {

  const action = RemoveTodoListAC({todoListID: 'todolistId2'})
  const endState = taskReducer(startState, action)

  expect(Object.keys(endState).length).toBe(1);
});

test('new array should be added when new todolist is added', () => {

  let newTl: TodolistsDomainType = {
    id: 'todolistId3',
    title: "What to learn",
    filter: "all",
    order: 1,
    addedDate: '',
    entityStatus: 'idle'
  }

  const endState = taskReducer(startState, AddTodoListAC({todolist: newTl}))


  const keys = Object.keys(endState);
  const newKey = keys.find(k => k != "todolistId1" && k != "todolistId2");
  if (!newKey) {
    throw Error("new key should be added")
  }

  expect(keys.length).toBe(3);
  expect(endState[newKey]).toEqual([]);
});

test('tasks should be set to the tests', () => {


  const endState = taskReducer({}, setTasksAC({tasks: startState[0], todolistId: 'todolistId1'}));
  const keys = Object.keys(endState);

  expect(keys.length).toBe(1);
  expect(keys[0]).toBe('todolistId1');
});
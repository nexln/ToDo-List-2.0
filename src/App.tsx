import React, {useState} from 'react';
import './App.css';
import {Todolist} from './Todolist';
import {v1} from 'uuid';
import {AddItemForm} from "./AddItemForm";
import {AppBar, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@material-ui/core";
import {Menu} from "@material-ui/icons";
import Button from "@material-ui/core/Button";

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

export type FilterValuesType = "all" | "active" | "completed";

export type toDoListType = {
    id: string
    title: string
    filter: FilterValuesType
}

type TaskStateType = {
    [key: string]: Array<TaskType>
}

function App() {

    const toDoListID1 = v1();
    const toDoListID2 = v1();

    const [todoLists, setToDoLists] = useState<Array<toDoListType>>([
        {id: toDoListID1, title: "What to learn", filter: 'all'},
        {id: toDoListID2, title: "What no buy", filter: 'all'},
    ]);

    const [tasks, setTasks] = useState<TaskStateType>({
        [toDoListID1]: [
            {id: v1(), title: "HTML&CSS", isDone: true},
            {id: v1(), title: "JS", isDone: true},
            {id: v1(), title: "ReactJS", isDone: false},
            {id: v1(), title: "Rest API", isDone: false},
            {id: v1(), title: "GraphQL", isDone: false},
        ],
        [toDoListID2]: [
            {id: v1(), title: "Dog", isDone: true},
            {id: v1(), title: "Cat", isDone: true},
            {id: v1(), title: "Horse", isDone: false},
            {id: v1(), title: "Rabbit", isDone: false},
        ]
    });

    function removeTask(id: string, toDoListID: string) {
        const todoListTask = tasks[toDoListID];
        tasks[toDoListID] = todoListTask.filter(t => t.id !== id);
        setTasks({...tasks});
    }

    function addTask(title: string, toDoListID: string) {
        const todoListTask = tasks[toDoListID];
        let newTask: TaskType = {id: v1(), title: title, isDone: false};
        tasks[toDoListID] = [newTask, ...todoListTask];
        setTasks({...tasks});
    }

    function changeStatus(taskId: string, isDone: boolean, toDoListID: string) {
        const todoListTask = tasks[toDoListID];
        const task: TaskType | undefined = todoListTask.find(t => t.id === taskId);
        if (task) {
            task.isDone = isDone;
        }
        setTasks({...tasks});
    }

    function changeTitle(taskId: string, title: string, toDoListID: string) {
        const todoListTask = tasks[toDoListID];
        const task: TaskType | undefined = todoListTask.find(t => t.id === taskId);
        if (task) {
            task.title = title;
        }
        setTasks({...tasks});
    }

    const removeToDoList = (toDoListID: string) => {
        const filteredToDoList = todoLists.filter(tl => tl.id !== toDoListID);
        setToDoLists(filteredToDoList);
        delete tasks[toDoListID];
        setTasks({...tasks});
    };


    function changeFilter(value: FilterValuesType, toDoListID: string) {
        const todoList = todoLists.find(tl => tl.id === toDoListID);
        if (todoList) {
            todoList.filter = value;
            setToDoLists([...todoLists]);
        }
    }

    function changeToDoListTitle(title: string, toDoListID: string) {
        const todoList = todoLists.find(tl => tl.id === toDoListID);
        if (todoList) {
            todoList.title = title;
            setToDoLists([...todoLists]);
        }
    }

    function addToDoList(title: string) {
        const newToDoListID = v1();
        const newToDoList: toDoListType = {
            id: newToDoListID,
            title: title,
            filter: "all"
        };
        setToDoLists(todoLists => [...todoLists, newToDoList]);
        setTasks(tasks => ({...tasks, [newToDoListID]: []}))
    }

    return (

        <div className="App">
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        News
                    </Typography>
                    <Button color={"inherit"}>Login</Button>
                </Toolbar>
            </AppBar>
            <Container fixed>
                <Grid container style={{padding: "20px"}}>
                    <AddItemForm addItem={addToDoList}/>
                </Grid>
                <Grid container spacing={3}>
                    {
                        todoLists.map(tl => {
                            let tasksForToDoList = tasks[tl.id];
                            if (tl.filter === "active") {
                                tasksForToDoList = tasks[tl.id].filter(t => !t.isDone);
                            }
                            if (tl.filter === "completed") {
                                tasksForToDoList = tasks[tl.id].filter(t => t.isDone);
                            }
                            return (
                                <Grid item>
                                    <Paper style={{padding: "10px"}}>
                                        <Todolist
                                            key={tl.id}
                                            id={tl.id}
                                            title={tl.title}
                                            tasks={tasksForToDoList}
                                            removeTask={removeTask}
                                            changeFilter={changeFilter}
                                            addTask={addTask}
                                            changeTaskStatus={changeStatus}
                                            filter={tl.filter}
                                            removeToDoList={removeToDoList}
                                            changeTaskTitle={changeTitle}
                                            changeToDoListTitle={changeToDoListTitle}
                                        />
                                    </Paper>
                                </Grid>
                            )
                        })
                    }
                </Grid>
            </Container>
        </div>
    );
}

export default App;

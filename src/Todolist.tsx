import React, {ChangeEvent} from 'react';
import {FilterValuesType, TaskType} from './App';
import {AddItemForm} from "./AddItemForm";
import {EditableSpan} from "./EditableSpan";
import {Button, Checkbox, IconButton} from "@material-ui/core";
import {Delete} from "@material-ui/icons";


type PropsType = {
    id: string
    title: string
    tasks: Array<TaskType>
    removeTask: (taskId: string, toDoListID: string) => void
    changeFilter: (value: FilterValuesType, toDoListID: string) => void
    addTask: (title: string, toDoListID: string) => void
    changeTaskStatus: (taskId: string, isDone: boolean, toDoListID: string) => void
    filter: FilterValuesType
    removeToDoList: (toDoListID: string) => void
    changeTaskTitle: (taskId: string, title: string, toDoListID: string) => void
    changeToDoListTitle: (title: string, toDoListID: string) => void
}

export function Todolist(props: PropsType) {


    const addTask = (title: string) => {
        props.addTask(title, props.id)
    };
    const deleteTask = () => {
        props.removeToDoList(props.id)
    };
    const onAllClickHandler = () => props.changeFilter("all", props.id);
    const onActiveClickHandler = () => props.changeFilter("active", props.id);
    const onCompletedClickHandler = () => props.changeFilter("completed", props.id);
    const changeToDoListTitle = (newValue: string) => {
        props.changeToDoListTitle(newValue, props.id)
    };


    return <div>
        <h3>
            <EditableSpan title={props.title} changeValue={changeToDoListTitle}/>
            <IconButton onClick={deleteTask}>
                <Delete/>
            </IconButton>
        </h3>
        <AddItemForm addItem={addTask}/>
        <div>
            {
                props.tasks.map(t => {
                    const onClickHandler = () => props.removeTask(t.id, props.id);
                    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
                        props.changeTaskStatus(t.id, e.currentTarget.checked, props.id);
                    };
                    const changeTaskTitle = (newValue: string) => {
                        props.changeTaskTitle(t.id, newValue, props.id)
                    };
                    return <div key={t.id} className={t.isDone ? "is-done" : ""}>
                        <Checkbox color="primary"
                                  onChange={onChangeHandler}
                                  checked={t.isDone}/>
                        <EditableSpan title={t.title} changeValue={changeTaskTitle}/>
                        <IconButton onClick={onClickHandler}>
                            <Delete/>
                        </IconButton>
                    </div>
                })
            }
        </div>
        <div>
            <Button
                size={'small'}
                variant={props.filter === 'all' ? "contained" : "outlined"}
                color={'default'}
                onClick={onAllClickHandler}>All
            </Button>
            <Button
                size={'small'}
                variant={props.filter === 'active' ? "contained" : "outlined"}
                color={'primary'}
                onClick={onActiveClickHandler}>Active
            </Button>
            <Button
                size={'small'}
                variant={props.filter === 'completed' ? "contained" : "outlined"}
                color={'secondary'}
                onClick={onCompletedClickHandler}>Completed
            </Button>
        </div>
    </div>
}

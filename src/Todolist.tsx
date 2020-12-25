import React, {useCallback} from 'react';
import {AddItemForm} from "./AddItemForm";
import {EditableSpan} from "./EditableSpan";
import {Button, IconButton} from "@material-ui/core";
import {Delete} from "@material-ui/icons";
import {FilterValuesType, TaskType} from "./AppWithRedux";
import {Task} from "./Task";


type PropsType = {
    id: string
    title: string
    tasks: Array<TaskType>
    removeTask: (taskId: string, toDoListID: string) => void
    changeFilter: (value: FilterValuesType, toDoListID: string) => void
    _addTask: (title: string, toDoListID: string) => void
    changeTaskStatus: (taskId: string, isDone: boolean, toDoListID: string) => void
    filter: FilterValuesType
    removeToDoList: (toDoListID: string) => void
    _changeTaskTitle: (taskId: string, title: string, toDoListID: string) => void
    _changeToDoListTitle: (title: string, toDoListID: string) => void
}

export const Todolist: React.FC<PropsType> = React.memo(({
                                                             id,
                                                             title,
                                                             tasks,
                                                             removeTask,
                                                             changeFilter,
                                                             _addTask,
                                                             changeTaskStatus,
                                                             filter,
                                                             removeToDoList,
                                                             _changeTaskTitle,
                                                             _changeToDoListTitle,
                                                         }) => {

    const addTask = useCallback((title: string) => {
        _addTask(title, id)
    }, [_addTask, id])

    const deleteTask = useCallback(() => {
        removeToDoList(id)
    }, [removeToDoList, id]);

    const changeToDoListTitle = useCallback((newValue: string) => {
        _changeToDoListTitle(newValue, id)
    }, [_changeToDoListTitle, id])

    const onAllClickHandler = useCallback(() => changeFilter("all", id), [changeFilter, id]);
    const onActiveClickHandler = useCallback(() => changeFilter("active", id), [changeFilter, id]);
    const onCompletedClickHandler = useCallback(() => changeFilter("completed", id), [changeFilter, id]);


    let tasksForTodoList = tasks
    if (filter === 'active') {
        tasksForTodoList = tasks.filter(t => !t.isDone)
    }
    if (filter === 'completed') {
        tasksForTodoList = tasks.filter(t => t.isDone)
    }


    const onClickHandler = useCallback((taskId: string) => removeTask(taskId, id), [removeTask, id]);
    const onChangeHandler = useCallback((taskId: string, isDone: boolean) => {
        changeTaskStatus(taskId, isDone, id);
    }, [changeTaskStatus, id]);
    const changeTaskTitle = useCallback((taskId: string, title: string) => {
        _changeTaskTitle(taskId, title, id)
    }, [_changeTaskTitle, id]);

    return <div>
        <h3>
            <EditableSpan title={title} changeValue={changeToDoListTitle}/>
            <IconButton onClick={deleteTask}>
                <Delete/>
            </IconButton>
        </h3>
        <AddItemForm addItem={addTask}/>
        <div>
            {
                tasksForTodoList.map(t => {
                    return (
                        <Task
                            key={t.id}
                            task={t}
                            onChangeHandler={onChangeHandler}
                            changeTaskTitle={changeTaskTitle}
                            onClickHandler={onClickHandler}
                        />
                    )
                })
            }
        </div>
        <div>
            <Button
                size={'small'}
                variant={filter === 'all' ? "contained" : "outlined"}
                color={'default'}
                onClick={onAllClickHandler}>All
            </Button>
            <Button
                size={'small'}
                variant={filter === 'active' ? "contained" : "outlined"}
                color={'primary'}
                onClick={onActiveClickHandler}>Active
            </Button>
            <Button
                size={'small'}
                variant={filter === 'completed' ? "contained" : "outlined"}
                color={'secondary'}
                onClick={onCompletedClickHandler}>Completed
            </Button>
        </div>
    </div>
})

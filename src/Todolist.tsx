import React, {useCallback, useEffect} from 'react';
import {AddItemForm} from "./AddItemForm";
import {EditableSpan} from "./EditableSpan";
import {Button, IconButton} from "@material-ui/core";
import {Delete} from "@material-ui/icons";
import {FilterValuesType} from "./AppWithRedux";
import {Task} from "./Task";
import {useDispatch} from "react-redux";
import {fetchTasksTC} from "./state/task-reducer";
import {TaskStatuses, TaskType} from "./api/todoListAPI";
import {RequestStatusType} from "./state/app-reducer";


type PropsType = {
    id: string
    title: string
    tasks: Array<TaskType>
    removeTask: (taskId: string, toDoListID: string) => void
    changeFilter: (value: FilterValuesType, toDoListID: string) => void
    _addTask: (title: string, toDoListID: string) => void
    changeTaskStatus: (taskId: string, status: TaskStatuses, toDoListID: string) => void
    filter: FilterValuesType
    entityStatus: RequestStatusType
    removeToDoList: (toDoListID: string) => void
    changeTaskTitle: (taskId: string, title: string, toDoListID: string) => void
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
                                                             changeTaskTitle,
                                                             _changeToDoListTitle,
  entityStatus
                                                         }) => {
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(fetchTasksTC(id))
    }, [])

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
        tasksForTodoList = tasks.filter(t => t.status === TaskStatuses.New)
    }
    if (filter === 'completed') {
        tasksForTodoList = tasks.filter(t => t.status === TaskStatuses.Completed)
    }


    const onClickHandler = useCallback((taskId: string) => removeTask(taskId, id), [removeTask, id]);
    const onChangeHandler = useCallback((taskId: string, status: TaskStatuses) => {
        changeTaskStatus(taskId, status, id);
    }, [changeTaskStatus, id]);
    const onTitleChangeHandler = useCallback((taskId: string, title: string) => {
        changeTaskTitle(taskId, title, id)
    }, [changeTaskTitle, id]);

    return <div>
        <h3>
            <EditableSpan title={title} changeValue={changeToDoListTitle}/>
            <IconButton onClick={deleteTask} disabled={entityStatus === 'loading'}>
                <Delete/>
            </IconButton>
        </h3>
        <AddItemForm addItem={addTask} entityStatus={entityStatus}/>
        <div>
            {
                tasksForTodoList.map(t => <Task key={t.id} task={t} todolistId={id}
                                                removeTask={removeTask}
                                                changeTaskTitle={changeTaskTitle}
                                                changeTaskStatus={changeTaskStatus}
                />)
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

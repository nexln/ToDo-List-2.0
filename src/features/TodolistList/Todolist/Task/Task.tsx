import React, {ChangeEvent, useCallback} from 'react'
import {Checkbox, IconButton} from '@material-ui/core'
import {EditableSpan} from '../../../../components/EditableSpan/EditableSpan'
import {Delete} from '@material-ui/icons'
import {TaskStatuses} from '../../../../api/todoListAPI'
import {RequestStatusType} from "../../../../app/app-reducer";
import {TaskDomainType} from "../../task-reducer";

export type TaskPropsType = {
  task: TaskDomainType
  todolistId: string
  changeTaskStatus: (id: string, status: TaskStatuses, todolistId: string) => void
  changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void
  removeTask: (taskId: string, todolistId: string) => void
  entityStatus?: RequestStatusType
}
export const Task = React.memo((props: TaskPropsType) => {
  const onClickHandler = useCallback(() => {
    props.removeTask(props.task.id, props.todolistId)
  }, [props.task.id, props.todolistId]);

  const onChangeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    let newIsDoneValue = e.currentTarget.checked
    props.changeTaskStatus(props.task.id, newIsDoneValue ? TaskStatuses.Completed : TaskStatuses.New, props.todolistId)
  }, [props.task.id, props.todolistId]);

  const onTitleChangeHandler = useCallback((newValue: string) => {
    props.changeTaskTitle(props.task.id, newValue, props.todolistId)
  }, [props.task.id, props.todolistId]);


  return <div key={props.task.id} className={props.task.status === TaskStatuses.Completed ? 'is-done' : ''}>
    <Checkbox
      checked={props.task.status === TaskStatuses.Completed}
      color="primary"
      onChange={onChangeHandler}
      disabled={props.entityStatus === 'loading' || props.task.entityTaskStatus === 'loading'}
    />

    <EditableSpan title={props.task.title} changeValue={onTitleChangeHandler}/>
    <IconButton onClick={onClickHandler} disabled={props.entityStatus === 'loading' || props.task.entityTaskStatus === 'loading'}>
      <Delete/>
    </IconButton>
  </div>
})

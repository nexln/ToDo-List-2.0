import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';

import {action} from "@storybook/addon-actions";
import {Task, TaskPropsType} from "../features/TodolistList/Todolist/Task/Task";
import {TaskPriorities} from "../api/todoListAPI";

export default {
    title: 'Todolist/Task',
    component: Task,
} as Meta;

const removeCallback = action('Remove button inside Task clicked')
const changeStatusCallback = action('Status changed inside Task')
const changeTitleCallback = action('Title changed inside Task')

const Template: Story<TaskPropsType> = (args) => <Task {...args} />;

const baseArg = {
    removeTask: removeCallback,
    changeTaskStatus: changeStatusCallback,
    changeTaskTitle: changeTitleCallback,
}

export const TaskIsDoneExample = Template.bind({});
TaskIsDoneExample.args = {
    ...baseArg,
    task: {id: '1', isDone: true, title: 'CSS', addedDate: '', description: '', deadline: '', order: 1, priority: TaskPriorities.Low, startDate: '', status: 1, todoListId: ''},
};

export const TaskIsNotDoneExample = Template.bind({});
TaskIsNotDoneExample.args = {
    ...baseArg,
    task: {id: '2', isDone: false, title: 'JS', addedDate: '', description: '', deadline: '', order: 1, priority: TaskPriorities.Low, startDate: '', status: 1, todoListId: ''},
};
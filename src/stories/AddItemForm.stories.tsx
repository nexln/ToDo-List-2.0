import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';

import {action} from "@storybook/addon-actions";
import {AddItemForm, AddItemFormType} from "../AddItemForm";

export default {
    title: 'Todolist/AddItemForm',
    component: AddItemForm,
    argTypes: {
        onClick: {
            description: 'AddItemFormExample clicked'
        }
    },
} as Meta;

const Template: Story<AddItemFormType> = (args) => <AddItemForm {...args} />;

export const AddItemFormExample = Template.bind({});
AddItemFormExample.args = {
    addItem: action('AddItemFormExample clicked')
};
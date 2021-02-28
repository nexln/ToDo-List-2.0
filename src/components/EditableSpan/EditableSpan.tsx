import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import {TextField} from "@material-ui/core";

export type EditableSpanType = {
    title: string
    changeValue: (newValue: string) => void
}
export const EditableSpan = (props: EditableSpanType) => {

    let [title, setTitle] = useState(props.title);
    const [editMode, setEditMode] = useState<boolean>(false);
    const activatedEditMode = () => {
        setEditMode(true)
    };
    const deactivatedEditMode = () => {
        setEditMode(false);
        props.changeValue(title)
    };
    const onChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    };
    const onKeyPressHandler = ({charCode}: KeyboardEvent<HTMLInputElement>) => {
        if (charCode === 13) {
            deactivatedEditMode();
        }
    };
    return (
        editMode
            ? <TextField size={'small'}
                         variant={'outlined'}
                         value={title}
                         onBlur={deactivatedEditMode}
                         onKeyPress={onKeyPressHandler}
                         autoFocus={true}
                         onChange={onChangeTitle}/>
            : <span onDoubleClick={activatedEditMode}>{props.title}</span>
    );
};
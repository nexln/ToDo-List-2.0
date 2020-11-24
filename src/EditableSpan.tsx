import React, {ChangeEvent, useState} from 'react';
import {TextField} from "@material-ui/core";

type EditableSpanType = {
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
    return (
        editMode
            ? <TextField size={'small'}
                         variant={'outlined'}
                         value={title}
                         onBlur={deactivatedEditMode}
                         autoFocus={true}
                         onChange={onChangeTitle}/>
            : <span onDoubleClick={activatedEditMode}>{props.title}</span>
    );
};
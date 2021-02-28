import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import {IconButton, TextField} from "@material-ui/core";
import {AddBox} from "@material-ui/icons";
import {RequestStatusType} from "../../app/app-reducer";

export type AddItemFormType = {
    addItem: (title: string) => void
    entityStatus?: RequestStatusType
}


export const AddItemForm = React.memo((props: AddItemFormType) => {

    let [title, setTitle] = useState("");
    let [error, setError] = useState<string | null>(null);
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    };
    const addItem = () => {
        let trimmedTitle = title.trim();
        if (trimmedTitle !== "") {
            props.addItem(trimmedTitle);
            setTitle("");
        } else {
            setError("Title is required");
        }
    };
    const onKeyPressHandler = ({charCode}: KeyboardEvent<HTMLInputElement>) => {
        if (error !== null) {
            setError(null);
        }
        if (charCode === 13) {
            addItem();
        }
    };

    return (
        <div>
            <TextField
                size={'small'}
                variant={'outlined'}
                value={title}
                onChange={onChangeHandler}
                onKeyPress={onKeyPressHandler}
                error={!!error}
                label={'Title'}
                helperText={error}
                disabled={props.entityStatus === 'loading'}
            />
            <IconButton
                color={"primary"}
                size={"small"}
                onClick={addItem}
                style={{padding: '1px'}}
                disabled={props.entityStatus === 'loading'}
            >
                <AddBox/>
            </IconButton>
        </div>
    );
})
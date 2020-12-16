import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import {IconButton, TextField} from "@material-ui/core";
import {AddBox} from "@material-ui/icons";

type AddItemFormType = {
    addItem: (title: string) => void
}


export const AddItemForm = (props: AddItemFormType) => {


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
        setError(null);
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
            />
            <IconButton
                color={"primary"}
                size={"small"}
                onClick={addItem}>
                <AddBox/>
            </IconButton>
        </div>
    );
};
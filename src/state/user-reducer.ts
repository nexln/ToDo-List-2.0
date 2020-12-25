export type StateType = {
    age: number
    name: string
    childrenCount: number
}

type ActionType = {
    type: string
    [key: string]: any
}


export const userReducer = (state: StateType, action: ActionType) => {
    switch (action.type) {
        case 'INCREMENT-AGE':
            const newState = {...state};
            newState.age = state.age + 1;
            return newState;
        case 'INCREMENT-CHILDREN-COUNT':
            return {...state, childrenCount: state.childrenCount + 1};
        case 'CHANGE-NAME':
            return {...state, name: action.name};
        default:
            throw new Error("I don't understand this type")
    }
};
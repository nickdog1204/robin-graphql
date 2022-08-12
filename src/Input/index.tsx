import {FC, HTMLInputTypeAttribute, PropsWithChildren, ReactElement} from "react";
import './style.css';

export interface IInputProps {
    color: 'white' | 'black';
    type?: HTMLInputTypeAttribute;
    value: string;
    onChange: (val: string) => void;
}

export type InputFC = (it: PropsWithChildren<IInputProps>) => ReactElement

const Input: InputFC = (
    {
        children,
        type = 'text',
        color,
        value,
        onChange
    }
) => {
    return (
        <input
            type={type}
            onChange={(event) => {
                onChange(event.target.value)
            }}
            className={`Input Input_${color}`}
            value={value}
        >
            {children}
        </input>
    )

}

export default Input;
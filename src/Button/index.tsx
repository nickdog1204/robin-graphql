import {FC, ReactNode} from "react";
import './style.css';

interface IButtonProps {
    children: ReactNode;
    className: string;
    color?: string;
    type?: 'button' | 'submit' | 'reset';
    onClick: () => void
}

interface IButtonObtrusiveProps {
    children: ReactNode;
    className: string;
    type?: 'reset' | 'button' | 'submit';
    onClick: () => void;
}

const Button: FC<IButtonProps> =
    ({
         children,
         className,
         color = 'black',
         type = 'button',
         onClick
     }) => {
        return (
            <button
                className={`${className} Button Button_${color}`}
                type={type}
                onClick={onClick}
            >
                {children}
            </button>

        )

    };

const ButtonUnObtrusive: FC<IButtonObtrusiveProps> = (
    {
        children,
        className,
        type = 'button',
        onClick
    }
) => {
    return (
        <button
            type={type}
            className={`${className} Button_unobtrusive`}
            onClick={() => onClick()}
        >
            {children}
        </button>
    )
}
export {ButtonUnObtrusive}
export default Button;
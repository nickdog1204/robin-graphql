import {FC, ReactNode} from "react";

const Link: FC<{ children: ReactNode; href: string; }> = ({children, href}) => {
    return (
        <a href={href} rel="noopener noreferrer" target="_blank">
            {children}
        </a>
    )

}

export default Link;
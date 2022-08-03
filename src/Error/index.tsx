import {FC} from "react";
import './style.css'
import {ApolloError} from "@apollo/client";

const ErrorMessage: FC<{ error: ApolloError }> = ({error}) => {
    return (
        <div className="ErrorMessage">
            <small>錯誤了: {error.message}</small>
        </div>
    )

}

export default ErrorMessage;
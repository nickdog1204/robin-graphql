import {FC, PropsWithChildren} from "react";
import './style.css'
import {IFetchMoreProps} from "../models";
import Loading from "../Loading";
import {ButtonUnObtrusive} from "../Button";

// FC<PropsWithChildren<IFetchMoreProps<>>>
const FetchMore = <VariableType, ResultType>
({
     isLoading,
     hasNextPage,
     variables,
     fetchMore,
     updateQuery,
     children
 }: PropsWithChildren<IFetchMoreProps<VariableType, ResultType>>) => {

    return (
        <div className="FetchMore">
            {hasNextPage ?
                (isLoading ?
                        <Loading/> :
                        <ButtonUnObtrusive className="FetchMore-button" onClick={() => {
                            fetchMore({variables, updateQuery})
                        }}>
                            倉儲Repo
                        </ButtonUnObtrusive>
                ) :
                <p>沒有更多資料了</p>
            }
        </div>
    )

}

export default FetchMore;
import {FC} from "react";
import './style.css'
import {IFetchMoreProps} from "../models";
import Loading from "../Loading";
import {ButtonUnObtrusive} from "../Button";


const FetchMore: FC<IFetchMoreProps> = ({
                                            isLoading,
                                            hasNextPage,
                                            fetchMore,
                                            variables,
                                            updateQuery,
                                            children
                                        }) => {
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
                )
                :
                <p>沒有更多資料了</p>
            }
        </div>
    )

}

export default FetchMore;
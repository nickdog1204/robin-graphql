import {FC} from "react";
import '../style.css'
import {FetchMoreFunType, IPageInfo, IRepositories, IRepositoryItem, UpdateQueryTypeForRepos} from "../../models";
import RepositoryItem from "../RepositoryItem";
import Button from "../../Button";
import Loading from "../../Loading";
import FetchMore from "../../FetchMore";

const RepositoryList: FC<{
    repositories: IRepositoryItem[];
    fetchMore: FetchMoreFunType;
    updateQueryTypeForRepos: UpdateQueryTypeForRepos
    pageInfo: IPageInfo;
    isLoading: boolean;
}> = ({repositories, fetchMore, updateQueryTypeForRepos, pageInfo, isLoading}) => {

    return (
        <>
            {repositories.map(repoItem => {
                return (
                    <div key={repoItem.id} className="RepositoryItem">
                        <RepositoryItem {...repoItem}/>
                    </div>
                )
            })}
            {/*{isLoading ? <Loading/> :*/}
            {/*    pageInfo.hasNextPage &&*/}
            {/*    <button type='button' onClick={() => onFetchMoreBtnClick(pageInfo.endCursor)}>更多倉儲..</button>*/}
            {/*}*/}
            <FetchMore isLoading={isLoading} hasNextPage={pageInfo.hasNextPage} variables={{cursor: pageInfo.endCursor}}
                       fetchMore={fetchMore} updateQuery={updateQueryTypeForRepos}>倉儲</FetchMore>
        </>
    );


}

export default RepositoryList;
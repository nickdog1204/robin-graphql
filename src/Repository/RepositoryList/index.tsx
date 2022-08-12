import {FC, PropsWithChildren,} from "react";
import '../style.css'
import {FetchMoreFunType, IPageInfo, IRepositories, IRepositoryItem, UpdateQueryTypeForRepos} from "../../models";
import RepositoryItem from "../RepositoryItem";
import FetchMore from "../../FetchMore";
import IssueList from "../../Issue";

interface IRepositoryListProps<VariablesType, T> {
    repositories: IRepositoryItem[];
    fetchMore: FetchMoreFunType<VariablesType, T>;
    updateQueryTypeForRepos: UpdateQueryTypeForRepos<VariablesType, T>
    pageInfo: IPageInfo;
    isLoading: boolean;
    variables: VariablesType;
}

const RepositoryList = <VariableType, T>
({
     repositories,
     fetchMore,
     updateQueryTypeForRepos,
     pageInfo,
     isLoading,
     variables
 }: PropsWithChildren<IRepositoryListProps<VariableType, T>>
) => {
    return (
        <>
            {repositories.map(repoItem => {
                return (
                    <div key={repoItem.id} className="RepositoryItem">
                        <RepositoryItem {...repoItem}/>

                        <IssueList
                            repositoryName={repoItem.name}
                            repositoryOwner={repoItem.owner.login}
                        />
                    </div>
                )
            })}
            <FetchMore<VariableType, T> isLoading={isLoading} hasNextPage={pageInfo.hasNextPage}
                                        variables={variables}
                                        fetchMore={fetchMore} updateQuery={updateQueryTypeForRepos}>
                倉儲
            </FetchMore>
        </>
    );


}

export default RepositoryList;
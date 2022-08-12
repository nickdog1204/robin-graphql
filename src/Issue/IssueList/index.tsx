import {FC, PropsWithChildren, ReactElement, useState} from "react";
import './style.css'
import {gql, useLazyQuery, useQuery} from "@apollo/client";
import ErrorMessage from "../../Error";
import {IIssue, IIssueEdge, IQueryIssuesForRepositoryResult, IssueState} from "../../models";
import Loading from "../../Loading";
import IssueItem from "../IssueItem";
import {ButtonUnObtrusive} from "../../Button";

export interface IIssuesProps {
    repositoryName: string;
    repositoryOwner: string;
}

export interface IIssueListProps {
    issueList: IIssue[]
}

export type IssueListFC = (it: PropsWithChildren<IIssueListProps>) => ReactElement


export type IssuesFC = (it: PropsWithChildren<IIssuesProps>) => ReactElement

const GET_ISSUES_OF_REPO = gql`
    query($repositoryName: String!, $repositoryOwner: String!) {
        repository(name: $repositoryName, owner: $repositoryOwner) {
            issues(first: 5) {
                edges {
                    node {
                        id
                        number
                        state
                        title
                        url
                        bodyHTML
                    }
                }
            }
        
        }
    
    }
`;

const Issues: IssuesFC =
    ({
         repositoryOwner,
         repositoryName
     }) => {
        const [issueState, setIssueState] = useState<IssueState>('NONE');
        const [getIssuesForRepo, {
            data,
            loading,
            error
        }] = useLazyQuery<IQueryIssuesForRepositoryResult>(GET_ISSUES_OF_REPO, {
            variables: {
                repositoryOwner,
                repositoryName
            },
        });
        // if(isShow(issueState)) {
        //     getIssuesForRepo();
        // }
        console.log({data, error, loading})
        if (isShow(issueState)) {
            if (error) {
                return (
                    <div className="Issues">
                        <ErrorMessage error={error}/>
                    </div>
                )
            }
            if (!data) {
                return (
                    <div className="Issues">
                        <ButtonUnObtrusive className="OKOK" onClick={() => {
                            setIssueState('OPEN')
                        }}>
                            Show Open Issues
                        </ButtonUnObtrusive>
                    </div>
                )
            }

            const {repository} = data;
            if (loading && !repository) {
                return (
                    <div className="Issues">
                        <Loading/>
                    </div>
                )
            }
            if (!repository.issues.edges.length) {
                return (
                    <div className="Issues">
                        <div className="IssueList">沒有 issues ....</div>
                    </div>
                )
            }
            const issueList: IIssue[] = data.repository.issues.edges.map(it => it.node)
            const filteredIssueList: IIssue[] = issueList.filter(it => it.state === issueState);
            return (
                <div className="Issues">
                    <ButtonUnObtrusive
                        className="OKOK"
                        onClick={() => {
                            setIssueState(getNextState(issueState))
                        }}>
                        {getTransitionLabel(issueState)}
                    </ButtonUnObtrusive>
                    <IssueList issueList={filteredIssueList}/>
                </div>
            )

        } ///
        return (
            <div className="Issues">
                <ButtonUnObtrusive className={"OKOKOKNO"} onClick={() => {
                    setIssueState('OPEN')
                    getIssuesForRepo()
                }}>
                    Show Open Issues
                </ButtonUnObtrusive>

            </div>
        )

    }

const IssueList: IssueListFC = ({issueList}) => {
    return (
        <div className="IssueList">
            {issueList.map(it => (
                <IssueItem issue={it} key={it.id}/>
            ))}
        </div>
    )

}
const isShow = (issueState: IssueState) => issueState !== 'NONE'
const getTransitionLabel = (issueState: IssueState): string => {
    switch (issueState) {
        case "NONE":
            return 'Show Open Issues';
        case "OPEN":
            return 'Show Closed Issues';
        case "CLOSED":
            return 'Hide all Issues'

    }
}
const getNextState = (issueState: IssueState): IssueState => {
    switch (issueState) {
        case "NONE":
            return 'OPEN';
        case "OPEN":
            return 'CLOSED';
        case "CLOSED":
            return 'NONE'

    }
}

export default Issues;
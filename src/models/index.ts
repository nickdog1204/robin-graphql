import {ReactNode} from "react";
import {ApolloQueryResult} from "@apollo/client";

export interface IFetchMoreProps<VariableType, ResultType> {
    isLoading: boolean;
    hasNextPage: boolean;
    variables: VariableType;
    fetchMore: FetchMoreFunType<VariableType, ResultType>,
    updateQuery: UpdateQueryTypeForRepos<VariableType, ResultType>,
    // children: ReactNode
}

export type FetchMoreFunType<VariableType, ResultType> = (it: { variables: VariableType, updateQuery: UpdateQueryTypeForRepos<VariableType, ResultType> }) => Promise<ApolloQueryResult<ResultType>>

export type UpdateQueryTypeForRepos<VT, T> = (
    previousQueryResult: T,
    it: { fetchMoreResult: T, variables: VT }) => T

export type ViewerSubscriptionType = 'SUBSCRIBED' | 'UNSUBSCRIBED';
const SUBSCRIBED: ViewerSubscriptionType = 'SUBSCRIBED';
const UNSUBSCRIBED: ViewerSubscriptionType = 'UNSUBSCRIBED';
export const ViewerSubscriptionEnum = {
    SUBSCRIBED,
    UNSUBSCRIBED
}

export interface IRepositoryItem {
    id: string;
    name: string;
    url: string;
    descriptionHTML: string;
    primaryLanguage: {
        name: string;
    };
    owner: {
        login: string
        url: string
    };
    stargazers: {
        totalCount: number
    };
    viewerHasStarred: boolean;
    watchers: {
        totalCount: number;
    };
    viewerSubscription: ViewerSubscriptionType
}

export interface IQueryReposResult {
    viewer: {
        repositories: IRepositories
    }
}

export interface IQueryOrganizationReposResult {
    organization: {
        repositories: IRepositories
    }
}

export interface IQueryReposVariables {
    cursor: string;
}

export interface IQueryOrganizationReposVariables {
    organizationName: string;
    cursor?: string;
}

export interface IRepositories {
    edges: { node: IRepositoryItem }[]
    pageInfo: IPageInfo
}

export interface IPageInfo {
    endCursor: string;
    hasNextPage: boolean;

}

export interface IStarRepoMutationResult {
    addStar: {
        starrable: {
            id: string;
            viewerHasStarred: boolean;
        }
    }

}

export interface IWatchRepoMutationResult {
    updateSubscription: {
        __typename?: string;
        subscribable: {
            __typename?: string;
            id: string;
            viewerSubscription: ViewerSubscriptionType;
        }
    }
}


export interface IQueryIssuesForRepositoryResult {
    repository: {
        issues: {
            edges: IIssueEdge[]
        }
    }
}

export interface IIssueEdge {
    node: IIssue
}

export interface IIssue {
    id: string
    number: number;
    state: string;
    title: string;
    url: string;
    bodyHTML: string;
}

export type IssueState =
    | 'NONE'
    | 'OPEN'
    | 'CLOSED'
import {ReactNode} from "react";
import {ApolloQueryResult} from "@apollo/client";

export interface IFetchMoreProps<ResultType = IQueryReposResult> {
    isLoading: boolean;
    hasNextPage: boolean;
    variables: IQueryReposVariables;
    fetchMore: FetchMoreFunType<ResultType>,
    updateQuery: UpdateQueryTypeForRepos,
    children: ReactNode
}

export type FetchMoreFunType<ResultType = IQueryReposResult> = (it: { variables: { cursor: string }, updateQuery: UpdateQueryTypeForRepos }) => Promise<ApolloQueryResult<any>>

export type UpdateQueryTypeForRepos<T = IQueryReposResult> = (
    previousQueryResult: T,
    it: { fetchMoreResult: T, variables: IQueryReposVariables }) => T

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
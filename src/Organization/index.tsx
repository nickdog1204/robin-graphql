import {FC} from "react";
import {gql, useQuery} from "@apollo/client";
import {REPO_FRAGMENT} from "../Repository/fragments";
import {
    IQueryOrganizationReposResult,
    IQueryOrganizationReposVariables,
    IQueryReposResult,
    UpdateQueryTypeForRepos
} from "../models";
import Loading from "../Loading";
import ErrorMessage from "../Error";
import './style.css';
import RepositoryList from "../Repository";

const GET_REPOS_OF_ORGANIZATION = gql`
    query($organizationName: String!, $cursor: String) {
        organization(login: $organizationName) {
            repositories(first: 5, after: $cursor) {
                edges {
                    node {
                        ...repository
                    }
                }
                pageInfo {
                    endCursor
                    hasNextPage
                }
            }
        }
    }
    
    
    ${REPO_FRAGMENT}
`

const updateQuery: UpdateQueryTypeForRepos<IQueryOrganizationReposVariables, IQueryOrganizationReposResult> = (previousQueryResult, {
    fetchMoreResult,
    variables
}) => {
    if(!fetchMoreResult) {
        return previousQueryResult
    }
    return {
        ...previousQueryResult,
        organization: {
            ...previousQueryResult.organization,
            repositories: {
                ...previousQueryResult.organization.repositories,
                ...fetchMoreResult.organization.repositories,
                edges: [
                    ...previousQueryResult.organization.repositories.edges,
                    ...fetchMoreResult.organization.repositories.edges
                ]
            }
        }
    }
}

const Organization: FC<{ organizationName: string }> = ({organizationName}) => {
    const {data, loading, error, fetchMore} = useQuery<IQueryOrganizationReposResult>(
        GET_REPOS_OF_ORGANIZATION,
        {
            variables: {organizationName},
            skip: organizationName === '',
            notifyOnNetworkStatusChange: true
        }
    )
    console.log({myData: data?.organization.repositories.edges.map(it => it.node.name)})
    if (error) {
        return <ErrorMessage error={error}/>
    }

    if (loading && !data?.organization) {
        return <Loading/>
    }
    if (!data) {
        return <div>No data</div>
    }
    return (
        <RepositoryList<IQueryOrganizationReposVariables, IQueryOrganizationReposResult>
            repositories={data.organization.repositories.edges.map(it => it.node)}
            fetchMore={fetchMore}
            updateQueryTypeForRepos={updateQuery}
            pageInfo={data.organization.repositories.pageInfo}
            isLoading={loading}
            variables={{
                cursor: data.organization.repositories.pageInfo.endCursor,
                organizationName
            }}
        />

    )

}

export default Organization;
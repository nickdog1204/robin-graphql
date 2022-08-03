import {FC} from "react";
import {gql, useQuery} from "@apollo/client";
import Loading from "../Loading";
import {IQueryReposResult, UpdateQueryTypeForRepos} from "../models";
import RepositoryList, {fragments} from "../Repository";
import ErrorMessage from "../Error";
import repository from "../Repository";

const GET_REPOS_OF_CURRENT_USER = gql`
    query GetCurrentUserRepo($cursor: String) {
        viewer {
            repositories(
                first: 5
                orderBy: { direction: DESC, field: STARGAZERS },
                after: $cursor
            ) {
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
    
    ${fragments.REPO_FRAGMENT}
`

const updateQuery: UpdateQueryTypeForRepos =
    (previousQueryResult, {fetchMoreResult, variables}) => {
        if (!fetchMoreResult) {
            return previousQueryResult
        }
        return {
            ...previousQueryResult,
            viewer: {
                ...previousQueryResult.viewer,
                repositories: {
                    ...previousQueryResult.viewer.repositories,
                    ...fetchMoreResult.viewer.repositories,
                    edges: [
                        ...previousQueryResult.viewer.repositories.edges,
                        ...fetchMoreResult.viewer.repositories.edges
                    ]
                }
            }
        }

    }

const Profile: FC = () => {
    const {loading, error, data, fetchMore} = useQuery<IQueryReposResult>(GET_REPOS_OF_CURRENT_USER, {
        notifyOnNetworkStatusChange: true
    })
    if (error) {
        return (
            <ErrorMessage error={error}/>
        )
    }
    if (loading && !data?.viewer) {
        return (
            <Loading/>
        )
    }
    if (!data) {
        return (
            <p>No data</p>
        )
    }


    return (
        <RepositoryList
            repositories={data.viewer.repositories.edges.map(it => it.node)}
            isLoading={loading}
            pageInfo={data.viewer.repositories.pageInfo}
            fetchMore={fetchMore}
            updateQueryTypeForRepos={updateQuery}
        />
    )

}

export default Profile;
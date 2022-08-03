import {FC} from "react";
import {gql, useQuery} from "@apollo/client";
import {REPO_FRAGMENT} from "../Repository/fragments";
import {IQueryOrganizationReposResult, IQueryReposResult, UpdateQueryTypeForRepos} from "../models";
import Loading from "../Loading";
import ErrorMessage from "../Error";
import './style.css';

const GET_REPOS_OF_ORGANIZATION = gql`
    query($organizationName: String!) {
        organization(login: $organizationName) {
            repositories(first: 5) {
                edges {
                    node {
                        ...repository
                    }
                }
            }
        }
    }
    
    
    ${REPO_FRAGMENT}
`

const updateQuery: UpdateQueryTypeForRepos = (previousQueryResult, {fetchMoreResult, variables}) => {
    return previousQueryResult
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
    if (error) {
        return <ErrorMessage error={error}/>
    }
    if (!loading && !data) {
        return <div>No data</div>
    }
    if (loading || !data?.organization) {
        return <Loading/>
    }
    return (
        <ul>
            {data.organization.repositories.edges.map(it => <li key={it.node.id}>{it.node.name}</li>)}
        </ul>

    )

}

export default Organization;
import React, {ChangeEvent, FC, FormEvent, useEffect, useState} from 'react';
import axios from "axios";


interface IOrganization {
    name: string;
    url: string;
    repository: IRepository
}

interface IRepository {
    name: string;
    url: string;
    id: string;
    viewerHasStarred: boolean;
    stargazers: {
        totalCount: number
    },
    issues: IIssues
}

interface IIssues {
    edges: IssueEdge[];
    totalCount: number;
    pageInfo: {
        endCursor: string;
        hasNextPage: boolean;
    }
}

interface IssueEdge {
    node: IIssueNode
    cursor: string
}

interface IIssueNode {
    id: string;
    url: string;
    title: string;
    reactions: IReactions
}

interface IReactions {
    edges: { node: IReactionNode }[]
}

interface IReactionNode {
    id: string;
    content: string;
}

interface IState {
    path: string;
    organization: IOrganization | null;
    errors: any[] | null
}

interface IMutationResult {
    starrable: {
        viewerHasStarred: boolean
    }
}

const TITLE = "React GraphQL Github Client";

const axiosGitHubGraphQL = axios.create({
    baseURL: 'https://api.github.com/graphql',
    headers: {
        Authorization: `bearer ${process.env.REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN}`
    }
})

const addStarToRepoAsync = async (repoId: string): Promise<IMutationResult> => {
    const {data} = await axiosGitHubGraphQL.post(
        '',
        {
            query: ADD_STAR,
            variables: {repoId}
        }
    )
    const result: IMutationResult = data.data.addStar;
    console.log({result});
    return result;
}
const ADD_STAR = `
    mutation($repoId: ID!) {
        addStar(input: {starrableId: $repoId}) {
            starrable {
                viewerHasStarred
            }
        }
    
    }
`;
const getIssuesOfRepositoryQuery = (organization: string, repository: string) => `
    {
        organization(login: "${organization}") {
            name
            url
            repository(name: "${repository}") {
                name
                url
                issues(last: 5) {
                    edges {
                        node {
                            id
                            title
                            url
                        }
                    }
                    totalCount
                    pageInfo {
                        endCursor
                        hasNextPage
                    }
                }
                
            }
        }
    }
`;
const GET_ISSUES_OF_REPOSITORY = `
    query($organization: String!, $repository: String!, $cursor: String){
        organization(login: $organization) {
            name
            url
            repository(name: $repository) {
                id
                name
                url
                stargazers {
                    totalCount
                }
                viewerHasStarred
                issues(first: 5, states: [OPEN], after: $cursor) {
                    edges {
                        cursor
                        node {
                            id
                            title
                            url
                            reactions(last: 3) {
                                edges {
                                    node {
                                        id
                                        content
                                    }
                                }
                            }
                        }
                        
                    }
                    totalCount
                    pageInfo {
                        endCursor
                        hasNextPage
                    }
                }
                
            }
        }
    }
`;

const resolveAddStarMutation = (mutationResult: IMutationResult) => (state: IState): IState => {
    if (mutationResult.starrable) {
        console.log("NOT ELSE")
        const {viewerHasStarred} = mutationResult.starrable;
        console.log({viewerHasStarred});
        console.log("resolveee")
        const oldOrganization = state.organization!!
        const oldRepository = oldOrganization.repository;
        const {stargazers: {totalCount}} = oldRepository;
        const organization: IOrganization = {
            ...oldOrganization,
            repository: {
                ...oldRepository,
                viewerHasStarred,
                stargazers: {
                    totalCount: totalCount + 1
                }
            }
        }
        const newState: IState = {
            ...state,
            organization
        };
        return newState

    } else {
        console.log("ELSE")
        return state
    }

}


const App: FC = () => {
    const [state, setState] =
        useState<IState>(
            {
                path: 'the-road-to-learn-react/the-road-to-learn-react',
                organization: null,
                errors: null,
            }
        );
    // console.log({state})
    const {path, organization, errors} = state;

    const fetchFromGithubAsync = async () => {
        const cursor = state.organization?.repository.issues.pageInfo.endCursor;
        const [organization, repository] = path.split('/');
        // const query = getIssuesOfRepositoryQuery(organization, repository);
        const query = GET_ISSUES_OF_REPOSITORY;
        const {data} = await axiosGitHubGraphQL
            .post('', {
                query,
                variables: {organization, repository, cursor}
            })
        if (!cursor) {
            setState(prevState => {
                return {
                    ...prevState,
                    organization: data.data.organization,
                    errors: data.errors
                }
            })
        } else {
            const fetchedOrganization: IOrganization = data.data.organization;
            const oldOrganization: IOrganization = state.organization!!;
            const combinedOrganization: IOrganization = {
                ...oldOrganization,
                repository: {
                    ...oldOrganization.repository,
                    issues: {
                        ...fetchedOrganization.repository.issues,
                        edges: [...oldOrganization.repository.issues.edges, ...fetchedOrganization.repository.issues.edges]

                    }
                }
            }
            setState(prevState => {
                return {
                    ...prevState,
                    organization: combinedOrganization,
                    errors: data.errors
                }
            })
        }
    }
    useEffect(() => {
        fetchFromGithubAsync()
    }, []);

    const urlChangeHandler = async (event: ChangeEvent<HTMLInputElement>) => {
        const path = event.target.value;
        setState(prevState => {
            return {
                ...prevState,
                path
            }
        });
    }
    const submitHandler = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        fetchFromGithubAsync();
    }

    const moreBtnFromRepoClickedHandlerAsync = async () => {
        // const totalCount = organization?.repository.issues.totalCount;
        // const endCursor = organization?.repository.issues.pageInfo.endCursor;
        // const hasNextPage = organization?.repository.issues.pageInfo.hasNextPage;
        fetchFromGithubAsync()

    }
    const starRepoHandlerAsync = async (repoId: string, viewerHasStarred: boolean) => {
        console.log('starRepoHandler')
        const res = await addStarToRepoAsync(repoId);
        const res2 = resolveAddStarMutation(res)
        setState(prevState => {
            return {
                ...prevState,
                ...res2(prevState)
            }
        })
    }

    return (
        <div>
            <h1>{TITLE}</h1>
            <form onSubmit={submitHandler}>
                <label htmlFor="url">
                    Show open issues for https://github.com
                </label>
                <input
                    id="url"
                    type="text"
                    value={path}
                    style={{width: '300px'}}
                    onChange={urlChangeHandler}
                />
                <button type="submit">Search</button>
            </form>
            <hr/>
            {organization
                ? <Organization organization={organization} errors={errors}
                                onStarRepo={starRepoHandlerAsync}
                                onMoreBtnInRepoClicked={moreBtnFromRepoClickedHandlerAsync}/>
                : <p>No information yet!</p>
            }
        </div>
    );
}

export default App;

const Organization: FC<{
    organization: IOrganization;
    errors: any[] | null;
    onMoreBtnInRepoClicked: () => void;
    onStarRepo: (repoId: string, hasViewerStarred: boolean) => void;
}> = ({
          organization,
          errors,
          onMoreBtnInRepoClicked,
          onStarRepo
      }) => {
    if (errors) {
        return (
            <p>
                <strong>Something went wrong...</strong>
                {errors.map(error => error.message).join(' ')}
            </p>
        )
    }
    return (
        <div>
            <p>
                <strong>Issues from Organization:</strong>
                <a href={organization.url}>{organization.name}</a>
            </p>
            <Repository
                repository={organization.repository}
                onMoreButtonClicked={onMoreBtnInRepoClicked}
                onStarRepo={onStarRepo}
            />
        </div>
    )

}
const Repository: FC<{
    repository: IRepository;
    onMoreButtonClicked: () => void;
    onStarRepo: (repoId: string, hasViewerStarred: boolean) => void;
}> = ({repository, onMoreButtonClicked, onStarRepo}) => {
    return (
        <div>
            <p>
                <strong>In Repository:</strong>
                <a href={repository.url}>{repository.name}</a>
            </p>

            <button
                type="button"
                onClick={() => onStarRepo(repository.id, repository.viewerHasStarred)}
            >
                ({repository.stargazers.totalCount})
                {repository.viewerHasStarred ? 'UnStar' : 'Star'}
            </button>
            <ul>
                {repository.issues.edges.map(issue => {
                    // console.log({issue})
                    return (
                        <li key={issue.node.id}>
                            <a href={issue.node.url}>{issue.node.title}({issue.cursor})</a>
                            <h1>Reactions:</h1>
                            <ul>
                                {issue.node.reactions.edges.map(reaction => {
                                    return (
                                        <li key={reaction.node.id}>{reaction.node.content}</li>
                                    )
                                })}
                            </ul>
                        </li>
                    )
                })}
            </ul>
            <hr/>
            <hr/>
            {repository.issues.pageInfo.hasNextPage &&
                (
                    <button onClick={onMoreButtonClicked}>More</button>
                )
            }
        </div>
    )

}
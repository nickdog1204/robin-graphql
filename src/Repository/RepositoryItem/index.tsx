import {FC} from "react";
import {
    IRepositoryItem,
    IStarRepoMutationResult,
    IWatchRepoMutationResult,
    ViewerSubscriptionEnum,
    ViewerSubscriptionType
} from "../../models";
import Link from "../../Link";
import {gql, useMutation} from "@apollo/client";
import Button from "../../Button";
import {REPO_FRAGMENT} from "../fragments";
import '../style.css'

const isWatch = (viewerSubscription: ViewerSubscriptionType) =>
    viewerSubscription === 'SUBSCRIBED'


const WATCH_REPO = gql`
    mutation($id: ID!, $viewerSubscription: SubscriptionState!) {
        updateSubscription(
            input: {state: $viewerSubscription, subscribableId: $id}
        ) {
            subscribable {
                id
                viewerSubscription
            }
        }
    }
`

const STAR_REPO = gql`
    mutation($id: ID!) {
        addStar(input: {starrableId: $id}) {
            starrable {
                id
                viewerHasStarred
            }
        }
    }
`


const RepositoryItem: FC<IRepositoryItem> = (
    {
        id,
        url,
        name,
        stargazers,
        descriptionHTML,
        primaryLanguage,
        owner,
        viewerHasStarred,
        viewerSubscription,
        watchers
    }) => {
    const [watchRepo, {
        loading: watchLoading,
        data: watchData,
        error: watchError
    }] = useMutation<IWatchRepoMutationResult>(WATCH_REPO, {
        variables: {
            id,
            viewerSubscription: isWatch(viewerSubscription) ?
                ViewerSubscriptionEnum.UNSUBSCRIBED :
                ViewerSubscriptionEnum.SUBSCRIBED
        }
    })
    const [starRepo, {data, loading, error}] = useMutation<IStarRepoMutationResult>(STAR_REPO, {variables: {id}})
    const starBtnClickHandler = () => {
        starRepo({
            update(cache, {data}) {
                if (data) {
                    const id = data.addStar.starrable.id;
                    const repo = cache.readFragment<IRepositoryItem>({
                        id: `Repository:${id}`,
                        fragment: REPO_FRAGMENT
                    })
                    if (repo) {
                        const newCount = repo.stargazers.totalCount + 1;
                        cache.writeFragment<IRepositoryItem>({
                            id: `Repository:${id}`,
                            fragment: REPO_FRAGMENT,
                            data: {
                                ...repo,
                                stargazers: {
                                    ...repo.stargazers,
                                    totalCount: newCount
                                }
                            }

                        })


                    } else {
                        throw new Error('REPOOO is null|undefined')
                    }


                } else {
                    throw new Error('Data in StarRepo is nulllllll')
                }
            }
        });
    }
    const watchBtnClickHandler = async (id: string, viewerSubscription: ViewerSubscriptionType) => {
        const a = await watchRepo({
            update: (cache, {data}) => {
                if (data) {
                    const id = data.updateSubscription.subscribable.id;
                    const repo = cache.readFragment<IRepositoryItem>({
                        id: `Repository:${id}`,
                        fragment: REPO_FRAGMENT
                    });
                    if (repo) {
                        const currentWatchCount = repo.watchers.totalCount;
                        const newCount =
                            data.updateSubscription.subscribable.viewerSubscription === 'SUBSCRIBED' ?
                                (currentWatchCount + 1) :
                                (currentWatchCount - 1)


                        const mydata = {
                            ...repo,
                            watchers: {
                                ...repo.watchers,
                                totalCount: newCount
                            }
                        }
                        console.log({mydata});
                        cache.writeFragment({
                            id: `Repository:${id}`,
                            fragment: REPO_FRAGMENT,
                            data: mydata
                        })


                    } else {
                        throw new Error("[WATTCH] REPO read from cache is null")
                    }

                } else {
                    throw new Error('WATCH REPO Result is null')
                }

            },
            optimisticResponse: {
                updateSubscription: {
                    __typename: 'Mutation',
                    subscribable: {
                        __typename: 'Repository',
                        id,
                        viewerSubscription: isWatch(viewerSubscription) ?
                            'UNSUBSCRIBED' :
                            'SUBSCRIBED'
                    }
                }

            }
        })

    };
    return (
        <div>
            <div className="RepositoryItem-title">
                <h2>
                    <Link href={url}>{name}</Link>
                </h2>
                <div>
                    {!viewerHasStarred ?
                        loading ?
                            <p>Loaddding</p> :
                            <Button className="RepositoryItem-title-action"
                                    onClick={starBtnClickHandler}
                            >
                                <span>
                                    {stargazers.totalCount} Stars
                                </span>
                            </Button> :
                        <span>Starred: {stargazers.totalCount}</span>

                    } {' || '}
                    {viewerSubscription === 'SUBSCRIBED' ?
                        <span>Watched: {watchers.totalCount}</span> :
                        <Button className="RepositoryItem-title-action"
                                onClick={() => watchBtnClickHandler(id, viewerSubscription)}>
                            <span>{watchers.totalCount} watchers</span>

                        </Button>
                    }
                </div>
            </div>

            <div className="RepositoryItem-description">
                <div className="RepositoryItem-description-info"
                     dangerouslySetInnerHTML={{__html: descriptionHTML}}
                />
                <div className="RepositoryItem-description-details">
                    <div>
                        {primaryLanguage && (
                            <span>Language: {primaryLanguage.name}</span>
                        )}
                    </div>
                    <div>
                        {owner && (
                            <span>
                                Owner: <a href={owner.url}>{owner.login}</a>
                            </span>
                        )}
                    </div>
                </div>
            </div>

        </div>
    )

}

export default RepositoryItem;
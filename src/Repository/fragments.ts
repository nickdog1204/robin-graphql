import {gql} from "@apollo/client";

export const REPO_FRAGMENT = gql`
    fragment repository on Repository {
            id
            name
            url
            descriptionHTML
            primaryLanguage {
                name
            }
            owner {
                login
                url
            }
            stargazers {
                totalCount
            }
            viewerHasStarred
            watchers {
                totalCount
            }
            viewerSubscription
    }

`
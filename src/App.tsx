import React, {ChangeEvent, FC, FormEvent, useEffect, useState} from 'react';
import {ApolloClient, createHttpLink, gql, InMemoryCache} from "@apollo/client";
import {setContext} from "@apollo/client/link/context";

const TITLE = "React GraphQL Github Client";

const httpLink = createHttpLink({
    uri: 'https://api.github.com/graphql'
})
const authLink = setContext((_, {headers}) => {
    return {
        headers: {
            ...headers,
            authorization: `Bearer ${process.env.REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN}`
        }
    }

})

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
});

const ADD_STAR = gql`
    mutation AddStar($repoId: ID!) {
        addStar(input: {starrableId: $repoId}) {
            starrable {
                id
                viewerHasStarred
            }
        }
    
    }
`


client.query({
    query: gql`
        query($organization: String!){
            organization(login: $organization) {
                name
                url
                repositories(first: 5) {
                    edges {
                        node {
                            name
                            url
                        }
                    }
                }
            }
        }
    `,
    variables: {
        organization: "the-road-to-learn-react"
    }
})
    .then(result => console.log({result}));

const App: FC = () => {
    return (
        <div>
            <h1>{TITLE}</h1>
        </div>
    )
}

export default App;

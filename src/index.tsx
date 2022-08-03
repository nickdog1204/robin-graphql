import React from 'react';
import ReactDOM from 'react-dom/client';
// import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import serviceWorker from './serviceWorker';
import {ApolloClient, ApolloLink, ApolloProvider, createHttpLink, InMemoryCache} from "@apollo/client";
import {setContext} from "@apollo/client/link/context";
import './style.css'
import {onError} from "@apollo/client/link/error";


const errorLink = onError(({graphQLErrors, networkError}) => {
    if (graphQLErrors) {
        console.log('start GraphQLErrrorrrrs:')
        graphQLErrors.forEach(it => console.log(it.message + '\n'))
        console.log('end GraphQLErrrorrrrs:')
    }
    if (networkError) {
        console.log('start NetworkErrrorrrrs:')
        console.log(networkError.message)
        console.log('end NetworkErrrorrrrs:')
    }

})

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
});
const link = ApolloLink.from([authLink, errorLink, httpLink])
const cache = new InMemoryCache();

const client = new ApolloClient({
    link,
    cache
});

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <ApolloProvider client={client}>
        <App/>
    </ApolloProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
serviceWorker();
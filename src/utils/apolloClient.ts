import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const getAuthHeaders = (authToken: string | null) => {
    if (!authToken) return undefined;
    return {
        authorization: `Bearer ${authToken}`,
    };
};

export const createApolloClient = (authToken: string | null) => {
    const link = new HttpLink({
        uri: '/api/graphql',
        credentials: 'same-origin',
        headers: getAuthHeaders(authToken),
    });

    return new ApolloClient({
        link,
        cache: new InMemoryCache(),
        defaultOptions: {
            query: {
                fetchPolicy: 'no-cache',
                errorPolicy: 'all'
            },
            watchQuery: {
                fetchPolicy: 'no-cache',
                errorPolicy: 'all'
            }
        }
    });
};
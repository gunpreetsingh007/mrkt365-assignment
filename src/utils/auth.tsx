import { useState, useContext, createContext, useMemo, useEffect } from 'react';
import type { ApolloClient, FetchResult, NormalizedCacheObject } from '@apollo/client';
import { ApolloProvider } from '@apollo/client';
import { createApolloClient } from './apolloClient';
import { LoginMutation, SignUpMutation } from './graphqlMutation';
import type { LoginInput, SignUpInput } from '~/server/graphql/resolvers/user.resolver';
import { User } from '~/server/graphql/server';


// Define the shape of the auth context
interface AuthContextType {
    authToken: string | null;
    currentUser: User | null;
    isAuthInitialize: boolean;
    isSigningIn: boolean;
    isSignInSuccess: boolean;
    signInError: Error | null;
    signIn: ({ email, password }: LoginInput) => void;
    isSigningUp: boolean;
    isSignUpSuccess: boolean;
    signUpError: Error | null;
    signUp: ({ email, name, password }: SignUpInput) => void;
    signOut: () => void;
    apolloClient: ApolloClient<NormalizedCacheObject>;
}
//@typescript-eslint/no-misused-promises
const defaultAuthContextValue: AuthContextType = {
    authToken: null,
    currentUser: null,
    isAuthInitialize: false,
    isSigningIn: false,
    isSignInSuccess: false,
    signInError: null,
    signIn: async () => { console.log('signIn default value'); },
    isSigningUp: false,
    isSignUpSuccess: false,
    signUpError: null,
    signUp: async () => { console.log('signUp default value'); },
    signOut: () => { console.log('signOut default value'); },
    apolloClient: createApolloClient(null),
};

const authContext = createContext<AuthContextType>(defaultAuthContextValue);

type AuthProviderProps = {
    children: React.ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
    const auth = useProvideAuth();

    return (
        <authContext.Provider value={auth}>
            <ApolloProvider client={auth.apolloClient}>
                {children}
            </ApolloProvider>
        </authContext.Provider>
    );
}

export const useAuth = () => {
    return useContext(authContext);
}

function useProvideAuth() {
    const [authToken, setAuthToken] = useState<string | null>(null);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isAuthInitialize, setAuthInitialization] = useState(false);
    const [isSigningIn, setSigningIn] = useState(false);
    const [isSignInSuccess, setIsSignInSuccess] = useState(false);
    const [signInError, setSignInError] = useState<Error | null>(null);
    const [isSigningUp, setSigningUp] = useState(false);
    const [isSignUpSuccess, setIsSignUpSuccess] = useState(false);
    const [signUpError, setSignUpError] = useState<Error | null>(null);

    useEffect(() => {
        // Attempt to get the auth token from local storage when the component mounts
        const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
        const currentUser = typeof window !== 'undefined' ? localStorage.getItem('currentUser') : null;
        if (currentUser) {
            const parsedCurrentUser: User = JSON.parse(currentUser) as User;
            setCurrentUser(parsedCurrentUser);
        }
        setAuthToken(token);
        setAuthInitialization(true);
    }, []);

    const apolloClient = useMemo(() => createApolloClient(authToken), [authToken]);

    const signIn = async ({ email, password }: LoginInput) => {
        setSigningIn(true);
        setSignInError(null);
        try {
            const result: FetchResult<{ login: { token: string; user: User; }; }> = await apolloClient.mutate({
                mutation: LoginMutation,
                variables: { email, password },
            });

            if (result?.data?.login?.token) {
                setAuthToken(result.data.login.token);
                setCurrentUser(result.data.login.user);
                if (typeof window !== 'undefined') {
                    localStorage.setItem('authToken', result.data.login.token);
                    localStorage.setItem('currentUser', JSON.stringify(result.data.login.user));
                    setIsSignInSuccess(true);
                }
            }
        } catch (e) {
            setSignInError(e instanceof Error ? e : new Error('An error occurred during sign in'));
        } finally {
            setSigningIn(false);
        }
    }

    const signUp = async ({ email, name, password }: SignUpInput) => {
        setSigningUp(true);
        setSignUpError(null);
        try {
            const result: FetchResult<{ signUp: { token: string; user: User; }; }> = await apolloClient.mutate({
                mutation: SignUpMutation,
                variables: { email, password, name },
            });
            if(result?.data?.signUp?.token) {
                setAuthToken(result.data.signUp.token);
                setCurrentUser(result.data.signUp.user);
                if (typeof window !== 'undefined') {
                    localStorage.setItem('authToken', result.data.signUp.token);
                    localStorage.setItem('currentUser', JSON.stringify(result.data.signUp.user));
                    setIsSignUpSuccess(true);
                }
            }
        }
        catch (e) {
            setSignUpError(e instanceof Error ? e : new Error('An error occurred during sign up'));
        }
        finally {
            setSigningUp(false);
        }
    }

    const signOut = () => {
        setAuthToken(null);
        setCurrentUser(null);
        if (typeof window !== 'undefined') {
            localStorage.removeItem('authToken');
            localStorage.removeItem('currentUser');
        }
    }

    return {
        authToken,
        currentUser,
        isAuthInitialize,
        isSigningIn,
        isSignInSuccess,
        signInError,
        signIn,
        isSigningUp,
        isSignUpSuccess,
        signUpError,
        signUp,
        signOut,
        apolloClient,
    };
}
import { gql } from "@apollo/client";

export const GetUserDetailsQuery = gql`
    query GetUserDetails {
        getUserDetails {
            id
            name
            email
        }
    }
`;

export const GetPaginatedCategoriesQuery = gql`
    query GetPaginatedCategories($page: Int!) {
        getPaginatedCategories(page: $page) {
            id
            name
            isInterested
        }
    }
`;

export const GetTotalPaginatedCountForCategoriesQuery = gql`
    query GetTotalPaginatedCountForCategories {
        getTotalPaginatedCountForCategories
    }
`;
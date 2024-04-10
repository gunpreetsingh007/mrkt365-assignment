import { gql } from '@apollo/client';

export const LoginMutation = gql`
mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    token
    user{
      id
      name
      email
    }
  }
}
`;

export const SignUpMutation = gql`
mutation SignUp($email: String!, $name: String!, $password: String!) {
  signUp(email: $email, name: $name, password: $password) {
    token
    user{
      id
      name
      email
    }
  }
}
`;

export const EditUserInterestsMutation = gql`
mutation EditUserInterests($categoryId: ID!, $isInterested: Boolean!) {
  editUserInterests(categoryId: $categoryId, isInterested: $isInterested) {
    message
    statusCode
  }
}
`;
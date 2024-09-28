import { gql } from '@apollo/client';
import { ApolloError } from '@apollo/client';

// Query to get all posts
export const GET_ALL_POSTS = gql`
  query {
    posts {
      title
      slug
      content {
        raw
      }
      date
    }
  }
`;

// Query to get a specified number of the latest posts
export const GET_LATEST_POSTS = gql`
  query($number: Int!) {
    posts(orderBy: date_DESC, first: $number) {
      title
      slug
      content {
        raw
      }
      date
    }
  }
`;

// Query to get a featured post by slug
export const GET_FEATURED_POST = gql`
  query($slug: String!) {
    post(where: { slug: $slug, featured: true }) {
      title
      slug
      content {
        raw
      }
      date
    }
  }
`;

// Function to execute a query with error handling
export async function executeQuery(client, query, variables = {}) {
  try {
    const response = await client.query({
      query,
      variables,
    });
    return response.data;
  } catch (error) {
    if (error instanceof ApolloError) {
    //   console.error('ApolloError:', error);

    //   // Specific error details
    //   console.error('Error message:', error.message);
    //   console.error('GraphQL Errors:', error.graphQLErrors);
    //   console.error('Network Error:', error.networkError);
    //   console.error('Error Extensions:', error.extensions);

      // You can throw the error again if you want it to be caught by a higher-level handler
      throw error;
    } else {
      // Handle non-ApolloError errors
      //console.error('Unexpected Error:', error);
      throw error;
    }
  }
}
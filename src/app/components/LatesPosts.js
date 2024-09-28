import { GET_LATEST_POSTS } from './utils/data/posts';
import client from './utils/hygraph';
import { RichText } from '@graphcms/rich-text-react-renderer';
import { ApolloError } from '@apollo/client';

export default async function LatestPostsPage() {
  let posts = [];
  let error = null;

  try {
    const { data } = await client.query({
      query: GET_LATEST_POSTS,
      variables: { number: 5 },  // Fetch the 5 latest posts
    });
    posts = data.posts;
  } catch (err) {
    if (err instanceof ApolloError) {
      console.error('ApolloError:', err);

      // Print the error message
      console.error('Error message:', err.message);

      // Print GraphQL errors, if any
      if (err.graphQLErrors.length > 0) {
        err.graphQLErrors.forEach(({ message, locations, path }) => {
          console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);
        });
      }

      // Print network error, if any
      if (err.networkError) {
        console.error(`[Network error]: ${err.networkError}`);
        if (err.networkError.result && err.networkError.result.errors) {
          console.error('Detailed Network Error Info:', err.networkError.result.errors);
        }
      }
      
      // Optionally, you can also log other parts of the error
      console.error('Error Extensions:', err.extensions);
    } else {
      console.error('Unexpected Error:', err);
    }
    error = 'Failed to load latest posts. Please try again later.';
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Latest Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <h2>{post.title}</h2>
            <p>{post.date}</p>
            {/* Render the rich text content */}
            <RichText content={post.content} />
          </li>
        ))}
      </ul>
    </div>
  );
}
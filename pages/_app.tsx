import '../styles/tailwind.css';
import Layout from '../components/Layout';
import { ApolloProvider } from "@apollo/client"
import { client } from '../lib/apollo';

function MyApp({ Component, pageProps }) {
  return (
    // Gotta remember to wrap the Apollo Client GraphQL provider around the app at the top level
    <ApolloProvider client={client}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ApolloProvider>
  );
}

export default MyApp;

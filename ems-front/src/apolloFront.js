import { ApolloClient, createHttpLink, InMemoryCache, ApolloProvider } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { getToken } from "./auth";

const httpLink = createHttpLink({ uri: "http://localhost:4000/graphql" });
const authLink = setContext((_, { headers }) => ({
  headers: {
    ...headers,
    authorization: getToken() ? `Bearer ${getToken()}` : "",
  },
}));

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

const ApolloWrapper = ({ children }) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default ApolloWrapper;

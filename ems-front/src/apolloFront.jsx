import { ApolloClient, createHttpLink, from, InMemoryCache, ApolloProvider } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { getToken, logout } from "./auth";

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_API_URL || "http://localhost:4000/graphql",
});
const authLink = setContext((_, { headers }) => ({
  headers: {
    ...headers,
    authorization: getToken() ? `Bearer ${getToken()}` : "",
  },
}));
const errorLink = onError(({ graphQLErrors }) => {
  const sessionExpired = graphQLErrors?.some(({ extensions }) => extensions?.code === "UNAUTHENTICATED");
  if (sessionExpired && window.location.pathname !== "/login") {
    logout();
    window.location.replace("/login?session=expired");
  }
});

const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
});

const ApolloWrapper = ({ children }) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default ApolloWrapper;

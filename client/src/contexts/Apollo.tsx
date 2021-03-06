import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { ReactNode, useMemo, VFC } from "react";

import { useAuth } from "./Auth";

const getAuthLink = (token?: string) => {
  return setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    };
  });
};

const getClient = (token?: string) => {
  const httpLink = createHttpLink({ uri: import.meta.env.VITE_ENDPOINT });
  const cache = new InMemoryCache({
    typePolicies: {
      Topic: {
        fields: {
          comments: {
            keyArgs: false,
            merge(existing, incoming) {
              if (!existing) return incoming;
              const merged = {
                ...incoming,
                edges: [...existing.edges, ...incoming.edges],
              };
              return merged;
            },
          },
        },
      },
    },
  });

  return new ApolloClient({
    link: getAuthLink(token).concat(httpLink),
    cache,
    connectToDevTools: import.meta.env.DEV,
  });
};

type ApolloProps = {
  children: ReactNode;
};

export const Apollo: VFC<ApolloProps> = ({ children }) => {
  const { token } = useAuth();
  const client = useMemo(() => {
    console.log("Apollo client initialized!");
    return getClient(token);
  }, [token]);
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

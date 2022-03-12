import { gql } from "@apollo/client";
import { createContext, ReactNode, useContext, VFC } from "react";

import { MeFragment, useMeQuery } from "../graphql/generated";
import { useAuth } from "./Auth";

gql`
  fragment Me on User {
    id
    displayName
  }
`;

gql`
  query me {
    me {
      id
      ...Me
    }
  }
`;

const MeContext = createContext<MeFragment | undefined>(undefined);

type MeProps = {
  children: ReactNode;
};

export const Me: VFC<MeProps> = ({ children }) => {
  const { uid } = useAuth();
  const { data: meData } = useMeQuery({ skip: !uid });
  if (!uid) return <>{children}</>;
  if (!meData) return null;
  return <MeContext.Provider value={meData.me}>{children}</MeContext.Provider>;
};

export const useMe = () => {
  const me = useContext(MeContext);
  if (!me) throw new Error("me cloud not defined");
  return me;
};

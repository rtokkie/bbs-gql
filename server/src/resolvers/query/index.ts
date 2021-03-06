import { authorize } from "../../core/authorization/authorize";
import { Resolvers } from "../../graphql/generated";

export const Query: Resolvers["Query"] = {
  me: (_parent, _args, context) => {
    authorize(context);

    const { uid } = context;
    const { usersCollection } = context.collections;

    return usersCollection.findOneById(uid);
  },

  topic: (_parent, args, context) => {
    const { id } = args;
    const { topicsCollection } = context.collections;

    return topicsCollection.findOneById(id);
  },

  topics: (_parent, args, context) => {
    const { topicsCollection } = context.collections;

    return topicsCollection.findAll(args.input);
  },
};

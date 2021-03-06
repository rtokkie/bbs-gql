// SEE: https://github.com/dotansimha/graphql-code-generator/issues/3899#issuecomment-616591648

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { printSchema } = require("graphql");

module.exports = {
  plugin: (schema, _documents, _config) => {
    return [
      'import { gql } from "apollo-server-express";',
      "",
      "export const typeDefs = gql`",
      printSchema(schema),
      "`;",
      "",
    ].join("\n");
  },
};

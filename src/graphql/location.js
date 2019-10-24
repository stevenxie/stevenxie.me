import gql from "graphql-tag";

export const fragments = {
  regionLabel: gql`
    fragment RegionLabel on LocationQuery {
      region {
        address {
          label
        }
      }
    }
  `,
};

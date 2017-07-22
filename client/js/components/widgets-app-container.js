import { createFragmentContainer, graphql } from 'react-relay';

import { WidgetsApp } from './widgets-app';

export const WidgetsAppContainer = createFragmentContainer(WidgetsApp, {
  // connection key connects to the sharedUpdater on the add widget mutation
  viewer: graphql`
    fragment widgetsAppContainer_viewer on Viewer {
      id
      widgets(first: 2147483647) @connection(key: "widgetsAppContainer_widgets")  {
        edges {
          node {
            id name description color size quantity
          }
        }
        totalCount
      }
    }
  `,
});
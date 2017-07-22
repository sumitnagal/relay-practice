import { createFragmentContainer, graphql } from 'react-relay';

import { WidgetsApp } from './widgets-app';

// GraphQL Directives for Relay Modern
// @connection - names a connection for use with pagination, also required to retrieve a connection
// @relay - used when an array of objects will be returned
// @inline - allows the inlining of shared fragments, but considered to be anti-pattern to have
// shared fragments. If shared fragments are being used a new container may be needed

export const WidgetsAppContainer = createFragmentContainer(WidgetsApp, {
  // the name of the fragment follows the pattern <file_name>_<prop_name>
  // the name of this file is 'widget-app-container' which is normalized to
  // 'widgetsAppContainer'
  // the name of the prop is 'viewer'
  // so the named of the fragment is 'widgetsAppContainer_viewer'
  // the viewer props will be populated with the payload returned form the query
  // Directive @connection
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
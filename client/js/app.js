import 'bootstrap-loader';
import '../scss/styles.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import { QueryRenderer, graphql } from 'react-relay';

import { WidgetsAppContainer } from './components/widgets-app-container';
import { environment } from './environment';

// environment - the environment object imported from the environment file
// query - top level query, references the query in 'widgets-app-container.js'
// variables - are just for the query
// render - either display loading or the container component
ReactDOM.render(
  <QueryRenderer
    environment={environment}
    query={graphql`
      query appQuery {
        viewer {
          ...widgetsAppContainer_viewer
        }
      }
    `}
    variables={{}}
    render={({ error, props, retry }) => {
      
      // params
      // - error - if an error occurred
      // - props - data returned from query
      // - retry - function to attempt to reload the page, useful is there
      // is an error

      if (error) {
        console.log(error);
        return <div>
          <h1>Error Loading</h1>
          <button type="button" onClick={() => retry()}>Retry</button>
        </div>;
      } else if (props) {
        // the 'props.viewer' corresponds to the
        // fragment 'widgetsAppContainer_viewer'
        return <WidgetsAppContainer viewer={props.viewer} />;
      } else {
        // graphql has not returned yet, just say loading
        return <div>Loading...</div>;
      }
    }}
  />,
  document.querySelector('main'),
);
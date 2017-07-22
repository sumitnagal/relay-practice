import 'bootstrap-loader';
import '../scss/styles.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import { QueryRenderer, graphql } from 'react-relay';

import { WidgetsAppContainer } from './components/widgets-app-container';
import { environment } from './environment';

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
    variables={{
      appTitle: 'Widget Tool',
    }}
    render={({ props }) => {
      if (props) {
        return <WidgetsAppContainer viewer={props.viewer} />;
      } else {
        return <div>Loading...</div>;
      }
    }}
  />,
  document.querySelector('main'),
);
import React from 'react';
import { QueryRenderer, graphql } from 'react-relay';

import { WidgetHomeContainer } from './widget-home';
import { environment } from '../environment';

export class HomePage extends React.Component {

  // environment - the environment object imported from the environment file
  // query - top level query, references the query in 'widgets-app-container.js'
  // note: viewer is no longer required in Relay Modern, it was a requirement
  // of relay classic, but not relay modern 
  // variables - are just for the query
  // render - either display loading or the container component
  render() {
    return <section>
      <QueryRenderer
        environment={environment}
        query={graphql`
          query homePageQuery {
            viewer {
              id
              ...widgetHome_viewer
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
            // only shows id if id is above
            //console.log(props.viewer.id);
            // the 'props.viewer' corresponds to the
            // fragment 'widgetsAppContainer_viewer'
            // additional non-relay data can be passed in here
            // incorporating Redux can be used to manage non-relay data
            return <WidgetHomeContainer {...this.props} viewer={props.viewer} />;
          } else {
            // graphql has not returned yet, just say loading
            return <div>Loading Home Page...</div>;
          }
        }}
      />
    </section>;
  }

}
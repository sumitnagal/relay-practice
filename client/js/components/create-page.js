import React from 'react';
import PropTypes from 'prop-types';
import { QueryRenderer, graphql } from 'react-relay';

import { environment } from '../environment';
import { WidgetCreateContainer } from './widget-create';

export class CreatePage extends React.Component {

  static propTypes = {
    router: PropTypes.shape({
      push: PropTypes.func,
    }),
  };  

  render() {

    return <section>
      <QueryRenderer
        environment={environment}
        query={graphql`query createPageQuery { viewer {
          ...widgetCreate_viewer
          ...widgetTable_viewer
        } }`}
        render={({ props }) => {
          if (props) {
            console.log(props);
            return <WidgetCreateContainer {...this.props} viewer={props.viewer} />;
          } else {
            return <div>Loading Create Page...</div>;
          }
        }}
      />
    </section>;

  }

}
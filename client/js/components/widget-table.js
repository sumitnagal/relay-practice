import React from 'react';
import PropTypes from 'prop-types';
import { createFragmentContainer, graphql } from 'react-relay';

import { connectionEdgesToArray } from '../utils';
import { WidgetViewRowContainer } from './widget-view-row';

export class WidgetTable extends React.Component {

  static propTypes = {
    viewer: PropTypes.shape({
      widgets: PropTypes.shape({
        edges: PropTypes.array
      }),
    }),
  };

  render() {

    return <table className="table table-striped">
      <thead>
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th>Color</th>
          <th>Size</th>
          <th>Quantity</th>
        </tr>
      </thead>
      <tbody>
        {do {
          if (this.props.viewer.widgets == null) {
            <tr><td colSpan="6">There are no widgets.</td></tr>;
          } else {
            // connectionEdgesToArray - simple util function to convert the 'edge'
            // object structure to a normal array to use with presentation components
            connectionEdgesToArray(this.props.viewer.widgets).map(widget => {
              return <WidgetViewRowContainer key={widget.__id} widget={widget} />;
            });
          }
        }}
      </tbody>
    </table>;
  }

}

export const WidgetTableContainer = createFragmentContainer(WidgetTable, graphql`
  fragment widgetTable_viewer on Viewer {
    widgets(first: 2147483647) @connection(key: "widgetTable_widgets")  {
      edges {
        node {
          ...widgetViewRow_widget
        }
      }
      totalCount
    }
  }
`);
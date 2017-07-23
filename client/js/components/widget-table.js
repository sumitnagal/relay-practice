import React from 'react';
import PropTypes from 'prop-types';
import { createFragmentContainer, graphql } from 'react-relay';

import { connectionEdgesToArray } from '../utils';
import { WidgetEditRowContainer } from './widget-edit-row';
import { WidgetViewRowContainer } from './widget-view-row';

export class WidgetTable extends React.Component {

  static propTypes = {
    viewer: PropTypes.shape({
      widgets: PropTypes.shape({
        edges: PropTypes.array
      }),
    }),
    editWidgetId: PropTypes.string,
    onEditWidget: PropTypes.func,
    onDeleteWidget: PropTypes.func,
    onSaveWidget: PropTypes.func,
    onCancelWidget: PropTypes.func,
  };

  static defaultProps = {
    viewer: {
      widgets: { 
        edge: []
      }
    },
    editWidgetId: 0,
  }

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
            connectionEdgesToArray(this.props.viewer.widgets).map(widget => do {
              if (this.props.editWidgetId === widget.__id) {
                <WidgetEditRowContainer key={widget.__id} widget={widget}
                  onSaveWidget={this.props.onSaveWidget} onCancelWidget={this.props.onCancelWidget} />;
              } else {
                <WidgetViewRowContainer key={widget.__id} widget={widget}
                  onEditWidget={this.props.onEditWidget} onDeleteWidget={this.props.onDeleteWidget} />;
              }
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
          id
          ...widgetViewRow_widget
          ...widgetEditRow_widget
        }
      }
      totalCount
    }
  }
`);
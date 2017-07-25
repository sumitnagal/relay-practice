import React from 'react';
import PropTypes from 'prop-types';
import {
  createFragmentContainer, createRefetchContainer, graphql
} from 'react-relay';

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
    relay: PropTypes.shape({
      refetch: PropTypes.func,
    }),
  };

  static defaultProps = {
    viewer: {
      widgets: { 
        edge: []
      }
    },
    editWidgetId: 0,
  }

  constructor(props) {
    super(props);

    this.state = {
      loadMoreCount: 1,
    };
  }

  loadMore = () => {
    this.props.relay.refetch(fragmentVariables => {

      const loadMoreCount = this.state.loadMoreCount + 1;

      this.setState({
        loadMoreCount,
      });

      return { count: fragmentVariables.count * loadMoreCount };

    }, null);
  };

  loadReset = () => {
    this.props.relay.refetch(fragmentVariables => {

      this.setState({
        loadMoreCount: 1,
      });

      return { count: fragmentVariables.count };

    }, null);
  };

  render() {

    return <div>
      <table className="table table-striped">
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
      </table>
      <button type="button" onClick={this.loadMore}>More</button>
      <button type="button" onClick={this.loadReset}>Reset</button>
    </div>;
  }

}

// export const WidgetTableContainer = createFragmentContainer(WidgetTable, graphql`
//   fragment widgetTable_viewer on Viewer {
//     widgets(first: 2147483647) @connection(key: "widgetTable_widgets")  {
//       edges {
//         node {
//           id
//           ...widgetViewRow_widget
//           ...widgetEditRow_widget
//         }
//       }
//       totalCount
//     }
//   }
// `);

export const WidgetTableRefetchContainer = createRefetchContainer(WidgetTable, graphql.experimental`
  fragment widgetTable_viewer on Viewer @argumentDefinitions(count: { type: "Int", defaultValue: 3 }) {
    widgets(first: $count) @connection(key: "widgetTable_widgets")
       {
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
`, graphql.experimental`
  query widgetTableRefetchQuery($count: Int) {
    viewer {
      ...widgetTable_viewer @arguments(count: $count)
    }
  }
`);

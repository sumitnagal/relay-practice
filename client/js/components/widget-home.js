import React from 'react';
import PropTypes from 'prop-types';
import { createFragmentContainer, graphql } from 'react-relay';
// import { RecordSourceInspector } from 'relay-runtime';

import { WidgetTableContainer } from './widget-table';

import { updateWidget } from '../mutations/update-widget-mutation';
import { deleteWidget } from '../mutations/delete-widget-mutation';

export class WidgetHome extends React.Component {

  static propTypes = {
    viewer: PropTypes.object,
    relay: PropTypes.shape({
      environment: PropTypes.object.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      editWidgetId: '',
    };

    // // store which contains store functions and contains the source which is the data
    // const store = this.props.relay.environment.getStore();
    // // source is the data itself (think of it as state)
    // const source = store.getSource();
    // // provides debugging to view the store
    // const inspector = new RecordSourceInspector(source);
    // // all records with ids
    // console.log(inspector.getNodes());
    // // all records with or without ids
    // console.log(inspector.getRecords());
    // // get by an id, and inspect
    // console.log(inspector.get('Vmlld2VyOjE=').inspect());
  }

  editWidget = editWidgetId => {
    this.setState({
      editWidgetId,
    });
  };

  deleteWidget = widgetId => {
    deleteWidget(
      this.props.relay.environment,
      widgetId,
      this.props.viewer,
    );
    this.setState({
      editWidgetId: '',
    });
  };

  saveWidget = widget => {
    
    updateWidget(
      this.props.relay.environment,
      widget,
    );

    this.setState({
      editWidgetId: '',
    });
  };

  cancelWidget = () => {
    this.setState({
      editWidgetId: '',
    });
  };

  render() {

    return <section>
      <WidgetTableContainer viewer={this.props.viewer} editWidgetId={this.state.editWidgetId}
        onEditWidget={this.editWidget} onDeleteWidget={this.deleteWidget}
        onSaveWidget={this.saveWidget} onCancelWidget={this.cancelWidget} />
      <div>
        Widget Count: {this.props.viewer.widgets && this.props.viewer.widgets.totalCount}
      </div> 
    </section>;
  }

}

// GraphQL Directives for Relay Modern
// @connection - names a connection for use with pagination, also required to retrieve a connection
// @relay - used when an array of objects will be returned
// @inline - allows the inlining of shared fragments, but considered to be anti-pattern to have
// shared fragments. If shared fragments are being used a new container may be needed

// all graphql fragments on all components are combined together on the root of the
// component tree (queryrenderer? )
// fragments from other containers can be re-used in other containers

// if multiple queries are needed, then an object can be passed in as
// the second argument, the property names of the object must correspond
// to the name of the prop from the fragment name
export const WidgetHomeContainer = createFragmentContainer(WidgetHome, {
  // the name of the fragment follows the pattern <file_name>_<prop_name>
  // the name of this file is 'widget-app-container' which is normalized to
  // 'widgetsAppContainer'
  // the name of the prop is 'viewer'
  // so the named of the fragment is 'widgetsAppContainer_viewer'
  // the viewer props will be populated with the payload returned form the query
  // Directive @connection
  // the key is used to fetch the connection from the source cache
  // connection key connects to the sharedUpdater on the add widget mutation
  // must explicit on the fields for this container, references to fragments
  // only load data for child containers, not the current one
  viewer: graphql`
    fragment widgetHome_viewer on Viewer {
      id
      widgets(first: 2147483647) @connection(key: "widgetTable_widgets")  {
        edges {
          node {
            id
          }
        }
        totalCount
      }
      ...widgetTable_viewer
    }
  ` 
});

 
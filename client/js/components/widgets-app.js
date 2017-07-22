import React from 'react';
import PropTypes from 'prop-types';
import { RecordSourceInspector } from 'relay-runtime';

import { WidgetTable } from './widget-table';
import { WidgetForm } from './widget-form';
import { connectionEdgesToArray } from '../utils';

import { insertWidget } from '../mutations/insert-widget-mutation';

export class WidgetsApp extends React.Component {

  static propTypes = {
    appTitle: PropTypes.string,
    viewer: PropTypes.object,
    relay: PropTypes.shape({
      environment: PropTypes.object.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);

    // store which contains store functions and contains the source which is the data
    const store = this.props.relay.environment.getStore();
    // source is the data itself (think of it as state)
    const source = store.getSource();
    // provides debugging to view the store
    const inspector = new RecordSourceInspector(source);
    // all records with ids
    console.log(inspector.getNodes());
    // all records with or without ids
    console.log(inspector.getRecords());
    // get by an id, and inspect
    console.log(inspector.get('Vmlld2VyOjE=').inspect());
  }

  addWidget = widget => {
    insertWidget(
      // provided by relay import
      this.props.relay.environment,
      // normal widget object provided by widget form
      widget,
      // viewer prop which was populated by the graphql query defined
      // in widgets-app-container
      this.props.viewer,
    );
  }

  render() {

    // connectionEdgesToArray - simple util function to convert the 'edge'
    // object structure to a normal array to use with presentation components

    return <section>
      <header>
        <h1>{this.props.appTitle}</h1>
      </header>
      <WidgetTable widgets={connectionEdgesToArray(this.props.viewer.widgets)} />
      <div>
        Widget Count: {this.props.viewer.widgets.totalCount}
      </div>
      <WidgetForm onSave={this.addWidget} />
      <footer>
        <small>&copy; 2017, Training 4 Developers, Inc.</small>
      </footer>
    </section>;
  }

}
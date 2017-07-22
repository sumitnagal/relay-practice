import React from 'react';
import PropTypes from 'prop-types';

import { WidgetTable } from './widget-table';
import { WidgetForm } from './widget-form';
import { connectionEdgesToArray } from '../utils';

import { insertWidget } from '../mutations/insert-widget-mutation';

export class WidgetsApp extends React.Component {

  static propTypes = {
    viewer: PropTypes.object,
    relay: PropTypes.shape({
      environment: PropTypes.object.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);
  }

  addWidget = widget => {
    insertWidget(
      this.props.relay.environment,
      widget,
      this.props.viewer,
    );
  }

  render() {

    return <section>
      <header>
        <h1>Widgets App</h1>
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
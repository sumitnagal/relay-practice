import React from 'react';
import PropTypes from 'prop-types';
import { createFragmentContainer, graphql } from 'react-relay';

import { WidgetForm } from './widget-form';
import { insertWidget } from '../mutations/insert-widget-mutation';

export class WidgetCreate extends React.Component {

  static propTypes = {
    router: PropTypes.shape({
      push: PropTypes.func,
    }),
    viewer: PropTypes.object,
    relay: PropTypes.shape({
      environment: PropTypes.object.isRequired,
    }).isRequired,    
  };

  constructor(props) {
    super(props);

    this.addWidget = this.addWidget.bind(this);
  }

  addWidget(widget) {

    insertWidget(
      // provided by relay import
      this.props.relay.environment,
      // normal widget object provided by widget form
      widget,
      // viewer prop which was populated by the graphql query defined
      // in widgets-app-container
      this.props.viewer,
    ).then(() => {
      this.props.router.push('/');
    });
    
  }

  render() {
    return <section>
      <WidgetForm onSave={this.addWidget} />
    </section>;
  }

}

export const WidgetCreateContainer = createFragmentContainer(WidgetCreate, graphql`
  fragment widgetCreate_viewer on Viewer { id }
`);
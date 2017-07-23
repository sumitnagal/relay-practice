import React from 'react';
import PropTypes from 'prop-types';
import { createFragmentContainer, graphql } from 'react-relay';

export class WidgetViewRow extends React.Component {

  static propTypes = {
    widget: PropTypes.object,
    onEditWidget: PropTypes.func,
    onDeleteWidget: PropTypes.func,
  };

  render() {
    return <tr>
      <td>{this.props.widget.name}</td>
      <td>{this.props.widget.description}</td>
      <td>{this.props.widget.color}</td>
      <td>{this.props.widget.size}</td>
      <td>{this.props.widget.quantity}</td>
      <td>
        <button type="button" onClick={() => this.props.onEditWidget(this.props.widget.id)}>Edit</button>
        <button type="button" onClick={() => this.props.onDeleteWidget(this.props.widget.id)}>Delete</button>
      </td>
    </tr>;
  }
}

// only one query is needed, so an object is not needed
export const WidgetViewRowContainer = createFragmentContainer(WidgetViewRow, graphql`
    fragment widgetViewRow_widget on Widget {
      id name description color size quantity
    }
  `);
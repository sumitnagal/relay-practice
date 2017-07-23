import React from 'react';
import PropTypes from 'prop-types';
import { createFragmentContainer, graphql } from 'react-relay';

export class WidgetEditRow extends React.Component {

  static propTypes = {
    widget: PropTypes.object,
    onSaveWidget: PropTypes.func,
    onCancelWidget: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = { ...props.widget }; 
  }

  onChange = e => {
    this.setState({
      [ e.currentTarget.name ]: e.currentTarget.type === 'number'
        ? Number(e.currentTarget.value)
        : e.currentTarget.value,
    });
  };

  saveWidget = () => {
    this.props.onSaveWidget({ ...this.state });
  }

  render() {
    return <tr>
      <td><input type="text" name="name" id="edit-name-input"
        value={this.state.name} onChange={this.onChange} /></td>
      <td><input type="text" name="description" id="edit-description-input"
        value={this.state.description} onChange={this.onChange} /></td>
      <td><input type="text" name="color" id="edit-color-input"
        value={this.state.color} onChange={this.onChange} /></td>
      <td><input type="text" name="size" id="edit-size-input"
        value={this.state.size} onChange={this.onChange} /></td>
      <td><input type="number" name="quantity" id="edit-quantity-input"
        value={this.state.quantity} onChange={this.onChange} /></td>
      <td>
        <button type="button" onClick={this.saveWidget}>Save</button>
        <button type="button" onClick={this.props.onCancelWidget}>Cancel</button>
      </td>
    </tr>;
  }
}

// only one query is needed, so an object is not needed
export const WidgetEditRowContainer = createFragmentContainer(WidgetEditRow, graphql`
    fragment widgetEditRow_widget on Widget {
      id name description color size quantity
    }
  `);
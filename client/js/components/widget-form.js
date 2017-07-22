import React from 'react';
import PropTypes from 'prop-types';

export class WidgetForm extends React.Component {

  static propTypes = {
    onSave: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      name: '',
      description: '',
      color: '',
      size: '',
      quantity: 0,
    };
  }

  onChange = e => {
    this.setState({
      [ e.currentTarget.name ]: e.currentTarget.type === 'number'
        ? Number(e.currentTarget.value)
        : e.currentTarget.value,
    });
  };

  onClick = () => {
    this.props.onSave(this.state);
    this.setState({
      name: '',
      description: '',
      color: '',
      size: '',
      quantity: 0,
    });
  }

  render() {
    return <form>
      <div>
        <label htmlFor="name-input">Name:</label>
        <input type="text" id="name-input" name="name"
          value={this.state.name} onChange={this.onChange} />
      </div>
      <div>
        <label htmlFor="description-input">Description:</label>
        <input type="text" id="description-input" name="description"
          value={this.state.description} onChange={this.onChange} />
      </div>
      <div>
        <label htmlFor="color-input">Color:</label>
        <input type="text" id="color-input" name="color"
          value={this.state.color} onChange={this.onChange} />
      </div>
      <div>
        <label htmlFor="size-input">Size:</label>
        <input type="text" id="size-input" name="size"
          value={this.state.size} onChange={this.onChange} />
      </div>
      <div>
        <label htmlFor="quantity-input">Quantity:</label>
        <input type="number" id="quantity-input" name="quantity"
          value={this.state.quantity} onChange={this.onChange} />
      </div>
      <button type="button" onClick={this.onClick}>Save Widget</button>
    </form>;
  }
}
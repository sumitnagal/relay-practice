import React from 'react';
import PropTypes from 'prop-types';

export class WidgetTable extends React.Component {

  static propTypes = {
    widgets: PropTypes.array,
  };

  static defaultProps = {
    widgets: [],
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
        {this.props.widgets.map(widget =>
          <tr key={widget.id}>
            <td>{widget.name}</td>
            <td>{widget.description}</td>
            <td>{widget.color}</td>
            <td>{widget.size}</td>
            <td>{widget.quantity}</td>
          </tr>
        )}
      </tbody>
    </table>;

  }

}
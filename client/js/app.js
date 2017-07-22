import 'bootstrap-loader';
import '../scss/styles.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {
  createBrowserRouter, makeRouteConfig, Route, Link
} from 'found';

import { HomePage } from './components/home-page'; 
import { CreatePage } from './components/create-page';

class AppPage extends React.Component {

  static propTypes = {
    children: PropTypes.object,
  };

  render() {
    return <div>
      <header>
        <h1>Widgets Tool</h1>
      </header>
      <nav>
        <ul>
          <li>
            <Link to="/create" activeClassName="active">
              Create Widget
            </Link>
          </li>
        </ul>
      </nav>
      {this.props.children}
      <footer>
        <small>&copy; 2017, Training 4 Developers, Inc.</small>
      </footer>
    </div>;
  }
}

const BrowserRouter = createBrowserRouter({
  routeConfig: makeRouteConfig(
    <Route path="/" Component={AppPage}>
      <Route Component={HomePage} />
      <Route path="create" Component={CreatePage} />
    </Route>
  ),
});

ReactDOM.render(
  <BrowserRouter />,
  document.querySelector('main'),
);
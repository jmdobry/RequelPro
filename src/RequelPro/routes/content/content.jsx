import styles from './content.scss';
import React from 'react';
import Connection from '../../models/connection.js';

let Content = React.createClass({
  /*
   * Lifecycle
   */
  getInitialState() {
    return {
      connection: Connection.current(),
      connections: Connection.getAll()
    };
  },
  /*
   * Methods
   */
  render() {
    return (
      <div id="contentPage">
        <div className="row panel radius">
        Content page
        </div>
      </div>
    );
  }
});

export default Content;

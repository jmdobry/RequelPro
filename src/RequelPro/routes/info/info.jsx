import styles from './info.scss';
import React from 'react';
import layout from '../../services/layout.js';
import Table from '../../models/table.js';
import Connection from '../../models/connection.js';
import Database from '../../models/database.js';

let getData = params => {
  let table = null;
  if (params.tableId) {
    table = Table.get(params.tableId);
  }
  return { table };
};

let Info = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },
  /*
   * Lifecycle
   */
  getInitialState() {
    return getData(this.context.router.getCurrentParams());
  },
  componentDidMount() {
    layout.maximize('#info');
  },
  componentWillReceiveProps() {
    this.onChange();
  },
  /*
   * Event Handlers
   */
  onChange() {
    this.setState(getData(this.context.router.getCurrentParams()));
  },
  /*
   * Methods
   */
  render() {
    return (
      <div id="info" className="panel">
      This page will be able to tell you as much about the table as possible.
      </div>
    );
  }
});

export default Info;

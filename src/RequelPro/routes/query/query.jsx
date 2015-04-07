import styles from './query.scss';
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

let Query = React.createClass({
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
    layout.maximize('#query');
  },
  /*
   * Event Handlers
   */
  onChange() {
    this.setState(getData(this.context.router.getCurrentParams()));
  },
  componentWillReceiveProps() {
    this.onChange();
  },
  /*
   * Methods
   */
  render() {
    return (
      <div id="query">
      Query page  - {this.state.table.id}
      </div>
    );
  }
});

export default Query;

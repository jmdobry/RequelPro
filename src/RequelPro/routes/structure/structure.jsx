import styles from './structure.scss';
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

let Structure = React.createClass({
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
    layout.maximize('#structure');
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
      <div id="structure">
      Structure page  - {this.state.table.id}
      </div>
    );
  }
});

export default Structure;

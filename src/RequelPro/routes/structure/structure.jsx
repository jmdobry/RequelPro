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
      <div id="structure" className="panel">
      The goal of this feature is to allow you to define in RequelPro a schema for each table, so RequelPro can report data with missing or invalidate values. It could even make an initial attempt to infer the schema from the table's data.
      </div>
    );
  }
});

export default Structure;

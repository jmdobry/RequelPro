import React from 'react';
import layout from '../../services/layout.js';
import Table from '../../models/table.js';
import styles from './structure.scss';

let Structure = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },
  /*
   * Lifecycle
   */
  getInitialState() {
    return this.getState();
  },
  componentDidMount() {
    layout.maximize('#structure');
  },
  componentWillReceiveProps() {
    this.onChange();
  },
  /*
   * Event Handlers
   */
  onChange() {
    this.setState(this.getState());
  },
  /*
   * Methods
   */
  getState() {
    let params = this.context.router.getCurrentParams();
    let table = null;
    if (params.tableId) {
      table = Table.get(params.tableId);
    }
    return { table };
  },
  render() {
    return (
      <div id="structure" className="panel">
      The goal of this feature is to allow you to define in RequelPro a schema for each table, so RequelPro can report data with missing or invalidate values. It could even make an initial attempt to infer the schema from the table's data.
      </div>
    );
  }
});

export default Structure;

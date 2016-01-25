import React from 'react';
import layout from '../../services/layout.js';
import Table from '../../models/table.js';
import styles from './query.scss';

let Query = React.createClass({
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
    layout.maximize('#query');
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
      <div id="query" className="panel">
      The goal here is to have an awesome query editor/runner like the one in RethinkDB's admin UI.
      </div>
    );
  }
});

export default Query;

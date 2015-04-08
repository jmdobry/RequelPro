import React from 'react';
import layout from '../../services/layout.js';
import Table from '../../models/table.js';
import styles from './info.scss';

let Info = React.createClass({
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
    layout.maximize('#info');
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
      <div id="info" className="panel">
      This page will be able to tell you as much about the table as possible.
      </div>
    );
  }
});

export default Info;

import React from 'react';
import layout from '../../services/layout.js';
import Table from '../../models/table.js';
import styles from './relations.scss';

let Relations = React.createClass({
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
    layout.maximize('#relations');
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
      <div id="relations" className="panel">
      The goal of this feature is so you can tell RequelPro about your normalized data, so RequelPro can make exploring related data easier.
      </div>
    );
  }
});

export default Relations;

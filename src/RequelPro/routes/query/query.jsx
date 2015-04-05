import styles from './query.scss';
import React from 'react';
import layout from '../../services/layout.js';

let Query = React.createClass({
  componentDidMount() {
    layout.maximize('#queryPage > .panel');
  },
  /*
   * Methods
   */
  render() {
    return (
      <div id="queryPage">
        <div className="row panel">
        Query page
        </div>
      </div>
    );
  }
});

export default Query;

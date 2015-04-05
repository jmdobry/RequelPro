import styles from './info.scss';
import React from 'react';
import layout from '../../services/layout.js';

let Info = React.createClass({
  /*
   * Lifecycle
   */
  componentDidMount() {
    layout.maximize('#infoPage');
  },
  /*
   * Methods
   */
  render() {
    return (
      <div id="infoPage">
        <div className="row panel">
        Info page
        </div>
      </div>
    );
  }
});

export default Info;

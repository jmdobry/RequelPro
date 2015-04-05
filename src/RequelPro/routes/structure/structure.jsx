import styles from './structure.scss';
import React from 'react';
import layout from '../../services/layout.js';

let Structure = React.createClass({
  componentDidMount() {
    layout.maximize('#structurePage > .panel');
  },
  /*
   * Methods
   */
  render() {
    return (
      <div id="structurePage">
        <div className="row panel">
        Structure page
        </div>
      </div>
    );
  }
});

export default Structure;

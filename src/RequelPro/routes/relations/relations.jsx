import styles from './relations.scss';
import React from 'react';
import layout from '../../services/layout.js';

let Relations = React.createClass({
  componentDidMount() {
    layout.maximize('#relationsPage > .panel');
  },
  /*
   * Methods
   */
  render() {
    return (
      <div id="relationsPage">
        <div className="row panel">
        Relations page
        </div>
      </div>
    );
  }
});

export default Relations;
